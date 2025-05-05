// --- api/mapper.ts ---
import {
  BetServerResponse,
  BetResult,
  BetRequest,
  PlayerWin,
  PlayerData,
  CleoEntry,
} from './types';

export function mapDtoToBetResult(dto: BetServerResponse): BetResult {
  const lines = dto.cleo
    .filter(
      (entry): entry is Required<Pick<CleoEntry, 'Line'>> & CleoEntry =>
        typeof entry.Line === 'number',
    )
    .map((entry: any) => ({
      line: entry.Line - 1,
      winning_symbol_count: entry.Num,
    }));

  return {
    id: 'id_hardcoded',
    betAmount: 123456,
    winAmount: 123456,
    lines: lines,
    symbols: dto.Scr,
  };
}

export function mapDtoToBetRequest(id: number, money: number): BetRequest {
  return { id: id, money: money };
}

export function mapDtoToPlayerWin(data: PlayerData): PlayerWin {
  return { winAmount: data.money, playerName: data.name };
}
