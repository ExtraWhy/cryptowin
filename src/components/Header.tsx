'use client';
import { useEffect, useState } from 'react';
import { Coins } from 'lucide-react';
import AuthTrigger from '@/components/AuthTrigger';

export default function Header() {
  const [username, setUsername] = useState('none');
  const [photo, setPhoto] = useState('none');

  useEffect(() => {
    function getCookie(name: string) {
      const cookies = document.cookie.split('; ');
      for (const cookie of cookies) {
        const [key, val] = cookie.split('=');
        if (key === name) return decodeURIComponent(val.replace(/\+/g, ' '));
      }
      return '';
    }

    setUsername(getCookie('username'));
    setPhoto(getCookie('photo'));
  }, []);

  return (
    <div className="flex sticky z-50 top-0 items-center h-16 md:h-20 bg-card border-b-1">
      <div className="mx-3 flex items-center gap-2  text-yellow-500/90 font-black text-[26px]">
        <div className="w-8 h-8 rounded-full border-3 border-yellow-500/90 flex items-center justify-center">
          <Coins />
        </div>
        <span className="font-logo mb-0.5 animate-spin-slow">CRYPTOWIN</span>
      </div>
      {username === 'none' ? null : username ? (
        <div className="flex items-center gap-2 ml-auto mr-4">
          <img src={photo} className="w-8 h-8 rounded-full" alt="User" />
          <span className="text-sm font-medium">{username}</span>
        </div>
      ) : (
        <>
          <AuthTrigger text="Login" variant="outline" className="ml-auto mr-2" />
          <AuthTrigger text="Sign Up" className="mr-2 md:mr-[2vw]" />
        </>
      )}
    </div>
  );
}
