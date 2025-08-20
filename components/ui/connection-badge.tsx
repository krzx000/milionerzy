import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionBadgeProps {
  isConnected: boolean;
  className?: string;
}

export function ConnectionBadge({
  isConnected,
  className = "",
}: ConnectionBadgeProps) {
  if (isConnected) {
    return (
      <Badge
        variant="default"
        className={`bg-green-500 text-white ${className}`}
      >
        <Wifi className="w-4 h-4 mr-1" />
        Połączono
      </Badge>
    );
  }

  return (
    <Badge
      variant="destructive"
      className={`bg-red-500 text-white ${className}`}
    >
      <WifiOff className="w-4 h-4 mr-1" />
      Rozłączono
    </Badge>
  );
}
