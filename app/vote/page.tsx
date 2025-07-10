"use client";

import { useVoteState } from "@/hooks/use-vote-state";
import {
  VoteHeader,
  GameStateCard,
  QuestionCard,
  VotingActiveCard,
  VotingResultsCard,
  GameEndCard,
  NoActiveGameCard,
  VoteFooter,
  VoteLoadingCard,
} from "@/components/vote";

export default function VotePage() {
  const {
    viewerState,
    isLoading,
    isGameStateCollapsed,
    setIsGameStateCollapsed,
    isConnected,
    handleVote,
  } = useVoteState();

  if (isLoading) {
    return <VoteLoadingCard />;
  }

  // Sprawdź czy powinien być wyświetlony ekran braku aktywnej gry
  const shouldShowNoActiveGame =
    (!viewerState.gameState &&
      !viewerState.voteSession &&
      !viewerState.showResults &&
      !viewerState.gameEnded) ||
    (!viewerState.gameState?.currentQuestion &&
      !viewerState.voteSession?.question &&
      !viewerState.stats &&
      !viewerState.canVote &&
      !viewerState.showResults &&
      !viewerState.gameEnded);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <div className="max-w-md mx-auto">
        {/* Nagłówek */}
        <VoteHeader />

        {/* Stan gry */}
        {viewerState.gameState && (
          <GameStateCard
            gameState={viewerState.gameState}
            isCollapsed={isGameStateCollapsed}
            onToggleCollapse={() =>
              setIsGameStateCollapsed(!isGameStateCollapsed)
            }
          />
        )}

        {/* Aktualne pytanie */}
        {(viewerState.gameState?.currentQuestion ||
          viewerState.voteSession?.question) && (
          <QuestionCard
            gameState={viewerState.gameState}
            voteSession={viewerState.voteSession}
            stats={viewerState.stats}
            userVote={viewerState.userVote}
            canVote={viewerState.canVote}
            showResults={viewerState.showResults}
            selectedAnswer={viewerState.selectedAnswer}
            correctAnswer={viewerState.correctAnswer}
            isAnswerRevealed={viewerState.isAnswerRevealed}
            onVote={handleVote}
          />
        )}

        {/* Głosowanie aktywne */}
        {viewerState.voteSession &&
          viewerState.voteSession.isActive &&
          viewerState.timeRemaining > 0 && (
            <VotingActiveCard
              voteSession={viewerState.voteSession}
              timeRemaining={viewerState.timeRemaining}
              userVote={viewerState.userVote}
            />
          )}

        {/* Wyniki głosowania */}
        {viewerState.showResults && viewerState.stats && (
          <VotingResultsCard
            stats={viewerState.stats}
            userVote={viewerState.userVote}
          />
        )}

        {/* Ekran zakończenia gry */}
        {viewerState.gameEnded && (
          <GameEndCard
            gameWon={viewerState.gameWon}
            finalAmount={viewerState.finalAmount}
          />
        )}

        {/* Brak aktywnej gry */}
        {shouldShowNoActiveGame && <NoActiveGameCard />}
      </div>

      {/* Fixed Footer Bar */}
      {!viewerState.gameEnded && (
        <VoteFooter
          gameState={viewerState.gameState}
          voteSession={viewerState.voteSession}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}
