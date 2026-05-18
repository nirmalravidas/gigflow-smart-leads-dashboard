import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, Mail, RefreshCw } from 'lucide-react';
import { authApi } from '../../api/auth.api';
import { getErrorMessage } from '../../utils/helpers';
import { Button } from '../../components/ui/Button';

const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const emailParam = params.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [status, setStatus] = useState<'notice' | 'loading' | 'success' | 'error'>(
    token ? 'loading' : 'notice',
  );
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const emailIsValid = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email],
  );

  useEffect(() => {
    if (!token) return;
    authApi.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setMessage(getErrorMessage(err));
      });
  }, [token]);

  const handleResend = async () => {
    if (!emailIsValid) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setSending(true);
    try {
      await authApi.resendVerification(email);
      setStatus('notice');
      setMessage('Verification email sent. Please check your inbox (and spam).');
    } catch (err) {
      setStatus('error');
      setMessage(getErrorMessage(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] p-4">
      <div className="bg-[#161b27] border border-[#2a3347] rounded-2xl p-10 text-center max-w-sm w-full animate-fade-in shadow-2xl">
        {status === 'loading' && (
          <>
            <Loader2 size={40} className="text-[#4f7ef8] mx-auto mb-4 animate-spin" />
            <h2 className="text-lg font-semibold text-[#e8edf5]">Verifying your email...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-14 h-14 rounded-full bg-[rgba(34,197,94,0.12)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-[#22c55e]" />
            </div>
            <h2 className="text-lg font-semibold text-[#e8edf5] mb-2">Email verified!</h2>
            <p className="text-sm text-[#8a97b0] mb-6">Your account is now active. You can sign in.</p>
            <Link
              to="/signin"
              className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-[#4f7ef8] hover:bg-[#6b93ff] text-white text-sm font-medium transition-colors"
            >
              Go to Sign In
            </Link>
          </>
        )}
        {status === 'notice' && !token && (
          <>
            <div className="w-14 h-14 rounded-full bg-[rgba(79,126,248,0.12)] flex items-center justify-center mx-auto mb-4">
              <Mail size={26} className="text-[#4f7ef8]" />
            </div>
            <h2 className="text-lg font-semibold text-[#e8edf5] mb-2">Verify your email</h2>
            <p className="text-sm text-[#8a97b0] mb-6">
              We sent a verification link to your email. Open it to activate your account.
            </p>

            <div className="text-left bg-[#0f1117] border border-[#2a3347] rounded-xl p-4 mb-4">
              <label className="text-xs font-medium text-[#8a97b0] uppercase tracking-wide">Email</label>
              <div className="mt-2 flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="flex-1 h-10 rounded-lg bg-[#0f1117] border border-[#2a3347] px-3 text-sm text-[#e8edf5] placeholder:text-[#55617a] focus:outline-none focus:ring-2 focus:ring-[#4f7ef8]/40"
                />
                <Button
                  type="button"
                  onClick={handleResend}
                  loading={sending}
                  className="shrink-0"
                >
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw size={14} />
                    Resend
                  </span>
                </Button>
              </div>
              {message && <p className="mt-2 text-xs text-[#8a97b0]">{message}</p>}
            </div>

            <Link
              to="/signin"
              className="inline-flex items-center justify-center w-full h-10 rounded-lg bg-[#1e2535] hover:bg-[#2a3347] text-[#e8edf5] text-sm font-medium transition-colors"
            >
              Go to Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-14 h-14 rounded-full bg-[rgba(240,82,82,0.12)] flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={28} className="text-[#f05252]" />
            </div>
            <h2 className="text-lg font-semibold text-[#e8edf5] mb-2">Verification failed</h2>
            <p className="text-sm text-[#8a97b0] mb-6">{message || 'This link is invalid or has expired.'}</p>
            <Link
              to="/signin"
              className="inline-block text-sm text-[#4f7ef8] hover:text-[#6b93ff] transition-colors"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
