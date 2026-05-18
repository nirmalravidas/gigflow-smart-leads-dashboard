import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Zap, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { Input } from '../../components/ui/FormFields';
import { Button } from '../../components/ui/Button';
import { getErrorMessage } from '../../utils/helpers';

const schema = z.object({
  email: z.string().email('Invalid email'),
});
type FormData = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: ({ email }: FormData) => authApi.forgotPassword(email),
    onSuccess: () => setSent(true),
    onError: (err) => toast.error(getErrorMessage(err)),
  });

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
            <h1 className="font-bold text-[#e8edf5] leading-none">GigFlow</h1>
            <p className="text-xs text-[#8a97b0]">Password recovery</p>
          </div>
        </div>

        <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-6 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.12)] flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-[#22c55e]" />
              </div>
              <h2 className="text-lg font-semibold text-[#e8edf5] mb-2">Check your email</h2>
              <p className="text-sm text-[#8a97b0] mb-6">
                If an account exists with that email, we've sent a password reset link.
              </p>
              <Link to="/signin" className="text-sm text-[#4f7ef8] hover:text-[#6b93ff] transition-colors flex items-center justify-center gap-1.5">
                <ArrowLeft size={14} /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-[#e8edf5] mb-1">Forgot password?</h2>
              <p className="text-sm text-[#8a97b0] mb-6">
                Enter your email and we'll send you a reset link.
              </p>
              <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail size={14} />}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Button type="submit" className="w-full" loading={mutation.isPending} size="lg">
                  Send reset link
                </Button>
              </form>
              <div className="mt-5 text-center">
                <Link to="/signin" className="text-sm text-[#8a97b0] hover:text-[#e8edf5] transition-colors flex items-center justify-center gap-1.5">
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
