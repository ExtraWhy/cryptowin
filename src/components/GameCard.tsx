interface GameCardProps {
  game: {
    id: number;
    title: string;
    image: string;
    rtp: string;
  };
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <div
      className="bg-gray-800 flex flex-col rounded-lg bg-cover bg-center overflow-hidden shadow-lg hover:shadow-yellow-400 transition"
      style={{ backgroundImage: `url(${game.image})` }}
    >
      <div className="p-4 block bg-gray-800/40 mt-auto">
        <h3 className="text-l font-semibold text-white">{game.title}</h3>
        <p className="text-sm text-gray-300">RTP: {game.rtp}</p>
      </div>
    </div>
  );
}
