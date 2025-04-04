import { api } from './axios';

export async function getPlayers() {
  const res = await api.get('/players/winners');
  return res.data;
}
