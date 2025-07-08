import { GAME_CONSTANTS } from "@/lib/constants/game";

interface GameStatusDisplayProps {
  isGameActive: boolean;
  isGameEnded: boolean;
  currentQuestionIndex?: number;
  questionsLength: number;
  currentPrize: string;
  winningPrize: string;
}

export function GameStatusDisplay({
  isGameActive,
  isGameEnded,
  currentQuestionIndex = 0,
  questionsLength,
  currentPrize,
  winningPrize,
}: GameStatusDisplayProps) {
  const getStatusText = () => {
    if (isGameActive) return "AKTYWNA";
    if (isGameEnded) return "ZAKOŃCZONA";
    return "NIEAKTYWNA";
  };

  const getStatusStyle = () => {
    if (isGameActive) return GAME_CONSTANTS.GAME_STATUS_STYLES.active;
    if (isGameEnded) return GAME_CONSTANTS.GAME_STATUS_STYLES.finished;
    return GAME_CONSTANTS.GAME_STATUS_STYLES.inactive;
  };

  return (
    <>
      {/* Status gry */}
      <div className="space-y-2">
        <div className="text-sm font-medium">Status gry:</div>
        <div className={`px-3 py-2 rounded-md text-center ${getStatusStyle()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Aktualne pytanie */}
      {(isGameActive || isGameEnded) && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Pytanie:</div>
          <div className="text-center bg-blue-100 text-blue-800 py-2 rounded-md">
            {currentQuestionIndex + 1} z {questionsLength}
          </div>
        </div>
      )}

      {/* Aktualna nagroda */}
      {(isGameActive || isGameEnded) && (
        <div className="space-y-2">
          <div className="text-sm font-medium">
            {isGameEnded ? "Gracz wygrywa:" : "Aktualna nagroda:"}
          </div>
          <div className="text-lg font-bold text-center bg-yellow-100 text-yellow-800 py-2 rounded-md">
            {isGameEnded ? winningPrize : currentPrize}
          </div>
        </div>
      )}
    </>
  );
}
