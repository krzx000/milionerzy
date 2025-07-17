"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { GameEventType, ClientType } from "@/types/events";

interface UseSSEOptions {
  clientType: ClientType;
  onEvent?: (eventType: GameEventType, data: Record<string, unknown>) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  autoReconnect?: boolean;
  reconnectDelay?: number;
}

interface SSEHookReturn {
  isConnected: boolean;
  lastEvent: { type: GameEventType; data: Record<string, unknown> } | null;
  reconnect: () => void;
  disconnect: () => void;
}

export function useServerSentEvents({
  clientType,
  onEvent,
  onConnect,
  onDisconnect,
  onError,
  autoReconnect = true,
  reconnectDelay = 3000,
}: UseSSEOptions): SSEHookReturn {
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  const lastEventRef = useRef<{
    type: GameEventType;
    data: Record<string, unknown>;
  } | null>(null);

  // Użyj ref dla callback'ów, żeby nie powodowały rerenderów
  const onEventRef = useRef(onEvent);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Aktualizuj ref'y gdy się zmienią
  onEventRef.current = onEvent;
  onConnectRef.current = onConnect;
  onDisconnectRef.current = onDisconnect;
  onErrorRef.current = onError;

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (isConnected) {
      setIsConnected(false);
      onDisconnectRef.current?.();
    }
  }, [isConnected]); // Tylko isConnected jako zależność

  const connectSSERef = useRef<(() => void) | null>(null);

  const reconnect = useCallback(() => {
    shouldReconnectRef.current = true;
    // Odłącz i ponownie połącz
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);

    // Ponowne połączenie po krótkiej chwili
    setTimeout(() => {
      if (shouldReconnectRef.current && connectSSERef.current) {
        connectSSERef.current();
      }
    }, 100);
  }, []);

  // Setup i cleanup - tylko raz na mount
  useEffect(() => {
    shouldReconnectRef.current = true;

    // Inline connect function
    const connectSSE = () => {
      // Zamknij poprzednie połączenie jeśli istnieje
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      console.log(`SSE: Łączenie jako ${clientType}...`);

      try {
        const eventSource = new EventSource(`/api/events?type=${clientType}`);
        eventSourceRef.current = eventSource;

        // Event listeners
        eventSource.onopen = () => {
          console.log(`SSE: Połączono jako ${clientType}`);
          setIsConnected(true);
          onConnectRef.current?.();
        };

        eventSource.onerror = (error) => {
          console.error(`SSE: Błąd połączenia (${clientType}):`, {
            error,
            readyState: eventSource.readyState,
            url: eventSource.url,
            type: error.type,
            target: error.target,
          });
          setIsConnected(false);
          onErrorRef.current?.(error);

          // Auto-reconnect
          if (shouldReconnectRef.current && autoReconnect) {
            console.log(`SSE: Ponowne łączenie za ${reconnectDelay}ms...`);
            reconnectTimeoutRef.current = setTimeout(() => {
              if (shouldReconnectRef.current) {
                connectSSE();
              }
            }, reconnectDelay);
          }
        };

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`SSE: Otrzymano event:`, event.type || "message", data);

            lastEventRef.current = {
              type: (event.type || "admin-message") as GameEventType,
              data,
            };

            onEventRef.current?.(
              lastEventRef.current.type,
              lastEventRef.current.data
            );
          } catch (error) {
            console.error("SSE: Błąd parsowania danych:", error);
          }
        };

        // Dodatkowe event listenery dla konkretnych typów eventów
        const eventTypes: GameEventType[] = [
          "voting-started",
          "voting-ended",
          "question-changed",
          "game-ended",
          "lifeline-used",
          "vote-stats-updated",
          "answer-selected",
          "answer-revealed",
          "admin-message",
          "connection-established",
        ];

        eventTypes.forEach((eventType) => {
          eventSource.addEventListener(eventType, (event) => {
            try {
              const data = JSON.parse((event as MessageEvent).data);
              console.log(`SSE: Otrzymano ${eventType}:`, data);

              lastEventRef.current = { type: eventType, data };
              onEventRef.current?.(eventType, data);
            } catch (error) {
              console.error(`SSE: Błąd parsowania ${eventType}:`, error);
            }
          });
        });
      } catch (error) {
        console.error(
          `SSE: Błąd inicjalizacji EventSource (${clientType}):`,
          error
        );
        setIsConnected(false);
        onErrorRef.current?.(error as Event);

        // Auto-reconnect przy błędzie inicjalizacji
        if (shouldReconnectRef.current && autoReconnect) {
          console.log(`SSE: Ponowne łączenie za ${reconnectDelay}ms...`);
          reconnectTimeoutRef.current = setTimeout(() => {
            if (shouldReconnectRef.current) {
              connectSSE();
            }
          }, reconnectDelay);
        }
      }
    };

    connectSSERef.current = connectSSE;
    connectSSE();

    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
    };
  }, [clientType, autoReconnect, reconnectDelay]); // Tylko stałe wartości

  return {
    isConnected,
    lastEvent: lastEventRef.current,
    reconnect,
    disconnect,
  };
}

// Convenience hooks dla różnych typów klientów
export function useAdminSSE(
  onEvent?: (eventType: GameEventType, data: Record<string, unknown>) => void
): SSEHookReturn {
  return useServerSentEvents({
    clientType: "admin",
    onEvent,
  });
}

export function useVoterSSE(
  onEvent?: (eventType: GameEventType, data: Record<string, unknown>) => void
): SSEHookReturn {
  return useServerSentEvents({
    clientType: "voter",
    onEvent,
  });
}
