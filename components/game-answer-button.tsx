import { Button } from "@/components/ui/button";

interface GameAnswerButtonProps {
  answerKey: string;
  answerValue: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onClick: () => void;
}

export function GameAnswerButton({
  answerKey,
  answerValue,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  onClick,
}: GameAnswerButtonProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let className =
    "justify-start text-left h-auto py-3 px-4 whitespace-normal break-words min-h-[3rem]";

  if (isCorrect) {
    variant = "default";
    className +=
      " bg-green-100 border-green-500 text-green-800 hover:bg-green-100";
  } else if (isWrong) {
    variant = "destructive";
    className += " bg-red-100 border-red-500 text-red-800";
  } else if (isSelected) {
    variant = "secondary";
    className += " bg-blue-100 border-blue-500 text-blue-800";
  }

  return (
    <Button
      variant={variant}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="font-bold mr-3 flex-shrink-0">{answerKey}:</span>
      <span className="flex-1 break-words leading-relaxed">{answerValue}</span>
      {isCorrect && <span className="ml-2 flex-shrink-0">✓</span>}
      {isWrong && <span className="ml-2 flex-shrink-0">✗</span>}
    </Button>
  );
}
