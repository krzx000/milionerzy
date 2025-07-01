import { Question } from "@/types/question";

const API_BASE_URL = "/api";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
  deletedCount?: number;
  deletedIds?: string[];
}

export class QuestionsAPI {
  // Pobierz wszystkie pytania
  static async getAll(): Promise<ApiResponse<Question[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Pobierz pojedyncze pytanie
  static async getById(id: string): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`);
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Dodaj nowe pytanie
  static async create(
    question: Omit<Question, "id">
  ): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Zaktualizuj pytanie
  static async update(
    id: string,
    question: Omit<Question, "id">
  ): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Usuń pytanie
  static async delete(id: string): Promise<ApiResponse<Question>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Usuń wiele pytań
  static async deleteMany(ids: string[]): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }

  // Usuń wszystkie pytania
  static async deleteAll(): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: "DELETE",
      });
      return await response.json();
    } catch {
      return {
        success: false,
        error: "Błąd połączenia z serwerem",
      };
    }
  }
}
