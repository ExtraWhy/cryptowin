import { Coins } from 'lucide-react';
import AuthTrigger from '@/components/AuthTrigger';
export default function Header() {
  return (
    <div className="flex sticky z-50 top-0 items-center h-16 md:h-20 bg-card border-b-1">
      <div className="mx-3 flex items-center gap-2  text-yellow-500/90 font-black text-[26px]">
        <div className="w-8 h-8 rounded-full border-3 border-yellow-500/90 flex items-center justify-center">
          <Coins />
        </div>
        <span className="font-logo mb-0.5 animate-spin-slow">CRYPTOWIN</span>
      </div>
      <AuthTrigger text="Login" variant="outline" className="ml-auto mr-2" />
      <AuthTrigger text="Sign Up" className="mr-2" />
    </div>
  );
}
