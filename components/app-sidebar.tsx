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
  SidebarSeparator,
  useSidebar, // Import useSidebar hook
} from './ui/sidebar';
import {
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  BookOpenCheck,
  Settings,
  LogOut, // Assuming Clerk will handle logout
  Tags,
  PanelLeft, // Import PanelLeft for the trigger icon if needed
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '../lib/utils';
import { Button } from './ui/button'; // Import Button for the trigger

export function AppSidebar() {
  const pathname = usePathname();
  const { state: sidebarState, toggleSidebar, isMobile, expandSidebar, collapseSidebar } = useSidebar(); // Get sidebar state and toggle function

  const isActive = (path: string) => {
    // Handle potential trailing slashes or query params if needed
    return pathname === path || pathname.startsWith(path + '/');
  };

  // Decide logo content based on sidebar state
  const LogoContent = () => (
     <>
       {/* Simple SVG Placeholder for FinanceFlow Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0 text-primary">
           <path fillRule="evenodd" d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm18 3H3.75v9a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V9zm-15-3.75a.75.75 0 00-.75.75v.75c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75v-.75a.75.75 0 00-.75-.75H5.25z" clipRule="evenodd" />
        </svg>
        <span className={cn(
            "font-semibold whitespace-nowrap transition-opacity duration-200",
            sidebarState === 'collapsed' && !isMobile ? 'opacity-0 w-0' : 'opacity-100 delay-100' // Hide text when collapsed on desktop
        )}>FinanceFlow</span>
     </>
   );

  // Decide user profile content based on sidebar state
   const UserProfileContent = () => (
      <>
        <Avatar className="h-8 w-8 shrink-0">
             <AvatarImage src="https://picsum.photos/40/40" alt="User Avatar" />
             <AvatarFallback>U</AvatarFallback>
           </Avatar>
           <div className={cn(
               "flex flex-col transition-opacity duration-200",
                sidebarState === 'collapsed' && !isMobile ? 'opacity-0 w-0' : 'opacity-100 delay-100' // Hide text when collapsed on desktop
           )}>
             <span className="text-sm font-medium whitespace-nowrap">User Name</span>
             <span className="text-xs text-muted-foreground whitespace-nowrap">user@email.com</span>
           </div>
      </>
    );

  return (
    // Use the Sidebar component which handles state internally via context
    <Sidebar
       collapsible={isMobile ? "offcanvas" : "icon"}
       variant="inset"
       side="left"
       onMouseEnter={expandSidebar} // Expand on hover
       onMouseLeave={collapseSidebar} // Collapse on leave
    >
        {/* Header remains similar, but relies on context for state */}
      <SidebarHeader className="items-center justify-between gap-2 p-2 pr-1">
         {/* Logo and Title Area */}
          <div className="flex items-center gap-2 overflow-hidden">
              <LogoContent />
          </div>
          {/* Conditionally render trigger only on Desktop */}
          {!isMobile && (
            <Button
               variant="ghost"
               size="icon"
               className="h-7 w-7 shrink-0"
               aria-label="Toggle Sidebar"
            >
                <PanelLeft className="h-4 w-4"/>
            </Button>
          )}
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
          {/* Removed Upload Extrato Link */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive('/savings')}
              tooltip="Savings & Investments"
            >
              <Link href="/savings">
                <PiggyBank />
                <span>Savings Goals</span>
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
         {/* User Profile Area */}
         <div className="flex items-center gap-2 p-2 overflow-hidden">
           <UserProfileContent />
         </div>
         <SidebarSeparator />
         <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton tooltip="Settings">
               <Settings />
               <span>Settings</span>
             </SidebarMenuButton>
           </SidebarMenuItem>
           {/* Add Logout Button - Integration with Clerk/Auth needed */}
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
