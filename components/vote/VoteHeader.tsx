import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function VoteHeader() {
  return (
    <div className="px-4 pt-6 pb-4">
      <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 text-center justify-center">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-blue-600" />
            </div>
            Milionerzy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center bg-blue-50 rounded-xl p-3">
            <p className="text-sm font-medium text-gray-700">
              Centrum Widzów - Głosuj na Żywo!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
