import { Button } from "@/components/ui/button";
import { GAME_CONSTANTS } from "@/lib/constants/game";

interface LifelinesGridProps {
  usedLifelines: {
    fiftyFifty: boolean;
    phoneAFriend: boolean;
    askAudience: boolean;
  };
  gameLoading: boolean;
  onUseLifeline: (
    lifelineType: "fiftyFifty" | "phoneAFriend" | "askAudience"
  ) => void;
}

export function LifelinesGrid({
  usedLifelines,
  gameLoading,
  onUseLifeline,
}: LifelinesGridProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Koła ratunkowe:</div>
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(GAME_CONSTANTS.LIFELINE_NAMES).map(([key, label]) => {
          const lifelineKey = key as keyof typeof usedLifelines;
          const isUsed = usedLifelines[lifelineKey];
          const icon = GAME_CONSTANTS.LIFELINE_ICONS[lifelineKey];

          return (
            <Button
              key={key}
              variant={isUsed ? "secondary" : "default"}
              size="sm"
              disabled={isUsed || gameLoading}
              onClick={() => onUseLifeline(lifelineKey)}
              className="text-xs whitespace-normal break-words h-auto py-2"
            >
              {isUsed ? (
                <span className="line-through">
                  {icon} {label}
                </span>
              ) : (
                `${icon} ${label}`
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
