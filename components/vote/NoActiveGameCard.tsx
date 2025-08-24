import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export function NoActiveGameCard() {
  return (
    <div className="px-4 pb-6">
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardContent className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <PlayCircle className="w-8 h-8 text-white/70" />
          </div>
          <h2 className="text-xl font-semibold mb-4 text-white">
            🎮 Brak aktywnej gry
          </h2>
          <p className="text-white/80 mb-2">
            Obecnie nie ma aktywnej gry ani głosowania
          </p>
          <p className="text-sm text-white/60">
            Czekaj aż administrator rozpocznie nową grę...
          </p>
          <div className="mt-6 bg-blue-500/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-medium text-white">
              💡 Kiedy gra się rozpocznie, automatycznie zobaczysz aktualne
              pytanie
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
