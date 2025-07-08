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
  const [showFullExample, setShowFullExample] = React.useState(false);

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
          <div className="mt-2">
            <span className="text-xs text-muted-foreground">
              Przykładowy schemat pliku:
            </span>
            <div className="relative">
              <pre
                className={`bg-muted rounded p-2 text-xs mt-1 font-mono leading-5 transition-all duration-300 ${
                  showFullExample
                    ? "max-h-96 overflow-x-auto overflow-y-auto"
                    : "max-h-32 overflow-x-auto overflow-y-hidden"
                }`}
                style={{
                  position: "relative",
                  backgroundColor: showFullExample
                    ? undefined
                    : undefined, // zachowaj Tailwind bg-muted
                  color: "inherit",
                }}
              >
                <code>
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>[</span>
                  {"\n  "}
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>{`{`}</span>
                  {"\n    "}
                  <span style={{ color: "#059669" }}>&quot;content&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>
                    &quot;Stolica Polski to?&quot;
                  </span>
                  <span style={{ color: "#64748b" }}>,</span>
                  {"\n    "}
                  <span style={{ color: "#059669" }}>&quot;answers&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>{`{`}</span>
                  {"\n      "}
                  <span style={{ color: "#059669" }}>&quot;A&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>&quot;Warszawa&quot;</span>
                  <span style={{ color: "#64748b" }}>,</span>
                  {"\n      "}
                  <span style={{ color: "#059669" }}>&quot;B&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>&quot;Kraków&quot;</span>
                  <span style={{ color: "#64748b" }}>,</span>
                  {"\n      "}
                  <span style={{ color: "#059669" }}>&quot;C&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>&quot;Gdańsk&quot;</span>
                  <span style={{ color: "#64748b" }}>,</span>
                  {"\n      "}
                  <span style={{ color: "#059669" }}>&quot;D&quot;</span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>&quot;Wrocław&quot;</span>
                  {"\n    "}
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>{`}`}</span>
                  <span style={{ color: "#64748b" }}>,</span>
                  {"\n    "}
                  <span style={{ color: "#059669" }}>
                    &quot;correctAnswer&quot;
                  </span>
                  <span style={{ color: "#64748b" }}>: </span>
                  <span style={{ color: "#b91c1c" }}>&quot;A&quot;</span>
                  {"\n  "}
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>{`}`}</span>
                  {"\n"}
                  <span style={{ color: "#6d28d9", ...(typeof window !== "undefined" && document.documentElement.classList.contains("dark") ? { color: "#d1d5db" } : {}) }}>]</span>
                </code>
                {!showFullExample && (
                  <div
                    className="absolute left-0 right-0 bottom-0 h-10 pointer-events-none rounded-b"
                    style={{
                      pointerEvents: "none",
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "2.5rem",
                      background:
                        typeof window !== "undefined" && document.documentElement.classList.contains("dark")
                          ? "linear-gradient(to top, #18181b, rgba(24,24,27,0))"
                          : "linear-gradient(to top, #f3f4f6, rgba(243,244,246,0))",
                      opacity: showFullExample ? 0 : 1,
                      transition: "opacity 0.2s",
                      zIndex: 2,
                    }}
                  />
                )}
              </pre>
              <button
                type="button"
                className="absolute right-2 bottom-2 z-10 text-xs px-2 py-1 rounded bg-background/80 border border-muted-foreground hover:bg-background"
                style={{ display: "block" }}
                onClick={() => setShowFullExample((v) => !v)}
              >
                {showFullExample ? "Pokaż mniej" : "Pokaż całość"}
              </button>
            </div>
          </div>
        </DialogHeader>
        <div className="flex items-center gap-2 mt-2">
          <input
            id="import-file-input"
            type="file"
            accept="application/json"
            onChange={handleFileChange}
            disabled={importing}
            className="hidden"
          />
          <label htmlFor="import-file-input">
            <Button
              asChild
              variant="outline"
              type="button"
              disabled={importing}
            >
              <span>Przeglądaj plik...</span>
            </Button>
          </label>
          {jsonPreview && (
            <span className="text-xs text-muted-foreground ml-2">
              Wybrano plik JSON
            </span>
          )}
        </div>
        {jsonPreview && !parsedQuestions && (
          <div className="mt-2 max-h-40 overflow-auto bg-gray-100 dark:bg-gray-800 rounded p-2 text-xs font-mono whitespace-pre-wrap">
            {jsonPreview.slice(0, 2000)}
            {jsonPreview.length > 2000 ? "..." : ""}
          </div>
        )}
        {parsedQuestions && !parseError && (
          <div className="mt-2">
            <div className="text-green-700 dark:text-green-300 text-sm mb-2">
              Plik poprawny. Liczba pytań: {parsedQuestions.length}
            </div>
            <ul className="max-h-40 overflow-auto bg-muted rounded p-2 text-xs divide-y divide-muted-foreground/20">
              {parsedQuestions.map((q, i) => (
                <li key={i} className="py-1 flex flex-col gap-0.5">
                  <span className="font-medium text-muted-foreground">
                    {i + 1}. {q.content}
                  </span>
                  <span className="text-[11px] text-muted-foreground/80 flex flex-wrap gap-2">
                    {(["A", "B", "C", "D"] as const).map((key) => (
                      <span
                        key={key}
                        className={
                          q.correctAnswer === key
                            ? "underline underline-offset-2 font-semibold text-green-700 dark:text-green-300"
                            : ""
                        }
                      >
                        {key}: {q.answers?.[key]}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {parseError && (
          <div className="text-red-600 text-sm mt-2">{parseError}</div>
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
