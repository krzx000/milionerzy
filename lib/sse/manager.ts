// Server-Sent Events Manager

import {
  SSEClient,
  GameEvent,
  GameEventType,
  ClientType,
} from "@/types/events";

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

    console.log(`SSE: Nowy klient połączony: ${id} (type: ${type})`);
    console.log(`SSE: Łącznie klientów: ${this.clients.size}`);

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
      console.log(`SSE: Klient rozłączony: ${id}`);
      console.log(`SSE: Pozostało klientów: ${this.clients.size}`);
    }
  }

  // Wyślij event do konkretnego klienta
  private sendToClient(clientId: string, event: GameEvent): boolean {
    const client = this.clients.get(clientId);
    if (!client) return false;

    try {
      const eventData = `event: ${event.type}\ndata: ${JSON.stringify({
        ...event.data,
        timestamp: event.timestamp,
      })}\n\n`;

      client.controller.enqueue(eventData);
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

    console.log(
      `SSE: Broadcasting ${eventType} to ${targetType} (${this.getClientCount(
        targetType
      )} clients)`
    );

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

    console.log(
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
