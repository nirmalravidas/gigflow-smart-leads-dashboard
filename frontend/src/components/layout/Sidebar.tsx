import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, LogOut, ChevronLeft, ChevronRight,
  Zap, UserCircle, Shield, UserCheck, X,
} from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';
import { authApi } from '../../api/auth.api';
import { UserRole } from '../../types';
import { useState } from 'react';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/leads',     icon: <UserCheck size={18} />,       label: 'Leads' },
  { to: '/users',     icon: <Users size={18} />,           label: 'Users', adminOnly: true },
];

export const Sidebar = ({
  mobileOpen = false,
  onMobileClose,
}: {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.signout(); } catch { /* swallow */ }
    finally { logout(); navigate('/signin'); }
  };

  const items = navItems.filter((i) => !i.adminOnly || user?.role === UserRole.ADMIN);

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all md:hidden ${
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onMobileClose}
      />

      <aside
        className={[
          'fixed z-50 inset-y-0 left-0 flex flex-col border-r border-border-theme bg-card/80 backdrop-blur-xl transition-all duration-300 ease-in-out shrink-0',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full',
          'md:static md:translate-x-0',
          collapsed ? 'w-[72px]' : 'w-[240px]',
        ].join(' ')}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border-theme/50 relative overflow-hidden group cursor-pointer" onClick={() => navigate('/dashboard')}>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shrink-0 shadow-glow relative z-10">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-foreground text-[15px] tracking-tight relative z-10 text-gradient">
            GigFlow
          </span>
        )}

        <div className="ml-auto md:hidden relative z-10">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onMobileClose?.(); }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card-alt transition-colors"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1.5 p-3 overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-10 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card-alt'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute inset-0 bg-primary/10 backdrop-blur-sm" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
                <span className={`shrink-0 transition-transform duration-200 relative z-10 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {!collapsed && <span className="truncate relative z-10">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border-theme/50 p-3 space-y-1.5 bg-background/30 backdrop-blur-sm">
        {/* Profile link */}
        <NavLink
          to="/profile"
          title={collapsed ? 'Profile' : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 w-full p-2 rounded-xl transition-all border border-transparent ${
              isActive ? 'bg-primary/10 border-primary/20 shadow-[inset_0_0_12px_rgba(59,130,246,0.1)]' : 'hover:bg-card-alt hover:border-border-light'
            }`
          }
        >
          <div className="w-8 h-8 rounded-full bg-card-alt border border-border-light flex items-center justify-center shrink-0 shadow-sm relative">
            {user?.role === UserRole.ADMIN
              ? <Shield size={14} className="text-primary" />
              : <UserCircle size={14} className="text-muted-foreground" />
            }
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-success rounded-full border border-card shadow-[0_0_4px_rgba(34,197,94,0.5)]"></div>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate leading-tight">{user?.name}</p>
              <p className="text-[11px] text-muted-foreground capitalize font-medium tracking-wide mt-0.5">{user?.role}</p>
            </div>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className="flex items-center justify-center md:justify-start gap-3 w-full px-3 h-10 rounded-xl text-sm font-medium text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all duration-200 group"
        >
          <LogOut size={16} className="shrink-0 transition-transform group-hover:-translate-x-1" />
          {!collapsed && 'Sign out'}
        </button>

        <button
          onClick={() => setCollapsed((p) => !p)}
          title={collapsed ? 'Expand' : 'Collapse'}
          className="hidden md:flex items-center justify-center md:justify-start gap-3 w-full px-3 h-10 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card-alt transition-all duration-200"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && 'Collapse sidebar'}
        </button>
      </div>
    </aside>
    </>
  );
};
