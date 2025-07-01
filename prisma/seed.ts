import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleQuestions = [
  {
    content: "Stolica Polski to:",
    answerA: "Kraków",
    answerB: "Warszawa",
    answerC: "Gdańsk",
    answerD: "Wrocław",
    correctAnswer: "B",
  },
  {
    content: "Kto napisał 'Pan Tadeusz'?",
    answerA: "Adam Mickiewicz",
    answerB: "Juliusz Słowacki",
    answerC: "Henryk Sienkiewicz",
    answerD: "Bolesław Prus",
    correctAnswer: "A",
  },
  {
    content:
      "Jaka jest wartość liczby π z dokładnością do trzech miejsc po przecinku?",
    answerA: "3.141",
    answerB: "3.142",
    answerC: "3.143",
    answerD: "3.144",
    correctAnswer: "B",
  },
  {
    content: "Które państwo ma największą powierzchnię na świecie?",
    answerA: "Chiny",
    answerB: "USA",
    answerC: "Rosja",
    answerD: "Kanada",
    correctAnswer: "C",
  },
  {
    content: "W którym roku odbył się pierwszy lot braci Wright?",
    answerA: "1901",
    answerB: "1903",
    answerC: "1905",
    answerD: "1907",
    correctAnswer: "B",
  },
];

async function main() {
  console.log("Start seedowania bazy danych...");

  // Usuń wszystkie istniejące pytania
  await prisma.question.deleteMany();
  console.log("Usunięto wszystkie istniejące pytania");

  // Dodaj przykładowe pytania
  for (const question of sampleQuestions) {
    await prisma.question.create({
      data: question,
    });
  }

  console.log(`Dodano ${sampleQuestions.length} przykładowych pytań`);
  console.log("Seedowanie zakończone!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
