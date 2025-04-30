// ─────────────────────────────────────────────────────
// 🎮 WebSocket Types
// ─────────────────────────────────────────────────────

import { ServerMessage } from '../ws';

// WS command “bet” response
//

export interface CleoEntry {
  Pay?: number;
  Mult?: number;
  Num: number[];
  Line?: number;
  XY: number[];
}

export interface BetServerResponse extends ServerMessage {
  win_amount: number;
  cleo: CleoEntry[];
  Scr: number[][];
}

// WS “place a bet” request
export interface BetRequest {
  bet: {
    id: number;
    money: number;
  };
}

// frontend app’s clean domain models (used by both WS & REST)

export interface BetResult {
  id: string;
  betAmount: number;
  winAmount: number;
  lines: number[];
  symbols: number[][];
}

// ─────────────────────────────────────────────────────
// 🌐 REST API Types
// ─────────────────────────────────────────────────────

// REST: raw player data from server
export interface PlayerData {
  id: number;
  name: string;
  money: string;
}

// REST: individual player’s win record ( used in FE )
export interface PlayerWin {
  winAmount: string;
  playerName: string;
}
