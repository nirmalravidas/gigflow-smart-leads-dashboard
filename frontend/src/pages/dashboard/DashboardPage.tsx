import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, TrendingUp, UserCheck, UserX, BarChart3, Sparkles } from 'lucide-react';
import { leadsApi } from '../../api/leads.api';
import { useAuthStore } from '../../store/auth.store';
import { LeadStatus, LeadSource } from '../../types';
import { PageLoader } from '../../components/ui';

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
  delay?: number;
}> = ({ title, value, icon, color, sub, delay = 0 }) => (
  <div 
    className="glass-panel rounded-2xl p-6 card-hover relative overflow-hidden group opacity-0 animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${color}`} />
    
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">{title}</p>
        <p className="text-4xl font-bold text-foreground tracking-tight">{value}</p>
        {sub && (
          <p className="text-xs font-medium mt-3 inline-flex items-center px-2 py-1 rounded-md bg-white/5 text-muted-foreground border border-white/5">
            {sub}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-card-alt border border-white/5 shadow-inner ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: () => leadsApi.getStats().then((r) => r.data.data!),
  });

  const stats = statsData;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 opacity-0 animate-fade-in relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-4">
          <Sparkles size={14} />
          <span>Dashboard Overview</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Good {getGreeting()}, <span className="text-gradient">{user?.name.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Here's what's happening with your leads today.</p>
      </div>

      {isLoading ? <PageLoader /> : (
        <div className="relative z-10">
          {/* Top stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Leads"
              value={stats?.total ?? 0}
              icon={<Users size={22} className="text-primary" />}
              color="bg-primary"
              delay={100}
            />
            <StatCard
              title="Qualified"
              value={stats?.byStatus?.[LeadStatus.QUALIFIED] ?? 0}
              icon={<TrendingUp size={22} className="text-success" />}
              color="bg-success"
              sub={`${pct(stats?.byStatus?.[LeadStatus.QUALIFIED], stats?.total)}% conversion`}
              delay={200}
            />
            <StatCard
              title="Contacted"
              value={stats?.byStatus?.[LeadStatus.CONTACTED] ?? 0}
              icon={<UserCheck size={22} className="text-warning" />}
              color="bg-warning"
              delay={300}
            />
            <StatCard
              title="Lost"
              value={stats?.byStatus?.[LeadStatus.LOST] ?? 0}
              icon={<UserX size={22} className="text-danger" />}
              color="bg-danger"
              delay={400}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* By Status */}
            <div 
              className="glass-panel rounded-2xl p-6 opacity-0 animate-slide-up"
              style={{ animationDelay: '500ms' }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Leads by Status</h2>
              </div>
              <div className="space-y-5">
                {Object.entries(statusConfig).map(([status, cfg]) => {
                  const count = stats?.byStatus?.[status] ?? 0;
                  const total = stats?.total ?? 1;
                  const width = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={status} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">{status}</span>
                        <span className="text-foreground font-bold">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-card-alt overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out relative"
                          style={{ width: `${width}%`, background: cfg.color }}
                        >
                          <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* By Source */}
            <div 
              className="glass-panel rounded-2xl p-6 opacity-0 animate-slide-up"
              style={{ animationDelay: '600ms' }}
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-lg font-semibold text-foreground tracking-tight">Leads by Source</h2>
              </div>
              <div className="space-y-5">
                {Object.entries(sourceConfig).map(([source, cfg]) => {
                  const count = stats?.bySource?.[source] ?? 0;
                  const total = stats?.total ?? 1;
                  const width = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={source} className="group">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground font-medium">{source}</span>
                        <span className="text-foreground font-bold">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-card-alt overflow-hidden border border-white/5">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${width}%`, background: cfg.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

const pct = (val?: number, total?: number) => {
  if (!val || !total) return 0;
  return Math.round((val / total) * 100);
};

const statusConfig: Record<string, { color: string }> = {
  [LeadStatus.NEW]:       { color: 'var(--color-accent)' },
  [LeadStatus.CONTACTED]: { color: 'var(--color-warning)' },
  [LeadStatus.QUALIFIED]: { color: 'var(--color-success)' },
  [LeadStatus.LOST]:      { color: 'var(--color-danger)' },
};

const sourceConfig: Record<string, { color: string }> = {
  [LeadSource.WEBSITE]:   { color: '#6366f1' }, // Indigo
  [LeadSource.INSTAGRAM]: { color: '#ec4899' }, // Pink
  [LeadSource.REFERRAL]:  { color: '#f59e0b' }, // Amber
};

export default DashboardPage;
