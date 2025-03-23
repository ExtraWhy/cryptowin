'use client';
import { Dice5, Medal, Menu, Wallet } from 'lucide-react';
import Link from 'next/link';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 bg-background/85 border-t md:hidden">
      <div className="flex justify-around items-center py-2">
        <SidebarProvider>
          <FooterSidebar />
        </SidebarProvider>
        <FooterLink href="/explore" icon={<Wallet size={23} />} label="Wallet" />
        <FooterLink href="/casino" icon={<Dice5 size={23} />} label="Casino" />
        <FooterLink href="/sports" icon={<Medal size={23} />} label="Sports" />
      </div>
    </footer>
  );
}

function FooterSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <>
      <AppSidebar />
      <FooterLink onClick={toggleSidebar} href="" icon={<Menu size={23} />} label="Menu" />
    </>
  );
}

export function FooterLink({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex flex-col items-center space-y-1 text-xs font-bold hover:text-yellow-300 hover:bg-gray-100/15 rounded-xl px-5 p-2 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
