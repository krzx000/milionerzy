-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_game_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "currentQuestionIndex" INTEGER NOT NULL DEFAULT 0,
    "startTime" DATETIME,
    "endTime" DATETIME,
    "gameTime" INTEGER NOT NULL DEFAULT 0,
    "usedFiftyFifty" BOOLEAN NOT NULL DEFAULT false,
    "usedPhoneAFriend" BOOLEAN NOT NULL DEFAULT false,
    "usedAskAudience" BOOLEAN NOT NULL DEFAULT false,
    "hiddenAnswers" TEXT NOT NULL DEFAULT '{}',
    "audienceVoteQuestions" TEXT NOT NULL DEFAULT '[]',
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_game_sessions" ("createdAt", "currentQuestionIndex", "endTime", "gameTime", "hiddenAnswers", "id", "startTime", "status", "totalQuestions", "updatedAt", "usedAskAudience", "usedFiftyFifty", "usedPhoneAFriend") SELECT "createdAt", "currentQuestionIndex", "endTime", "gameTime", "hiddenAnswers", "id", "startTime", "status", "totalQuestions", "updatedAt", "usedAskAudience", "usedFiftyFifty", "usedPhoneAFriend" FROM "game_sessions";
DROP TABLE "game_sessions";
ALTER TABLE "new_game_sessions" RENAME TO "game_sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
