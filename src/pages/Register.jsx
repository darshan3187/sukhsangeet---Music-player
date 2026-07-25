import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerkKey = Boolean(
  rawClerkKey &&
  rawClerkKey.startsWith('pk_') &&
  !rawClerkKey.includes('dummy')
);

const inputCls = `
  w-full rounded-md border border-[#ebebeb] bg-[#fafafa]
  px-3.5 py-2.5 text-sm font-sans text-[#171717]
  outline-none transition-all duration-150
  placeholder:text-[#888888] placeholder:font-normal
  focus:bg-white focus:border-[#171717] focus:ring-1 focus:ring-[#171717]
  h-[40px]
`;

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasClerkKey && isAuthenticated && !isLoading) {
      navigate('/find-music', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (!hasClerkKey && isAuthenticated && !isLoading) {
    return <Navigate to="/find-music" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await register(username, email, password);
      navigate('/find-music', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Unable to create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4 py-12 relative overflow-hidden"
      aria-label="Register page"
    >
      <div className="vercel-mesh-gradient pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <div className="w-full max-w-[400px] relative z-10 flex flex-col items-center">
        {hasClerkKey ? (
          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            fallbackRedirectUrl="/find-music"
            forceRedirectUrl="/find-music"
            signUpFallbackRedirectUrl="/find-music"
            signUpForceRedirectUrl="/find-music"
          />
        ) : (
          <div className="w-full rounded-xl border border-[#ebebeb] bg-white p-8 shadow-level-4">
            <div className="text-center mb-6">
              <Link to="/" className="inline-block mb-4" aria-label="Go to landing page">
                <img
                  src="/logo-sukhsangeet.webp"
                  alt="Sukh Sangeet"
                  className="w-12 h-12 mx-auto rounded-xl shadow-sm object-contain"
                />
              </Link>
              <h1 className="text-xl font-semibold text-[#171717] tracking-tight">Create Account</h1>
              <p className="font-mono text-xs text-[#888888] mt-1">Start listening for free</p>
            </div>

            {error && (
              <p role="alert" className="mb-4 rounded-md border border-[#ee0000]/20 bg-[#f7d4d6]/40 p-3 font-mono text-xs text-[#ee0000]">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#4d4d4d] mb-1.5 block" htmlFor="reg-username">Username</label>
                <input
                  id="reg-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputCls}
                  placeholder="johndoe"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#4d4d4d] mb-1.5 block" htmlFor="reg-email">Email</label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#4d4d4d] mb-1.5 block" htmlFor="reg-password">Password</label>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-[#4d4d4d] mb-1.5 block" htmlFor="reg-confirm-password">Confirm Password</label>
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-[#171717] text-white rounded-md text-xs font-mono font-medium uppercase tracking-wider shadow-sm hover:bg-black active:scale-[0.98] transition-all mt-2 cursor-pointer"
              >
                {isSubmitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#888888]">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-[#171717] underline underline-offset-2 hover:text-[#0070f3]">
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
