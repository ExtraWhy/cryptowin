import { Button } from './ui/button';

export default function Video() {
  return (
    <div className="border-5 relative w-full aspect-[13/3] sm:h-auto sm:min-h-[300px] h-[30vh] min-h-[250px] max-h-[400px] overflow-hidden py-[1.5%]">
      <video className="absolute inset-0 w-full h-full object-cover" src="/videos/hero.mp4" autoPlay loop muted playsInline />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-[95%] ml-[2.5%] text-white bg-black/60 backdrop-blur-[2px]">
        <h1 className="text-2xl md:text-6xl font-bold">Welcome to CryptoWin</h1>
        <p className="mt-3 text-sm md:text-2xl">Sign Up & Get</p>
        <p className="font-bold">
          UP TO <span className="text-primary font-black">$20,000.00</span> in Casino
        </p>
        <Button variant="default" className="font-bold mt-5 relative w-1/3 hover:bg-white mb-5">
          Join Now
        </Button>
      </div>
    </div>
  );
}
