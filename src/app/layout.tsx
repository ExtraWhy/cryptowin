import './globals.css';
import { Inter, Oswald } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={oswald.variable}>
      <body className={inter.className + ' bg-background text-foreground'}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
