// --- api/mapper.ts ---
import {
  BetServerResponse,
  BetResult,
  BetRequest,
  PlayerWin,
  PlayerData,
  SlotEntry,
} from './types';

export function mapDtoToBetResult(dto: BetServerResponse): BetResult {
  const lines = dto.slot
    .filter(
      (entry): entry is Required<Pick<SlotEntry, 'Line'>> & SlotEntry =>
        typeof entry.Line === 'number',
    )
    .map((entry: Required<Pick<SlotEntry, 'Line' | 'Num'>> & SlotEntry) => ({
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
