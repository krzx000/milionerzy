// Server-Sent Events Manager

import {
  SSEClient,
  GameEvent,
  GameEventType,
  ClientType,
} from "@/types/events";
import { logger } from "@/lib/utils/logger";

class SSEManager {
  private clients = new Map<string, SSEClient>();
  private static instance: SSEManager;

  private constructor() {}

  static getInstance(): SSEManager {
    if (!SSEManager.instance) {
      SSEManager.instance = new SSEManager();
    }
    return SSEManager.instance;
  }

  // Dodaj nowego klienta
  addClient(
    id: string,
    type: ClientType,
    controller: ReadableStreamDefaultController
  ): void {
    this.clients.set(id, {
      id,
      type,
      controller,
      connected: new Date(),
    });

    logger.debug(`SSE: Nowy klient połączony: ${id} (type: ${type})`);
    logger.debug(`SSE: Łącznie klientów: ${this.clients.size}`);

    // Wyślij potwierdzenie połączenia
    this.sendToClient(id, {
      type: "connection-established",
      data: {
        clientId: id,
        serverTime: new Date(),
        message: "Połączenie z serwerem nawiązane",
      },
      timestamp: new Date(),
    });
  }

  // Usuń klienta
  removeClient(id: string): void {
    const client = this.clients.get(id);
    if (client) {
      this.clients.delete(id);
      logger.debug(`SSE: Klient rozłączony: ${id}`);
      logger.debug(`SSE: Pozostało klientów: ${this.clients.size}`);
    }
  }

  // Wyślij event do konkretnego klienta
  private sendToClient(clientId: string, event: GameEvent): boolean {
    const client = this.clients.get(clientId);
    if (!client) {
      logger.debug(
        `SSE: Próba wysłania do nieistniejącego klienta ${clientId}`
      );
      return false;
    }

    try {
      const eventData = `event: ${event.type}\ndata: ${JSON.stringify({
        ...event.data,
        timestamp: event.timestamp,
      })}\n\n`;

      logger.debug(`SSE: Wysyłanie do ${clientId} (${client.type}):`, {
        eventType: event.type,
        targetType: event.targetType,
        dataSize: JSON.stringify(event.data).length,
        eventDataPreview: eventData.substring(0, 100) + "...",
      });

      // Konwertuj string na Uint8Array dla ReadableStream
      const encoder = new TextEncoder();
      client.controller.enqueue(encoder.encode(eventData));
      return true;
    } catch (error) {
      console.error(`SSE: Błąd wysyłania do klienta ${clientId}:`, error);
      this.removeClient(clientId);
      return false;
    }
  }

  // Broadcast event do wszystkich klientów określonego typu
  broadcast(
    eventType: GameEventType,
    data: Record<string, unknown>,
    targetType: ClientType = "all"
  ): void {
    const event: GameEvent = {
      type: eventType,
      data,
      timestamp: new Date(),
      targetType,
    };

    logger.debug(
      `SSE: Broadcasting ${eventType} to ${targetType} (${this.getClientCount(
        targetType
      )} clients)`
    );

    // Diagnostyka - pokaż listę klientów
    this.listClients();

    let successCount = 0;
    let failureCount = 0;

    this.clients.forEach((client, clientId) => {
      // Sprawdź czy event ma być wysłany do tego typu klienta
      if (targetType === "all" || client.type === targetType) {
        const success = this.sendToClient(clientId, event);
        if (success) {
          successCount++;
        } else {
          failureCount++;
        }
      }
    });

    logger.debug(
      `SSE: Broadcast ${eventType} - sukcess: ${successCount}, failures: ${failureCount}`
    );
  }

  // Wyślij event do konkretnego klienta
  sendToSpecificClient(
    clientId: string,
    eventType: GameEventType,
    data: Record<string, unknown>
  ): boolean {
    const event: GameEvent = {
      type: eventType,
      data,
      timestamp: new Date(),
    };

    return this.sendToClient(clientId, event);
  }

  // Pomocnicze metody
  getClientCount(type?: ClientType): number {
    if (!type || type === "all") {
      return this.clients.size;
    }
    return Array.from(this.clients.values()).filter(
      (client) => client.type === type
    ).length;
  }

  getClients(type?: ClientType): SSEClient[] {
    if (!type || type === "all") {
      return Array.from(this.clients.values());
    }
    return Array.from(this.clients.values()).filter(
      (client) => client.type === type
    );
  }

  // Funkcja diagnostyczna - wyświetl listę połączonych klientów
  listClients(): void {
    logger.debug(
      `SSE: Lista połączonych klientów (${this.clients.size} total):`
    );
    this.clients.forEach((client, id) => {
      logger.debug(
        `  - ${id} (${client.type}) - connected ${client.connected}`
      );
    });
  }

  // Cleanup nieaktywnych połączeń
  cleanup(): void {
    const now = new Date();
    const maxAge = 5 * 60 * 1000; // 5 minut

    this.clients.forEach((client, clientId) => {
      const age = now.getTime() - client.connected.getTime();
      if (age > maxAge) {
        console.log(`SSE: Usuwanie nieaktywnego klienta: ${clientId}`);
        this.removeClient(clientId);
      }
    });
  }

  // Heartbeat dla utrzymania połączeń
  sendHeartbeat(): void {
    this.broadcast("admin-message", {
      type: "heartbeat",
      timestamp: new Date(),
    });
  }
}

// Export singleton instance
export const sseManager = SSEManager.getInstance();

// Convenience functions
export function broadcastEvent(
  eventType: GameEventType,
  data: Record<string, unknown>,
  targetType: ClientType = "all"
): void {
  sseManager.broadcast(eventType, data, targetType);
}

export function sendToAdmin(
  eventType: GameEventType,
  data: Record<string, unknown>
): void {
  sseManager.broadcast(eventType, data, "admin");
}

export function sendToVoters(
  eventType: GameEventType,
  data: Record<string, unknown>
): void {
  sseManager.broadcast(eventType, data, "voter");
}
