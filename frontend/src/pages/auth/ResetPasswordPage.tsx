import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Zap, Lock, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import { getErrorMessage } from '../../utils/helpers';

const schema = z.object({
  password: z.string()
    .min(8, 'Min 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must contain uppercase, lowercase, and a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ password }: FormData) => authApi.resetPassword(token!, password),
    onSuccess: () => {
      toast.success('Password reset successfully. Please sign in.');
      navigate('/signin');
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
        <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-8 text-center max-w-sm w-full">
          <AlertCircle size={40} className="text-[#f05252] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#e8edf5] mb-2">Invalid reset link</h2>
          <p className="text-sm text-[#8a97b0] mb-6">This link is invalid or has expired.</p>
          <Button onClick={() => navigate('/forgot-password')} className="w-full">
            Request new link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#4f7ef8 1px, transparent 1px), linear-gradient(90deg, #4f7ef8 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-[#4f7ef8] flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-[#e8edf5] leading-none">SmartLeads</h1>
            <p className="text-xs text-[#8a97b0]">Set new password</p>
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-6 shadow-2xl">
          <h2 className="text-lg font-semibold text-[#e8edf5] mb-1">Reset password</h2>
          <p className="text-sm text-[#8a97b0] mb-6">Enter your new password below.</p>

          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <Input
              label="New Password"
              type="password"
              placeholder="Min 8 chars, A-z, 0-9"
              icon={<Lock size={14} />}
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Repeat new password"
              icon={<Lock size={14} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" className="w-full" loading={mutation.isPending} size="lg">
              Reset password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
