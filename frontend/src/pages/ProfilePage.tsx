import { Mail, Calendar, Shield, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { UserRole } from '../types';
import { PageLoader } from '../components/ui';

const ProfilePage = () => {
  const { user } = useAuthStore();

  if (!user) return <PageLoader />;

  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#e8edf5]">Profile</h1>
        <p className="text-sm text-[#8a97b0] mt-0.5">Your account details</p>
      </div>

      <div className="bg-[#161b27] border border-[#2a3347] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#2a3347] flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[rgba(79,126,248,0.15)] flex items-center justify-center text-2xl font-bold text-[#4f7ef8]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#e8edf5]">{user.name}</h2>
            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
              isAdmin
                ? 'bg-[rgba(79,126,248,0.12)] text-[#4f7ef8] border-[rgba(79,126,248,0.3)]'
                : 'bg-[#1e2535] text-[#8a97b0] border-[#2a3347]'
            }`}>
              {isAdmin ? <Shield size={10} /> : <UserCircle size={10} />}
              {user.role}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#1e2535]">
          {([
            { icon: <Mail size={15} />,       label: 'Email',          value: user.email,            cls: '' },
            { icon: <UserCircle size={15} />,  label: 'Role',           value: user.role,             cls: '' },
            { icon: <Calendar size={15} />,    label: 'Joined',         value: new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), cls: '' },
            { icon: <Shield size={15} />,      label: 'Email verified', value: user.isEmailVerified ? '✓ Verified' : '✗ Not verified', cls: user.isEmailVerified ? 'text-[#22c55e]' : 'text-[#f59e0b]' },
          ] as const).map((row) => (
            <div key={row.label} className="flex items-center px-6 py-4">
              <div className="flex items-center gap-2 w-40 text-[#8a97b0] text-sm">
                {row.icon}
                {row.label}
              </div>
              <span className={`text-sm ${row.cls || 'text-[#e8edf5]'}`}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
