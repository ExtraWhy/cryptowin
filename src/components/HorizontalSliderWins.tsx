'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useKeenSlider, KeenSliderPlugin } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { CircleDollarSign } from 'lucide-react';
import { getPlayers } from '@/lib/api/players';

// Final frontend type
interface PlayerWin {
  winAmount: string;
  playerName: string;
}

// Server Type
interface PlayerData {
  id: number;
  name: string;
  money: string;
}

const SLIDES_COUNT = 11;
const animation = { duration: 15000, easing: (t: number) => t };

const mockWins = [
  { winAmount: '123', playerName: 'Lyubo F1' },
  { winAmount: '123', playerName: 'Lyubo K2' },
  { winAmount: '123', playerName: 'Kuche' },
  { winAmount: '123', playerName: 'Lyubo F3' },
  { winAmount: '123', playerName: 'Lyubo F4' },
  { winAmount: '123', playerName: 'Lyubo Z0' },
  { winAmount: '123', playerName: 'Lyubo K3' },
  { winAmount: '123', playerName: 'Kuche 2' },
  { winAmount: '123', playerName: 'Lyubo F11' },
  { winAmount: '123', playerName: 'Lyubo F12' },
  { winAmount: '123', playerName: 'Lyubo Z1' },
  { winAmount: '123', playerName: 'Lyubo Z2' },
  { winAmount: '123', playerName: 'Lyubo Z3' },
  { winAmount: '123', playerName: 'Lyubo Z4' },
  { winAmount: '123', playerName: 'Lyubo Z5' },
];

const MutationPlugin: KeenSliderPlugin = (slider) => {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      slider.update();
    });
  });
  const config = { childList: true };

  slider.on('created', () => {
    observer.observe(slider.container, config);
  });
  slider.on('destroyed', () => {
    observer.disconnect();
  });
};

export default function PlayerWinsSlider({}) {
  const wins = useRef<PlayerWin[]>([]);
  const players_filled = useRef<Boolean>(false);
  const batch_id = useRef<number>(0);
  const [slideDetails, setSlidesDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    return;
    async function fetchData() {
      try {
        const data = await getPlayers();
        //const data = [{ id: 8, money: '25', name: 'Bonbonev' }];
        const date = new Date();
        batch_id.current += 1;
        console.log('batch id: ', batch_id.current, 'min:sec', date.getMinutes() + ':' + date.getSeconds(), 'server data', data);
        /*
        const data: PlayerData[] = (() => {
          // Generate a random integer from 0 to 5
          const count = Math.floor(Math.random() * 6);
          const players: PlayerData[] = [];
          for (let i = 0; i < count; i++) {
            players.push({
              id: i + 1000,
              name: `Player ${i + 1}` + new Date().getMinutes(),
            });
          }
          return players;
        })();
        */

        const mappedPlayers: PlayerWin[] = data.map((player: PlayerData) => ({
          playerName: player.name,
          winAmount: player.money.toString(),
        }));

        mappedPlayers.unshift({
          playerName: 'batch id ' + batch_id.current.toString() + ' ' + date.getMinutes() + ':' + date.getSeconds(),
          winAmount: 'NaN',
        });

        wins.current = [...wins.current, ...mappedPlayers];
      } catch (err) {
        console.log('Failed to load, err: ', err);
        if (!players_filled.current) {
          wins.current = mockWins;
        }
      } finally {
        players_filled.current = true;
        setLoading(false);
      }
    }

    fetchData();

    //wins.current = mockWins;

    setInterval(fetchData, 5000);
  }, []);

  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      renderMode: 'performance',
      drag: true,
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
      mode: 'free-snap',
      detailsChanged: (s) => {
        setSlidesDetails(s.track.details.slides);
      },
      created(s) {
        s.moveToIdx(5, true, animation);
      },
      updated(s) {
        s.moveToIdx(s.track.details.abs + 5, true, animation);
      },
      animationEnded(s) {
        s.moveToIdx(s.track.details.abs + 5, true, animation);
      },
    },
    [MutationPlugin],
  );
  if (loading) return <div>Loading players...</div>;

  return (
    <header className="flex top-0 bg-background shrink-0 items-center gap-2 border-b py-1">
      <div ref={sliderRef} className="keen-slider">
        {Array.from({ length: SLIDES_COUNT }, (_, idx: number) => {
          let abs_index: number = slideDetails ? Math.abs(slideDetails[idx]?.abs) : 1;
          abs_index %= wins.current.length;
          let name: string = wins.current[abs_index].playerName + ' ' + (slideDetails ? slideDetails[idx].abs : '');
          let amount: string = Number(wins.current[abs_index].winAmount).toLocaleString();
          return (
            <div key={idx} className="min-w-[200px] h-full py-1 keen-slider__slide bg-white/5 rounded shadow">
              <p className="text-xs ml-2">{name}</p>
              <p className="text-xs text-gray-600 font-semibold block ml-2 w-100 border-0">
                Won: <span className="text-white/80">{amount}</span>
                <CircleDollarSign className="w-5 h-5 text-yellow-200 inline mb-1 ml-1" />
              </p>
            </div>
          );
        })}
      </div>
    </header>
  );
}
