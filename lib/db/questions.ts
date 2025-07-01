import { Question } from "@/types/question";
import { prisma } from "./prisma";
import { Question as PrismaQuestion } from "@prisma/client";

// Funkcje mapowania między bazą danych a typami aplikacji
const mapPrismaToQuestion = (prismaQuestion: PrismaQuestion): Question => ({
  id: prismaQuestion.id,
  content: prismaQuestion.content,
  answers: {
    A: prismaQuestion.answerA,
    B: prismaQuestion.answerB,
    C: prismaQuestion.answerC,
    D: prismaQuestion.answerD,
  },
  correctAnswer: prismaQuestion.correctAnswer as "A" | "B" | "C" | "D",
});

const mapQuestionToPrisma = (question: Omit<Question, "id">) => ({
  content: question.content,
  answerA: question.answers.A,
  answerB: question.answers.B,
  answerC: question.answers.C,
  answerD: question.answers.D,
  correctAnswer: question.correctAnswer,
});

// Funkcje helper do zarządzania pytaniami z użyciem Prisma
export const questionsDb = {
  getAll: async () => {
    const prismaQuestions = await prisma.question.findMany({
      orderBy: { createdAt: "desc" },
    });
    return prismaQuestions.map(mapPrismaToQuestion);
  },

  getById: async (id: string) => {
    const prismaQuestion = await prisma.question.findUnique({
      where: { id },
    });
    return prismaQuestion ? mapPrismaToQuestion(prismaQuestion) : null;
  },

  create: async (questionData: Omit<Question, "id">) => {
    const prismaQuestion = await prisma.question.create({
      data: mapQuestionToPrisma(questionData),
    });
    return mapPrismaToQuestion(prismaQuestion);
  },

  update: async (id: string, questionData: Omit<Question, "id">) => {
    try {
      const prismaQuestion = await prisma.question.update({
        where: { id },
        data: mapQuestionToPrisma(questionData),
      });
      return mapPrismaToQuestion(prismaQuestion);
    } catch {
      return null; // Pytanie nie zostało znalezione
    }
  },

  delete: async (id: string) => {
    try {
      const prismaQuestion = await prisma.question.delete({
        where: { id },
      });
      return mapPrismaToQuestion(prismaQuestion);
    } catch {
      return null; // Pytanie nie zostało znalezione
    }
  },

  deleteMany: async (ids: string[]) => {
    const prismaQuestions = await prisma.question.findMany({
      where: { id: { in: ids } },
    });

    await prisma.question.deleteMany({
      where: { id: { in: ids } },
    });

    return prismaQuestions.map(mapPrismaToQuestion);
  },

  deleteAll: async () => {
    const result = await prisma.question.deleteMany();
    return result.count;
  },
};
