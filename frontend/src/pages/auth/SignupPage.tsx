import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, User } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import { UserRole } from '../../types';
import { getErrorMessage } from '../../utils/helpers';

const schema = z.object({
  name:     z.string().min(2, 'Min 2 characters').max(100),
  email:    z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and number'),
  role: z.nativeEnum(UserRole).optional(),
});
type FormData = z.infer<typeof schema>;

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: UserRole.SALES },
  });

  const selectedRole = watch('role');

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.signup(data).then((r) => r.data),
    onSuccess: (_res, variables) => {
      toast.success('Account created! Please check your email to verify.');
      navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-purple-600/40 blur-[100px] rounded-full animate-glow" />
      </div>

      <div className="relative w-full max-w-sm animate-fade-in z-10">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-foreground tracking-tight leading-none">SmartLeads</h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">Lead management dashboard</p>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-foreground mb-1">Create account</h2>
          <p className="text-sm text-muted-foreground mb-6">Get started with SmartLeads</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Rahul Sharma"
              icon={<User size={16} />}
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 8 chars, A-z, 0-9"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Role selector */}
            <div className="flex flex-col gap-2 pt-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: UserRole.SALES,  label: 'Sales',  desc: 'Manage own leads' },
                  { value: UserRole.ADMIN,  label: 'Admin',  desc: 'Full access' },
                ].map((r) => (
                  <label key={r.value} className="relative cursor-pointer group">
                    <input type="radio" value={r.value} className="sr-only" {...register('role')} />
                    <div className={`border rounded-xl p-3 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[72px] ${
                      selectedRole === r.value 
                        ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.15)] ring-1 ring-primary/30' 
                        : 'border-border-theme bg-card/40 hover:bg-card hover:border-primary/50'
                    }`}>
                      <p className={`text-sm font-bold mb-0.5 transition-colors ${
                        selectedRole === r.value ? 'text-primary' : 'text-foreground group-hover:text-primary/90'
                      }`}>{r.label}</p>
                      <p className={`text-[11px] leading-tight transition-colors ${
                        selectedRole === r.value ? 'text-primary/80 font-medium' : 'text-muted-foreground'
                      }`}>{r.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" loading={mutation.isPending} size="lg">
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
            Already have an account?{' '}
            <Link to="/signin" className="text-primary hover:text-primary-hover font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
