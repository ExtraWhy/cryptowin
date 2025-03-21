import { Button } from './ui/button';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
      <h2 className="text-2xl font-bold">Crypto Win</h2>
      <nav className="space-y-2">
        <a href="/wallet" className="block hover:text-yellow-400">
          <Button variant="secondary" className="w-full">
            Home
          </Button>
        </a>
        <a href="/wallet" className="block hover:text-yellow-400">
          Wallet
        </a>
        <a href="#" className="block hover:text-yellow-400">
          My Games
        </a>
      </nav>
    </aside>
  );
}
