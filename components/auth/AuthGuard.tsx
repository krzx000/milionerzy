"use client";

import { ReactNode } from "react";
import { useAuth, UserRole } from "@/hooks/use-auth";
import { LoginForm } from "./LoginForm";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, role, isLoading, login } = useAuth();

  // Pokaż loader podczas sprawdzania autoryzacji
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-purple-900">
        <div className="text-white text-lg">Sprawdzanie autoryzacji...</div>
      </div>
    );
  }

  // Jeśli nie jest zalogowany lub ma złą rolę, pokaż formularz logowania
  if (!isAuthenticated || role !== requiredRole) {
    return <LoginForm role={requiredRole} onLogin={login} />;
  }

  // Jeśli jest zalogowany z odpowiednią rolą, pokaż zawartość
  return children;
}
