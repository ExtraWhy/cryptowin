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
  { id: 6, winAmount: '6324', playerName: 'Lyubo Z' },
  { id: 22, winAmount: '12312', playerName: 'Lyubo K' },
  { id: 32, winAmount: '918', playerName: 'Kuche' },
  { id: 42, winAmount: '7894', playerName: 'Lyubo F' },
  { id: 52, winAmount: '5324', playerName: 'Lyubo F' },
  { id: 62, winAmount: '6324', playerName: 'Lyubo Z' },
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
      spacing: 2,
    },
    breakpoints: {
      '(min-width: 600px)': {
        slides: {
          perView: 6,
          spacing: 2,
        },
      },
      '(min-width: 1000px)': {
        slides: {
          perView: 10,
          spacing: 2,
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
    <header className="flex top-0 bg-background shrink-0 items-center gap-2 border-b py-1">
      <div ref={sliderRef} className="keen-slider">
        {wins.map((win) => (
          <div key={win.id} className="min-w-[200px] h-full py-1 keen-slider__slide bg-white/5 rounded shadow">
            <p className="text-xs ml-2">{win.playerName}</p>
            <p className="text-xs text-gray-600 font-semibold block ml-2 w-100 border-0">
              Won: <span className="text-white/80">{Number(win.winAmount).toLocaleString()}</span>
              <CircleDollarSign className="w-5 h-5 text-yellow-200 inline mb-1 ml-1" />
            </p>
          </div>
        ))}
      </div>
    </header>
  );
}
