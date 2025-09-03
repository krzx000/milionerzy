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
import { Badge } from "@/components/ui/badge";
// Force dark theme locally for this page without persisting

type KV = Record<string, unknown>;
type DebugData =
  | { last?: { type?: string; data?: KV }; type?: string; data?: KV }
  | KV
  | undefined;

function hasLast(x: unknown): x is { last: { type?: string; data?: KV } } {
  if (!x || typeof x !== "object") return false;
  const rec = x as Record<string, unknown>;
  return (
    "last" in rec && typeof rec["last"] === "object" && rec["last"] !== null
  );
}

function formatTime(ts?: number) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleTimeString("pl-PL", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return String(ts);
  }
}

type Pair = { label: string; value: string };
function toPairs(obj?: unknown, max = 8): Pair[] {
  if (!obj || typeof obj !== "object") return [];
  const entries = Object.entries(obj as Record<string, unknown>);
  const pairs: Pair[] = [];
  for (const [k, v] of entries) {
    if (v == null) continue;
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    ) {
      pairs.push({ label: k, value: String(v) });
    } else if (Array.isArray(v)) {
      const preview = v
        .slice(0, 4)
        .map((x) => (typeof x === "object" ? "{…}" : String(x)))
        .join(", ");
      const suffix = v.length > 4 ? `, … +${v.length - 4}` : "";
      pairs.push({ label: k, value: `[${preview}${suffix}]` });
    } else if (typeof v === "object") {
      const keys = Object.keys(v as object);
      const preview = keys.slice(0, 4).join(", ");
      const suffix = keys.length > 4 ? `, … +${keys.length - 4}` : "";
      pairs.push({ label: k, value: `{ ${preview}${suffix} }` });
    }
    if (pairs.length >= max) break;
  }
  return pairs;
}

function KeyValueList({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle?: string;
  data?: DebugData;
}) {
  const container = (data ?? {}) as
    | { last?: { type?: string; data?: KV }; type?: string; data?: KV }
    | KV;
  const last = hasLast(container) ? container.last : container;
  const type = last?.type as string | undefined;
  const payload = (last?.data ?? last) as KV | undefined;
  const pairs = toPairs(payload);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium">{title}</div>
        {type ? (
          <Badge variant="secondary" className="text-xs">
            {type}
          </Badge>
        ) : null}
      </div>
      {subtitle ? (
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      ) : null}
      {pairs.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
          {pairs.map((p) => (
            <React.Fragment key={p.label}>
              <div className="text-muted-foreground">{p.label}</div>
              <div className="truncate" title={p.value}>
                {p.value}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">Brak danych</div>
      )}
    </div>
  );
}

function EventItem({
  type,
  data,
  ts,
}: {
  type: GameEventType;
  data: KV;
  ts?: number;
}) {
  const pairs = toPairs(data);
  return (
    <div className="rounded-md border bg-card text-card-foreground p-2">
      <div className="flex items-center justify-between gap-2">
        <Badge className="text-xs" variant="outline">
          {type}
        </Badge>
        <div className="text-[10px] text-muted-foreground">
          {formatTime(ts)}
        </div>
      </div>
      {pairs.length ? (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
          {pairs.map((p) => (
            <React.Fragment key={p.label}>
              <div className="text-muted-foreground">{p.label}</div>
              <div className="truncate" title={p.value}>
                {p.value}
              </div>
            </React.Fragment>
          ))}
        </div>
      ) : null}
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Recent events (Ostatnie zdarzenia)
                  </div>
                  <div className="space-y-2">
                    {events.slice(0, 5).map((e, i) => (
                      <EventItem
                        key={i}
                        type={e.type}
                        data={e.data}
                        ts={e.ts}
                      />
                    ))}
                    {!events.length && (
                      <div className="text-xs text-muted-foreground">
                        Brak zdarzeń
                      </div>
                    )}
                  </div>
                </div>

                <KeyValueList
                  title="Player state"
                  subtitle="Stan gracza"
                  data={playerState}
                />
                <KeyValueList
                  title="Admin state"
                  subtitle="Stan administratora"
                  data={adminState}
                />
                <KeyValueList
                  title="Voting state"
                  subtitle="Stan głosowania"
                  data={voteState}
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
                <CardTitle>Event log (Dziennik zdarzeń)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
                  {events.map((e, i) => (
                    <EventItem
                      key={`${e.ts}-${i}`}
                      type={e.type}
                      data={e.data}
                      ts={e.ts}
                    />
                  ))}
                  {!events.length && (
                    <div className="text-xs text-muted-foreground">
                      Brak zdarzeń
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
