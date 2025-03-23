'use client';
import React, { useRef, useEffect } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { CircleDollarSign } from 'lucide-react';

interface PlayerWin {
  id: number;
  winAmount: string;
  playerName: string;
}

interface PlayerWinsSliderProps {
  wins: PlayerWin[];
}

const animation = { duration: 15000, easing: (t: any) => t };

export default function PlayerWinsSlider({ wins }: PlayerWinsSliderProps) {
  const timer = useRef<number | null>(null);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
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

  const startAuto = () => {
    timer.current = window.setInterval(() => {
      slider.current?.next();
    }, 2500);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

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
