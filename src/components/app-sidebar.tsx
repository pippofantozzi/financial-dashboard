'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ReceiptText,
  CalendarClock,
  PiggyBank,
  BookOpenCheck,
  Settings,
  FileUp,
  LogOut, // Assuming Clerk will handle logout
  Tags,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar collapsible="icon" variant="inset" side="left">
      <SidebarHeader className="items-center justify-between gap-0">
        <div className="flex items-center gap-2 p-2 [&>span]:hidden group-data-[collapsible=icon]:[&>span]:flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 text-primary"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-semibold">FinanceFlow</span>
        </div>
        {/* Mobile trigger is inside SidebarInset, but desktop trigger can be here */}
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/dashboard')}
              tooltip="Dashboard"
            >
              <Link href="/dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/transactions')}
              tooltip="Transactions"
            >
              <Link href="/transactions">
                <ReceiptText />
                <span>Transactions</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/current-month')}
              tooltip="Current Month / Upload"
            >
              <Link href="/current-month">
                <FileUp />
                <span>Upload Extrato</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/savings')}
              tooltip="Savings & Investments"
            >
              <Link href="/savings">
                <PiggyBank />
                <span>Savings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/monthly-reports')}
              tooltip="Monthly Reports"
            >
              <Link href="/monthly-reports">
                <BookOpenCheck />
                <span>Monthly Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/categories')}
                tooltip="Manage Categories"
              >
                <Link href="/categories">
                  <Tags />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
         {/* Placeholder for User Profile - Assuming Clerk provides user info */}
         <div className="flex items-center gap-2 p-2">
           <Avatar className="h-8 w-8">
             <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" />
             <AvatarFallback>U</AvatarFallback>
           </Avatar>
           <div className="flex flex-col group-data-[collapsible=icon]:hidden">
             <span className="text-sm font-medium">User Name</span>
             <span className="text-xs text-muted-foreground">user@email.com</span>
           </div>
         </div>
         <SidebarSeparator />
         <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton tooltip="Settings">
               <Settings />
               <span>Settings</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
           {/* Add Logout Button - Integration with Clerk needed */}
           <SidebarMenuItem>
             <SidebarMenuButton tooltip="Logout">
               <LogOut />
               <span>Logout</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
