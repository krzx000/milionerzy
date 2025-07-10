import { Card, CardContent } from "@/components/ui/card";

interface GameEndCardProps {
  gameWon: boolean;
  finalAmount: number;
}

export function GameEndCard({ gameWon, finalAmount }: GameEndCardProps) {
  return (
    <div className="px-4 pb-6">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardContent className="text-center py-8">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              gameWon ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <span className="text-4xl">{gameWon ? "🎉" : "💔"}</span>
          </div>

          <h2
            className={`text-2xl font-bold mb-4 ${
              gameWon ? "text-green-700" : "text-red-700"
            }`}
          >
            {gameWon ? "🏆 WYGRAŁ!" : "😢 PRZEGRAŁ"}
          </h2>

          <div
            className={`rounded-2xl p-4 mb-6 ${
              gameWon
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Końcowa kwota:
            </p>
            <p
              className={`text-3xl font-bold ${
                gameWon ? "text-green-700" : "text-red-700"
              }`}
            >
              {finalAmount.toLocaleString("pl-PL")} zł
            </p>
          </div>

          <div className="space-y-3">
            {gameWon ? (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  🎊 Gratulacje!
                </p>
                <p className="text-sm text-gray-600">
                  Uczestnik odpowiedział na wszystkie pytania poprawnie i zdobył
                  główną nagrodę!
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-lg font-semibold text-gray-800 mb-2">
                  😔 Niestety...
                </p>
                <p className="text-sm text-gray-600">
                  Uczestnik udzielił błędnej odpowiedzi. Gra zakończona.
                </p>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm font-medium text-gray-700">
                💫 Dziękujemy za udział w głosowaniu publiczności!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
