'use client';

import {
  Coffee,
  LayoutDashboard,
  Package,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/inventory', label: 'Inventory', icon: Package },
  { href: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 left-0 h-screen w-16 flex flex-col items-center gap-y-4 border-r bg-card py-4">
      <Link
        href="/dashboard"
        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
      >
        <Coffee className="h-6 w-6" />
        <span className="sr-only">Bean Counter</span>
      </Link>
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-muted',
                      isActive
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
