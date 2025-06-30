"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/question";

interface QuestionViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
}

export function QuestionViewDialog({
  open,
  onOpenChange,
  question,
}: QuestionViewDialogProps) {
  if (!question) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Podgląd pytania</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Pytanie:</h3>
            <p className="text-base leading-relaxed p-4 bg-muted rounded-lg">
              {question.content}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Odpowiedzi:</h3>
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(question.answers).map(([option, answer]) => (
                <div
                  key={option}
                  className={`p-3 rounded-lg border-2 ${
                    option === question.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-muted bg-muted/50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        option === question.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-muted-foreground/20 text-muted-foreground"
                      }`}
                    >
                      {option}
                    </span>
                    <span className="flex-1">{answer}</span>
                    {option === question.correctAnswer && (
                      <Badge variant="default" className="bg-green-500">
                        Poprawna
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
