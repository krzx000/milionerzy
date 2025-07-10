import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export function NoActiveGameCard() {
  return (
    <div className="px-4 pb-6">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardContent className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
            <PlayCircle className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            🎮 Brak aktywnej gry
          </h2>
          <p className="text-gray-600 mb-2">
            Obecnie nie ma aktywnej gry ani głosowania
          </p>
          <p className="text-sm text-gray-500">
            Czekaj aż administrator rozpocznie nową grę...
          </p>
          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700">
              💡 Kiedy gra się rozpocznie, automatycznie zobaczysz aktualne
              pytanie
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
