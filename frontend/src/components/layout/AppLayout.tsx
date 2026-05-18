import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        {/* Mobile header */}
        <header className="md:hidden h-14 border-b border-border-theme bg-card/80 backdrop-blur-md flex items-center px-4 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-alt transition-colors"
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <div className="ml-3">
            <p className="text-sm font-semibold text-foreground leading-none">GigFlow</p>
            <p className="text-[11px] text-primary mt-0.5 font-medium tracking-wide">Leads dashboard</p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto min-w-0 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
