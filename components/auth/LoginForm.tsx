"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/hooks/use-auth";

interface LoginFormProps {
  role: UserRole;
  onLogin: (password: string, role: UserRole) => Promise<boolean>;
}

export function LoginForm({ role, onLogin }: LoginFormProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Wprowadź hasło");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await onLogin(password, role);

      if (!success) {
        setError("Nieprawidłowe hasło");
        setPassword("");
      }
    } catch (error) {
      setError("Błąd podczas logowania");
      console.error("Błąd logowania:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const roleTitle = role === "admin" ? "Administrator" : "Gracz";
  const roleDescription =
    role === "admin"
      ? "Panel administracyjny gry Zstlionerzy"
      : "Panel gracza gry Zstlionerzy";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-blue-900 to-purple-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{roleTitle}</CardTitle>
          <p className="text-muted-foreground">{roleDescription}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wprowadź hasło"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
