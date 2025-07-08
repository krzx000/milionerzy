"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QuestionsAPI } from "@/lib/api/questions";
import { Question as QuestionType } from "@/types/question";

interface QuestionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

export function QuestionImportDialog({
  open,
  onOpenChange,
  onImportSuccess,
}: QuestionImportDialogProps) {
  const [jsonPreview, setJsonPreview] = React.useState<string>("");
  const [parseError, setParseError] = React.useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = React.useState<
    QuestionType[] | null
  >(null);
  const [importing, setImporting] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setParseError(null);
    setParsedQuestions(null);
    setJsonPreview("");
    if (!f) return;
    try {
      const text = await f.text();
      setJsonPreview(text);
      const data = JSON.parse(text);
      if (!Array.isArray(data))
        throw new Error("Plik musi zawierać tablicę pytań");
      // Prosta walidacja każdego pytania
      for (const [i, q] of data.entries()) {
        if (!q.content || typeof q.content !== "string")
          throw new Error(
            `Pytanie #${i + 1}: Brak lub nieprawidłowa treść pytania (content)`
          );
        if (!q.answers || typeof q.answers !== "object")
          throw new Error(`Pytanie #${i + 1}: Brak odpowiedzi (answers)`);
        const keys = Object.keys(q.answers);
        if (
          !keys.includes("A") ||
          !keys.includes("B") ||
          !keys.includes("C") ||
          !keys.includes("D")
        )
          throw new Error(
            `Pytanie #${i + 1}: Odpowiedzi muszą zawierać klucze A, B, C, D`
          );
        if (!q.correctAnswer || !["A", "B", "C", "D"].includes(q.correctAnswer))
          throw new Error(
            `Pytanie #${i + 1}: Poprawna odpowiedź musi być jedną z: A, B, C, D`
          );
      }
      setParsedQuestions(data);
    } catch (err) {
      setParseError((err as Error).message || "Błąd parsowania pliku");
    }
  };

  const handleImport = async () => {
    if (!parsedQuestions) return;
    setImporting(true);
    try {
      let importedCount = 0;
      for (const q of parsedQuestions) {
        await QuestionsAPI.create({
          content: q.content,
          answers: q.answers,
          correctAnswer: q.correctAnswer,
        });
        importedCount++;
      }
      toast.success(`Zaimportowano ${importedCount} pytań z pliku`);
      onImportSuccess();
      onOpenChange(false);
    } catch {
      toast.error("Błąd podczas importowania pytań");
    } finally {
      setImporting(false);
    }
  };

  const handleDialogClose = () => {
    setJsonPreview("");
    setParseError(null);
    setParsedQuestions(null);
    setImporting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importuj pytania z pliku</DialogTitle>
          <DialogDescription>
            Wybierz plik JSON z pytaniami. Plik musi zawierać tablicę obiektów
            zgodnych ze schematem pytania.
          </DialogDescription>
        </DialogHeader>
        <input
          type="file"
          accept="application/json"
          onChange={handleFileChange}
          disabled={importing}
        />
        {jsonPreview && (
          <div className="mt-2 max-h-40 overflow-auto bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs font-mono whitespace-pre-wrap">
            {jsonPreview.slice(0, 2000)}
            {jsonPreview.length > 2000 ? "..." : ""}
          </div>
        )}
        {parseError && (
          <div className="text-red-600 text-sm mt-2">{parseError}</div>
        )}
        {parsedQuestions && !parseError && (
          <div className="text-green-700 dark:text-green-300 text-sm mt-2">
            Plik poprawny. Liczba pytań: {parsedQuestions.length}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={importing}>
              Anuluj
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleImport}
            disabled={!parsedQuestions || !!parseError || importing}
          >
            Importuj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
