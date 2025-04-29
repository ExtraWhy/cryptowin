import GameCard from '@/components/GameCard';

export default function Games() {
  interface Game {
    id: number;
    title: string;
    image: string;
    video: string;
    rtp: string;
  }

  interface Games {
    mockGames: Game[];
  }

  const mockGames: Games = {
    mockGames: [
      {
        id: 1,
        title: 'Lucky Spin',
        image: '/images/game1.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 2,
        title: 'Crypto Dash',
        image: '/images/game2.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 3,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 4,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 5,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 6,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 7,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 8,
        title: 'Golden Dice',
        image: '/images/game2.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 9,
        title: 'Golden Dice',
        image: '/images/game1.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 10,
        title: 'Golden Dice',
        image: '/images/game2.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 11,
        title: 'Golden Dice',
        image: '/images/game3.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
      {
        id: 12,
        title: 'Golden Dice',
        image: '/images/game2.webp',
        video: '/videos/hero.mp4',
        rtp: '96.5%',
      },
    ],
  };

  return (
    <div>
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {mockGames.mockGames.map((game: Game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>
    </div>
  );
}
