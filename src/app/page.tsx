import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Video from '@/components/Video';
import PlayerWinsSlider from '@/components/HorizontalSliderWins';
import Games from '@/components/Games';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <PlayerWinsSlider />
      <Video />
      <Games />
      <Footer />
    </div>
  );
}
