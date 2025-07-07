import { prisma } from "./prisma";

async function testGameSession() {
  try {
    // Test utworzenia sesji
    const session = await prisma.gameSession.create({
      data: {
        status: "active",
        currentQuestionIndex: 0,
        totalQuestions: 5,
      },
    });

    console.log("Created session:", session);

    // Test pobrania sesji
    const foundSession = await prisma.gameSession.findFirst();
    console.log("Found session:", foundSession);
  } catch (error) {
    console.error("Error:", error);
  }
}

testGameSession();
