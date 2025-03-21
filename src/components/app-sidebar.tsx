import * as React from 'react';
import { ChevronRight } from 'lucide-react';

import { SearchForm } from '@/components/search-form';
import { VersionSwitcher } from '@/components/version-switcher';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Crypto Win Originals',
      items: [
        {
          title: 'Crash Game',
          url: '#',
        },
        {
          title: 'Slot Game',
          url: '#',
          isActive: true,
        },
        {
          title: 'Crypto Dash',
          url: '#',
        },
        {
          title: 'Golden Dice',
          url: '#',
        },
      ],
    },
    {
      title: 'Wallet',
      url: '#',
      items: [],
    },
    {
      title: 'Top Picks',
      url: '#',
      items: [
        {
          title: 'Casino',
          url: '#',
        },
        {
          title: 'Sports',
          url: '#',
          isActive: true,
        },
        {
          title: 'Crypto Wins',
          url: '#',
        },
        {
          title: 'Watcher',
          url: '#',
        },
        {
          title: 'Stuff',
          url: '#',
        },
      ],
    },
    {
      title: 'Slots',
      url: '#',
      items: [
        {
          title: 'Golden Dice',
          url: '#',
        },
        {
          title: 'Crypto Rush',
          url: '#',
        },
        {
          title: 'Lucky Spin',
          url: '#',
        },
        {
          title: 'Shining Diamond',
          url: '#',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <Collapsible key={item.title} title={item.title} defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm"
              >
                <CollapsibleTrigger>
                  {item.title}
                  {item.items?.length > 0 && (
                    <>
                      <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </>
                  )}
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
