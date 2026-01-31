import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function VoteHeader() {
  return (
    <div className="px-4 pt-6 pb-4">
      <Card className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-white text-center justify-center">
            <div className="w-6 h-6 bg-blue-100/30 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-blue-200" />
            </div>
            Zstlionerzy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-blue-500/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-sm font-medium text-white">
              Centrum Widzów - Głosuj na Żywo!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
