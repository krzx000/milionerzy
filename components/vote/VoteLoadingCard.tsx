import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export function VoteLoadingCard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-80 mx-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <PlayCircle className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-gray-700">
              Ładowanie gry...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
