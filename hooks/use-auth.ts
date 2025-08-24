"use client";

import { useState, useEffect } from "react";

export type UserRole = "admin" | "player";

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  expiresAt: number | null;
}

const AUTH_STORAGE_KEY = "milionerzy_auth";
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 godziny w milisekundach

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    expiresAt: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sprawdź autoryzację przy ładowaniu
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!stored) {
        setIsLoading(false);
        return;
      }

      const authData: AuthState = JSON.parse(stored);
      const now = Date.now();

      // Sprawdź czy autoryzacja nie wygasła
      if (authData.expiresAt && authData.expiresAt > now) {
        setAuthState(authData);
      } else {
        // Autoryzacja wygasła - wyczyść
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthState({
          isAuthenticated: false,
          role: null,
          expiresAt: null,
        });
      }
    } catch (error) {
      console.error("Błąd podczas sprawdzania autoryzacji:", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (password: string, role: UserRole): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, role }),
      });

      if (response.ok) {
        const expiresAt = Date.now() + AUTH_DURATION;
        const newAuthState: AuthState = {
          isAuthenticated: true,
          role,
          expiresAt,
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newAuthState));
        setAuthState(newAuthState);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Błąd podczas logowania:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      role: null,
      expiresAt: null,
    });
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    role: authState.role,
    isLoading,
    login,
    logout,
  };
}
