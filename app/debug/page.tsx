"use client";

import * as React from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useServerSentEvents } from "@/hooks/use-sse";
import type { GameEventType } from "@/types/events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Force dark theme locally for this page without persisting

type KV = Record<string, unknown>;

function Row({
  label,
  pl,
  value,
}: {
  label: string;
  pl: string;
  value: unknown;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 items-start py-2 border-b last:border-b-0">
      <div className="col-span-1">
        <div className="text-sm font-mono text-foreground/90">{label}</div>
        <div className="text-xs text-muted-foreground">{pl}</div>
      </div>
      <div className="col-span-2 text-sm break-words">
        <pre className="whitespace-pre-wrap text-xs bg-muted/40 p-2 rounded border overflow-auto max-h-40">
          {JSON.stringify(value, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default function DebugPage() {
  React.useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains("dark");
    root.classList.add("dark");
    return () => {
      if (!hadDark) root.classList.remove("dark");
    };
  }, []);

  const [events, setEvents] = React.useState<
    Array<{ type: GameEventType; data: KV; ts: number }>
  >([]);
  const [playerState, setPlayerState] = React.useState<KV>({});
  const [adminState, setAdminState] = React.useState<KV>({});
  const [voteState, setVoteState] = React.useState<KV>({});
  const [questionJump, setQuestionJump] = React.useState<number>(1);
  const [votesToSimulate, setVotesToSimulate] = React.useState<number>(25);
  const [effect, setEffect] = React.useState<string>("play-start");

  const appendEvent = React.useCallback((type: GameEventType, data: KV) => {
    setEvents((prev) =>
      [{ type, data, ts: Date.now() }, ...prev].slice(0, 100)
    );
  }, []);

  const { isConnected } = useServerSentEvents({
    clientType: "admin",
    onEvent: (type, data) => {
      appendEvent(type, data);
      if (
        type === "game-started" ||
        type === "game-reset" ||
        type === "question-changed" ||
        type === "answer-revealed" ||
        type === "answer-selected" ||
        type === "lifeline-used"
      ) {
        setPlayerState((prev) => ({ ...prev, last: { type, data } }));
      }
      if (
        type === "voting-started" ||
        type === "voting-ended" ||
        type === "vote-stats-updated" ||
        type === "vote-cast"
      ) {
        setVoteState((prev) => ({ ...prev, last: { type, data } }));
      }
      if (type === "game-ended") {
        setAdminState((prev) => ({ ...prev, last: { type, data } }));
      }
    },
  });

  async function post(url: string, body?: unknown) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res.json();
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto p-4 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Debug Dashboard</h1>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                SSE: {isConnected ? "connected" : "disconnected"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time indicators (Wskaźniki)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Row
                  label="Game events"
                  pl="Zdarzenia gry"
                  value={events.slice(0, 10)}
                />
                <Row
                  label="Player state"
                  pl="Stan gracza"
                  value={playerState}
                />
                <Row
                  label="Admin state"
                  pl="Stan administratora"
                  value={adminState}
                />
                <Row
                  label="Voting state"
                  pl="Stan głosowania"
                  value={voteState}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Controls (Sterowanie)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Force full win (Wymuś pełną wygraną)
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => post("/api/debug/force-win")}
                  >
                    Force win
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Jump to question (Przejdź do pytania)
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={questionJump}
                      onChange={(e) => setQuestionJump(Number(e.target.value))}
                    />
                    <Button
                      onClick={() =>
                        post("/api/debug/jump-question", {
                          index: Math.max(
                            0,
                            Math.min(11, (questionJump || 1) - 1)
                          ),
                        })
                      }
                    >
                      Jump
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Lifelines (Koła ratunkowe)
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        post("/api/debug/lifelines", { mode: "reset" })
                      }
                    >
                      Reset lifelines
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        post("/api/debug/lifelines", { mode: "allow-infinite" })
                      }
                    >
                      Enable infinite
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      onClick={() =>
                        post("/api/game/use-lifeline", {
                          lifeline: "fiftyFifty",
                        })
                      }
                    >
                      Use 50:50
                    </Button>
                    <Button
                      onClick={() =>
                        post("/api/game/use-lifeline", {
                          lifeline: "askAudience",
                        })
                      }
                    >
                      Use Ask Audience
                    </Button>
                    <Button
                      onClick={() =>
                        post("/api/game/use-lifeline", {
                          lifeline: "phoneAFriend",
                        })
                      }
                    >
                      Use Phone a Friend
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Simulate audience votes (Symuluj głosy publiczności)
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={1000}
                      value={votesToSimulate}
                      onChange={(e) =>
                        setVotesToSimulate(Number(e.target.value))
                      }
                    />
                    <Button
                      onClick={() =>
                        post("/api/debug/simulate-votes", {
                          count: votesToSimulate,
                        })
                      }
                    >
                      Simulate
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Effects & transitions (Efekty i przejścia)
                  </div>
                  <div className="flex gap-2 items-center">
                    <Select value={effect} onValueChange={setEffect}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Effect" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="play-start">Play Start</SelectItem>
                        <SelectItem value="play-answer">Play Answer</SelectItem>
                        <SelectItem value="play-win">Play Win</SelectItem>
                        <SelectItem value="play-lose">Play Lose</SelectItem>
                        <SelectItem value="transition">
                          Force Transition
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => post("/api/debug/effects", { effect })}
                    >
                      Trigger
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Raw SSE log (Surowy log)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[70vh] overflow-auto">
                  {events.map((e, i) => (
                    <div
                      key={i}
                      className="text-xs p-2 bg-muted/30 rounded border"
                    >
                      <div className="font-mono text-foreground/80">
                        {e.type}
                      </div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(e.data, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
