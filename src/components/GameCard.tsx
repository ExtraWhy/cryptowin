'use client';
import { useRef } from 'react';

interface GameCardProps {
  game: {
    id: number;
    title: string;
    image: string;
    rtp: string;
    video: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err: Error) => {
        console.error('Error playing video:', err);
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      if (touch.clientX >= rect.left && touch.clientX <= rect.right && touch.clientY <= rect.top && touch.clientY <= rect.bottom) {
      } else if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  };

  const handleTouchCancel = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative min-h-50 bg-gray-800 flex flex-col rounded-lg bg-cover bg-center overflow-hidden shadow-lg hover:shadow-yellow-400/18 transition"
      style={{ backgroundImage: `url(${game.image})` }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition duration-300"
        autoPlay
        loop
        muted
        src={game.video}
      ></video>

      <div className="relative p-4 block bg-gray-800/40 mt-auto">
        <h3 className="text-l font-semibold text-white">{game.title}</h3>
        <p className="text-sm text-gray-300">RTP: {game.rtp}</p>
      </div>
    </div>
  );
}
