import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import { Input } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import { getErrorMessage } from '../../utils/helpers';

const schema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

const SigninPage: React.FC = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => authApi.signin(data).then((r) => r.data.data!),
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard');
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
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl text-foreground tracking-tight leading-none">GigFlow</h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">Lead management dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-foreground mb-1">Sign in</h2>
          <p className="text-sm text-muted-foreground mb-6">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
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
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex justify-end pt-1">
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-hover font-medium transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full mt-2" loading={mutation.isPending} size="lg">
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:text-primary-hover font-bold transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
