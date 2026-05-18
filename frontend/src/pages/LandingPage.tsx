import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  Download,
  Filter,
  Lock,
  Shield,
  Zap,
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Filter size={20} className="text-primary" />,
      iconBg: 'bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
      title: 'Advanced Filtering',
      desc: 'Filter by status, source, and search by name or email. Combines instantly for precise queries.',
    },
    {
      icon: <Shield size={20} className="text-success" />,
      iconBg: 'bg-success/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]',
      title: 'Role-Based Access',
      desc: 'Admins see everything. Sales users only see their own leads — secured server-side.',
    },
    {
      icon: <Download size={20} className="text-purple-400" />,
      iconBg: 'bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]',
      title: 'CSV Export',
      desc: 'Export any filtered view instantly. Perfect for offline reporting and integrations.',
    },
    {
      icon: <Lock size={20} className="text-warning" />,
      iconBg: 'bg-warning/10 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
      title: 'JWT Authentication',
      desc: 'Secure access token flows with email verification and rock-solid password handling.',
    },
    {
      icon: <Database size={20} className="text-orange-400" />,
      iconBg: 'bg-orange-500/10 shadow-[0_0_15px_rgba(251,146,60,0.2)]',
      title: 'Backend Pagination',
      desc: 'Lightning-fast paging with precise counts. Built to handle thousands of records seamlessly.',
    },
    {
      icon: <Activity size={20} className="text-danger" />,
      iconBg: 'bg-danger/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]',
      title: 'Debounced Search',
      desc: 'Real-time search across names and emails optimized for performance without API spam.',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-purple-600/40 blur-[100px] rounded-full animate-glow" />
      </div>

      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-3 group"
          >
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-white" />
            </span>
            <span className="font-bold text-lg tracking-tight text-gradient">SmartLeads</span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="hidden sm:block h-10 px-4 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card-alt transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-primary h-10 text-sm shadow-glow"
            >
              Get started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10">
        <header className="text-center max-w-4xl mx-auto mb-24 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Zap size={14} />
            <span>SmartLeads 2.0 is now live</span>
            <span className="hidden sm:inline opacity-60">— Experience the new standard</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Manage your leads.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-purple-500">
              Close deals faster.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
            A unified, lightning-fast dashboard to track, filter, and convert prospects. Built for modern sales teams who demand speed and precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-primary h-12 px-8 text-base w-full sm:w-auto shadow-glow group"
            >
              Start for free 
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="btn-secondary h-12 px-8 text-base w-full sm:w-auto group"
            >
              View live demo 
              <ChevronRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform opacity-70" />
            </button>
          </div>
        </header>

        <section id="features" className="mb-32 scroll-mt-24">
          <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything your team needs</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Engineered for scale. Featuring role-based access, instant exports, and an interface that stays out of your way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-panel p-8 rounded-3xl card-hover opacity-0 animate-slide-up group"
                style={{ animationDelay: `${300 + i * 100}ms` }}
              >
                <div className={`w-12 h-12 rounded-2xl ${f.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="mb-32 scroll-mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by top performers</h2>
            <p className="text-lg text-muted-foreground">See how teams are accelerating their sales cycles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "It's blindingly fast. We cut our response times in half simply because we aren't fighting the UI anymore.",
                name: 'Rahul Sharma',
                role: 'VP of Sales',
                initials: 'RS',
                bg: 'bg-primary/20',
                color: 'text-primary',
              },
              {
                quote: "The granular role access means reps only see their pipeline, keeping everyone focused and compliant.",
                name: 'Priya Verma',
                role: 'Revenue Operations',
                initials: 'PV',
                bg: 'bg-purple-500/20',
                color: 'text-purple-400',
              },
              {
                quote: "Exporting targeted lists used to take hours. Now it's a two-second job. Absolute game changer.",
                name: 'Arjun Mehta',
                role: 'Growth Lead',
                initials: 'AM',
                bg: 'bg-success/20',
                color: 'text-success',
              },
            ].map((t) => (
              <div key={t.name} className="glass-panel p-8 rounded-3xl card-hover relative group">
                <div className="absolute top-8 right-8 opacity-10 text-6xl font-serif text-white group-hover:opacity-20 transition-opacity">"</div>
                <p className="text-muted-foreground leading-relaxed italic mb-8 relative z-10 text-lg">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full ${t.bg} flex items-center justify-center font-bold ${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="scroll-mt-24">
          <div className="glass-panel rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden border border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
            
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-8 shadow-glow">
              <Zap size={32} className="text-white" />
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Ready to upgrade your workflow?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join thousands of professionals tracking their leads the smart way. No credit card required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
              {['Free forever plan', 'Instant setup', 'Enterprise security'].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium">
                  <Check size={16} className="text-success" />
                  {item}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-primary h-14 px-10 text-lg shadow-glow hover:scale-105"
            >
              Create your free account
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-background/80 backdrop-blur-md relative z-10">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </span>
            <span className="font-bold text-foreground tracking-tight">SmartLeads</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SmartLeads. Built with React & Tailwind CSS.
          </p>

          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

