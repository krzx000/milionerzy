import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";
import { IMAGES } from "@/lib/utils/game-assets";

export function VoteLoadingCard() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${IMAGES.BACKGROUND})` }}
    >
      <Card className="w-80 mx-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-blue-200 animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-white">Ładowanie gry...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
