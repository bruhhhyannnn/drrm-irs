'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useCallback } from 'react';
import { useSidebarStore } from '@/store';
import {
  LayoutDashboard,
  ScrollText,
  CalendarDays,
  BarChart2,
  Users,
  Calendar,
  Newspaper,
  Settings,
  ChevronDown,
} from 'lucide-react';
<<<<<<< Updated upstream
import { cn } from '@/lib/utils';
import Image from 'next/image';
>>>>>>> Stashed changes
=======
import { cn } from '@/lib/utils';
import Image from 'next/image';
=======
import { cn } from '@/lib/utils';
import Image from 'next/image';
>>>>>>> Stashed changes

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path?: string }[];
};

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, name: 'Home', path: '/' },
  { icon: <CalendarDays size={20} />, name: 'Events', path: '/events' },
  { icon: <Newspaper size={20} />, name: 'News', path: '/news' },
  { icon: <BarChart2 size={20} />, name: 'Reports', path: '/reports' },
  { icon: <Calendar size={20} />, name: 'Calendar', path: '/calendar' },
  { icon: <Users size={20} />, name: 'Users', path: '/users' },
  { icon: <ScrollText size={20} />, name: 'Activity Logs', path: '/activity-logs' },
  {
    icon: <Settings size={20} />,
    name: 'Settings',
    subItems: [
      { name: 'Event Scenarios', path: '/settings/event-scenarios' },
      { name: 'Event Actions', path: '/settings/event-actions' },
      { name: 'Locations', path: '/settings/locations' },
      { name: 'User Types', path: '/settings/user-types' },
      { name: 'Colleges/Units', path: '/settings/colleges' },
      { name: 'Buildings/Zones', path: '/settings/buildings' },
      { name: 'Observee Areas', path: '/settings/observee-areas' },
      { name: 'Observee Roles', path: '/settings/observee-roles' },
      { name: 'Remarks', path: '/settings/remarks' },
    ],
  },
];

export function AppSidebar() {
  const { isExpanded, isMobileOpen, isHovered, openSubmenu, setIsHovered, toggleSubmenu } =
    useSidebarStore();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const isVisible = isExpanded || isHovered || isMobileOpen;

  const isActive = useCallback(
    (path?: string) => {
      if (!path) return false;
      if (path === '/') return pathname === '/';
      return pathname.startsWith(path);
    },
    [pathname]
  );

  // Auto-open submenu for active path
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.subItems?.some((sub) => sub.path && pathname.startsWith(sub.path))) {
        toggleSubmenu(item.name);
      }
    });
  }, [pathname]);

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'fixed top-0 left-0 z-9 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900',
        isVisible ? 'w-72.5' : 'w-20',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center border-b border-gray-200 py-4 dark:border-gray-800',
          isVisible ? 'justify-start px-6' : 'justify-center px-4'
        )}
      >
        <Link href="/" className="flex items-center gap-3">
<Image
src="/irs-logo.png"
            alt="IRS Logo"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-lg"
          />
          {isVisible && (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Incident Reporting System</span>
              <span className="text-xs text-gray-500">UP Manila DRRM -H</span>
>>>>>>> Stashed changes
=======
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Incident Reporting System</span>
              <span className="text-xs text-gray-500">UP Manila DRRM -H</span>
=======
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Incident Reporting System</span>
              <span className="text-xs text-gray-500">UP Manila DRRM -H</span>
>>>>>>> Stashed changes
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={cn(
                      'menu-item w-full',
                      openSubmenu === item.name ? 'menu-item-active' : 'menu-item-inactive',
                      !isVisible && 'lg:justify-center'
                    )}
                  >
                    <span
                      className={
                        openSubmenu === item.name
                          ? 'menu-item-icon-active'
                          : 'menu-item-icon-inactive'
                      }
                    >
                      {item.icon}
                    </span>
                    {isVisible && (
                      <>
                        <span className="menu-item-text flex-1 text-start">{item.name}</span>
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform duration-200',
                            openSubmenu === item.name && 'rotate-180'
                          )}
                        />
                      </>
                    )}
                  </button>

                  {isVisible && openSubmenu === item.name && (
                    <ul className="mt-1 ml-9 flex flex-col gap-1">
                      {item.subItems.map((sub) => (
                        <li key={sub.name}>
                          {sub.path ? (
                            <Link
                              href={sub.path}
                              className={cn(
                                'block rounded-lg px-4 py-2 text-sm transition',
                                isActive(sub.path)
                                  ? 'text-brand-500 dark:text-brand-400 font-medium'
                                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                              )}
                            >
                              {sub.name}
                            </Link>
                          ) : (
                            <span className="block rounded-lg px-3 py-2 text-sm text-gray-400">
                              {sub.name}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.path!}
                  className={cn(
                    'menu-item',
                    isActive(item.path) ? 'menu-item-active' : 'menu-item-inactive',
                    !isVisible && 'lg:justify-center'
                  )}
                >
                  <span
                    className={
                      isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                    }
                  >
                    {item.icon}
                  </span>
                  {isVisible && <span className="menu-item-text">{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {isVisible && (
        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          <p className="text-center text-xs text-gray-400">UP Manila DRRM-H © 2025</p>
        </div>
      )}
    </aside>
  );
}
