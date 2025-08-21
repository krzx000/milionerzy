import { NextResponse } from "next/server";
import { sseManager } from "@/lib/sse/manager";

export async function GET() {
  try {
    // Diagnostyka SSE
    console.log("=== SSE DIAGNOSTYKA ===");
    sseManager.listClients();

    // Test broadcast
    sseManager.broadcast(
      "admin-message",
      {
        message: "Test broadcast z endpoint diagnostycznego",
        timestamp: new Date(),
      },
      "all"
    );

    return NextResponse.json({
      success: true,
      message: "SSE test completed - sprawdź logi serwera",
      clientCount: sseManager.getClientCount("all"),
      playerCount: sseManager.getClientCount("player"),
      adminCount: sseManager.getClientCount("admin"),
    });
  } catch (error) {
    console.error("SSE test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "SSE test failed",
      },
      { status: 500 }
    );
  }
}
