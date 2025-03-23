import { Button } from './ui/button';

export default function Video() {
  return (
    <section className="relative w-full h-[30svh] overflow-hidden">
      <video className="absolute inset-0 w-full h-full object-cover" src="/videos/hero.mp4" autoPlay loop muted playsInline />

      <div className="relative z-10 flex flex-col items-center  justify-start pt-10 h-[95%] w-[95%] mt-[1.5%] ml-[2.5%] text-white bg-black/60 backdrop-blur-[2px]">
        <h1 className="text-2xl md:text-6xl font-bold">Welcome to CryptoWin</h1>
        <p className="mt-3 text-sm md:text-2xl">Sign Up & Get</p>
        <p className="font-bold">
          UP TO <span className="text-primary font-black">$20,000.00</span> in Casino
        </p>
        <Button variant="default" className="font-bold mt-5 relative w-1/3 hover:bg-white">
          Join Now
        </Button>
      </div>
    </section>
  );
}
