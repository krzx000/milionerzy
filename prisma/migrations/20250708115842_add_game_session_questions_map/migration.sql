/*
  Warnings:

  - You are about to drop the `GameSessionQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "GameSessionQuestion";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "game_session_questions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gameSessionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "game_session_questions_gameSessionId_fkey" FOREIGN KEY ("gameSessionId") REFERENCES "game_sessions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "game_session_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
