export type LifelineType = "fiftyFifty" | "askAudience" | "phoneAFriend";

export interface Lifeline {
  type: LifelineType;
  used: boolean;
  usedAtLevel?: number; // numer rundy, na której koło zostało użyte
}

// Typ pomocniczy do zarządzania stanem wszystkich kół:
export type LifelinesState = Record<LifelineType, Lifeline>;
