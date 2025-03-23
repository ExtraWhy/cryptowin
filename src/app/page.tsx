import Footer from '@/components/Footer';
import GameCard from '@/components/GameCard';
import Header from '@/components/Header';
import Video from '@/components/Video';
import PlayerWinsSlider from '@/components/HorizontalSliderWins';

const mockGames = [
  { id: 1, title: 'Lucky Spin', image: '/images/game1.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 2, title: 'Crypto Dash', image: '/images/game2.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 3, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 4, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 5, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 6, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 7, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 8, title: 'Golden Dice', image: '/images/game2.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 9, title: 'Golden Dice', image: '/images/game1.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 10, title: 'Golden Dice', image: '/images/game2.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 11, title: 'Golden Dice', image: '/images/game3.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
  { id: 12, title: 'Golden Dice', image: '/images/game2.webp', video: '/videos/hero.mp4', rtp: '96.5%' },
];

const mockWins = [
  { id: 1, winAmount: '1234', playerName: 'Lyubo F' },
  { id: 2, winAmount: '12312', playerName: 'Lyubo K' },
  { id: 3, winAmount: '918', playerName: 'Kuche' },
  { id: 4, winAmount: '7894', playerName: 'Lyubo F' },
  { id: 5, winAmount: '5324', playerName: 'Lyubo F' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <PlayerWinsSlider />
      <Video />
      <div>
        <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {mockGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </main>
      </div>

      <Footer />
    </div>
  );
}
