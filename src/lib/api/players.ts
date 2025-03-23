import { api } from './axios';

export async function getPlayers() {
  const res = await api.get('/players');
  return res.data;
}
