"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Question, AnswerOption } from "@/types/question";

const questionSchema = z.object({
  content: z.string().min(5, "Pytanie musi mieć przynajmniej 5 znaków"),
  answers: z.object({
    A: z.string().min(1, "Odpowiedź A jest wymagana"),
    B: z.string().min(1, "Odpowiedź B jest wymagana"),
    C: z.string().min(1, "Odpowiedź C jest wymagana"),
    D: z.string().min(1, "Odpowiedź D jest wymagana"),
  }),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: Question;
  onSave: (question: Omit<Question, "id"> & { id?: string }) => void;
}

export function QuestionDialog({
  open,
  onOpenChange,
  question,
  onSave,
}: QuestionDialogProps) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      content: question?.content || "",
      answers: question?.answers || { A: "", B: "", C: "", D: "" },
      correctAnswer: question?.correctAnswer || "A",
    },
  });

  React.useEffect(() => {
    if (question) {
      form.reset({
        content: question.content,
        answers: question.answers,
        correctAnswer: question.correctAnswer,
      });
    } else {
      form.reset({
        content: "",
        answers: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
      });
    }
  }, [question, form]);

  const onSubmit = (data: QuestionFormData) => {
    onSave({
      id: question?.id,
      content: data.content,
      answers: data.answers,
      correctAnswer: data.correctAnswer,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {question ? "Edytuj pytanie" : "Dodaj nowe pytanie"}
          </DialogTitle>
          <DialogDescription>
            Wprowadź treść pytania, cztery odpowiedzi i wybierz poprawną.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Treść pytania</FormLabel>
                  <FormControl>
                    <Input placeholder="Wprowadź treść pytania..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Odpowiedzi</h3>

                {(["A", "B", "C", "D"] as AnswerOption[]).map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name={`answers.${option}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Odpowiedź {option}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`Wprowadź odpowiedź ${option}...`}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Poprawna odpowiedź</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Wybierz poprawną odpowiedź" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(["A", "B", "C", "D"] as AnswerOption[]).map(
                          (option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Anuluj
              </Button>
              <Button type="submit">
                {question ? "Zapisz zmiany" : "Dodaj pytanie"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
