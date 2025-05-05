'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SuccessfullLoginPage() {
  const [username, setUsername] = useState('');
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    function getCookie(name: string) {
      const cookies = document.cookie.split('; ');
      //console.log('current cookies are:', cookies);
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
    <div>
      <p>Hello from success!</p>
      <p>Username: {username}</p>
      <Image src={photo} alt="User Photo" />
    </div>
  );
}
