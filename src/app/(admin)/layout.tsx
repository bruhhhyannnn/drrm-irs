'use client';

import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppHeader } from '@/components/layout/app-header';
import { Backdrop } from '@/components/layout/backdrop';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useSidebarStore } from '@/store/sidebar.store';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebarStore();

  const marginLeft = isMobileOpen
    ? 'ml-0'
    : isExpanded || isHovered
      ? 'lg:ml-[290px]'
      : 'lg:ml-[90px]';

  return (
    <ProtectedRoute>
      <div className="min-h-screen xl:flex">
        <AppSidebar />
        <Backdrop />
        <div className={`flex-1 transition-all duration-300 ease-in-out ${marginLeft}`}>
          <AppHeader />
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
