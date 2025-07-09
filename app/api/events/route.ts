import { NextRequest } from "next/server";
import { sseManager } from "@/lib/sse/manager";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientType = searchParams.get("type") as "admin" | "voter" | null;

  // Walidacja typu klienta
  if (!clientType || !["admin", "voter"].includes(clientType)) {
    return new Response("Invalid client type. Use ?type=admin or ?type=voter", {
      status: 400,
    });
  }

  // Unikalna ID dla klienta
  const clientId = `${clientType}_${Date.now()}_${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Headers dla SSE
  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
    "X-Accel-Buffering": "no", // Nginx compatibility
  });

  // Stwórz ReadableStream
  const stream = new ReadableStream({
    start(controller) {
      // Dodaj klienta do managera
      sseManager.addClient(clientId, clientType, controller);

      // Obsługa disconnection
      const cleanup = () => {
        sseManager.removeClient(clientId);
        try {
          controller.close();
        } catch {
          // Controller może być już zamknięty
        }
      };

      // Cleanup przy zamknięciu połączenia
      request.signal.addEventListener("abort", cleanup);
    },

    cancel() {
      sseManager.removeClient(clientId);
    },
  });

  return new Response(stream, { headers });
}

// Opcjonalnie - obsługa OPTIONS dla CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cache-Control",
    },
  });
}
