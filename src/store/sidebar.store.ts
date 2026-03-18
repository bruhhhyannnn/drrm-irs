import { create } from 'zustand';

interface SidebarState {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  openSubmenu: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (val: boolean) => void;
  toggleSubmenu: (key: string) => void;
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  isHovered: false,
  openSubmenu: null,
  toggleSidebar: () => set((s) => ({ isExpanded: !s.isExpanded })),
  toggleMobileSidebar: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
  setIsHovered: (val) => set({ isHovered: val }),
  toggleSubmenu: (key) => set((s) => ({ openSubmenu: s.openSubmenu === key ? null : key })),
  closeMobile: () => set({ isMobileOpen: false }),
}));
