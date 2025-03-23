'use client';
import React, { useEffect, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { CircleDollarSign } from 'lucide-react';
import { getPlayers } from '@/lib/api/players';

interface PlayerWin {
  id: number;
  winAmount: string;
  playerName: string;
}

interface PlayerData {
  id: number;
  name: string;
}

const animation = { duration: 15000, easing: (t: number) => t };

const mockWins = [
  { id: 1, winAmount: '1234', playerName: 'Lyubo F' },
  { id: 2, winAmount: '12312', playerName: 'Lyubo K' },
  { id: 3, winAmount: '918', playerName: 'Kuche' },
  { id: 4, winAmount: '7894', playerName: 'Lyubo F' },
  { id: 5, winAmount: '5324', playerName: 'Lyubo F' },
];

export default function PlayerWinsSlider({}) {
  const [wins, setPlayers] = useState<PlayerWin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('init');

    async function fetchData() {
      try {
        const data = await getPlayers();
        const mappedPlayers: PlayerWin[] = data.map((player: PlayerData) => ({
          id: player.id,
          playerName: player.name,
          winAmount: Math.floor(Math.random() * 10000),
        }));
        setPlayers(mappedPlayers);
      } catch (err) {
        console.log('Failed to load, err: ', err);
        setPlayers(mockWins);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: 'performance',
    drag: false,
    slides: {
      perView: 3,
      spacing: 5,
    },
    breakpoints: {
      '(min-width): 768px)': {
        slides: {
          perView: 5,
          spacing: 15,
        },
      },
    },
    created: (s) => {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });

  if (loading) return <div>Loading players...</div>;

  return (
    <header className="flex top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-2">
      <div ref={sliderRef} className="keen-slider">
        {wins.map((win) => (
          <div key={win.id} className="h-full border-red-50 px-3 p-1 keen-slider__slide bg-white/5 rounded shadow">
            <p className="text-xs">{win.playerName}</p>
            <p className="text-gray-600 font-semibold">
              Won: <span className="text-white/80">{win.winAmount}</span>
              <CircleDollarSign className="w-5 h-5 text-yellow-200 inline mb-1 ml-1" />
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}
