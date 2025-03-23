import { Coins } from 'lucide-react';
import { AuthDialog } from './AuthDialog';
import { LoginForm } from './login-form';

export default function Header() {
  return (
    <div className="flex sticky top-0 items-center h-16 md:h-20 bg-card border-b-1">
      <div className="mx-3 flex items-center gap-2  text-yellow-500/90 font-black text-[26px]">
        <div className="w-8 h-8 rounded-full border-3 border-yellow-500/90 flex items-center justify-center">
          <Coins />
        </div>
        <span className="font-logo mb-0.5 animate-spin-slow">CRYPTOWIN</span>
      </div>
      <AuthDialog />
    </div>
  );
}
