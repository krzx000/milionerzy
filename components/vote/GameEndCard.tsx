import { Card, CardContent } from "@/components/ui/card";

interface GameEndCardProps {
  gameWon: boolean;
  finalAmount: number;
}

export function GameEndCard({ gameWon, finalAmount }: GameEndCardProps) {
  return (
    <div className="px-4 pb-6">
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardContent className="text-center py-8">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              gameWon
                ? "bg-green-500/30 backdrop-blur-sm"
                : "bg-red-500/30 backdrop-blur-sm"
            }`}
          >
            <span className="text-4xl">{gameWon ? "🎉" : "💔"}</span>
          </div>

          <h2
            className={`text-2xl font-bold mb-4 ${
              gameWon ? "text-green-200" : "text-red-200"
            }`}
          >
            {gameWon ? "🏆 WYGRAŁ!" : "😢 PRZEGRAŁ"}
          </h2>

          <div
            className={`rounded-2xl p-4 mb-6 ${
              gameWon
                ? "bg-green-500/20 backdrop-blur-sm border border-green-300/50"
                : "bg-red-500/20 backdrop-blur-sm border border-red-300/50"
            }`}
          >
            <p className="text-lg font-semibold text-white mb-2">
              Końcowa kwota:
            </p>
            <p
              className={`text-3xl font-bold ${
                gameWon ? "text-green-200" : "text-red-200"
              }`}
            >
              {finalAmount.toLocaleString("pl-PL")} zł
            </p>
          </div>

          <div className="space-y-3">
            {gameWon ? (
              <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-300/50">
                <p className="text-lg font-semibold text-white mb-2">
                  🎊 Gratulacje!
                </p>
                <p className="text-sm text-white/80">
                  Uczestnik odpowiedział na wszystkie pytania poprawnie i zdobył
                  główną nagrodę!
                </p>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <p className="text-lg font-semibold text-white mb-2">
                  😔 Niestety...
                </p>
                <p className="text-sm text-white/80">
                  Uczestnik udzielił błędnej odpowiedzi. Gra zakończona.
                </p>
              </div>
            )}

            <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-300/50">
              <p className="text-sm font-medium text-white">
                💫 Dziękujemy za udział w głosowaniu publiczności!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
