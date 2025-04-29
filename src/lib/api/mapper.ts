// --- api/mapper.ts ---
import {
  BetServerResponse,
  BetResult,
  BetRequest,
  PlayerWin,
  PlayerData,
  CleoEntry,
} from './types';

export function mapDtoToBet(dto: BetServerResponse): BetResult {
  const lines = dto.cleo
    .filter(
      (entry): entry is Required<Pick<CleoEntry, 'Line'>> & CleoEntry =>
        typeof entry.Line === 'number',
    )
    .map((entry) => entry.Line);

  return {
    id: 'id_hardcoded',
    betAmount: 123456,
    winAmount: 123456,
    lines: lines,
  };
}

export function mapDtoToBetRequest(id: number, money: number): BetRequest {
  return { bet: { id: id, money: money } };
}

export function mapDtoToPlayerWin(data: PlayerData): PlayerWin {
  // console.log(`data.id ${data.id} is also provided in response`)
  return { winAmount: data.money, playerName: data.name };
}
