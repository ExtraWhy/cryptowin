import { api } from './axios';
import { mapDtoToPlayerWin } from './mapper';
import { PlayerData, PlayerWin } from './types';

export async function getPlayers() {
  const res = await api.get('/players/winners');

  const mappedPlayers: PlayerWin[] = res.data.map((player: PlayerData) =>
    mapDtoToPlayerWin(player),
  );
  return mappedPlayers;
}
