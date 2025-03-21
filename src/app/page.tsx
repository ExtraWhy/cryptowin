import GameCard from '@/components/GameCard';
import Sidebar from '@/components/Sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

const mockGames = [
  { id: 1, title: 'Lucky Spin', image: '/images/game1.webp', rtp: '96.5%' },
  { id: 2, title: 'Crypto Dash', image: '/images/game2.webp', rtp: '96.5%' },
  { id: 3, title: 'Golden Dice', image: '/images/game3.webp', rtp: '96.5%' },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 p-10">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
        </SidebarInset>
      </SidebarProvider>
      <main className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </main>
    </div>
  );
}
