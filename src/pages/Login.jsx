import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

const rawClerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const hasClerkKey = Boolean(
  rawClerkKey &&
  rawClerkKey.startsWith('pk_') &&
  !rawClerkKey.includes('dummy')
);

const inputCls = `
  w-full rounded-xl border border-black/[0.06] bg-black/[0.03]
  px-5 py-3.5 text-sm font-semibold text-gray-900
  outline-none transition-all duration-200
  placeholder:text-gray-400/60 placeholder:font-normal
  focus:bg-black/[0.05] focus:border-gray-300
  focus:ring-2 focus:ring-gray-900/10
  min-h-[48px]
`;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/find-music', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated && !isLoading) return <Navigate to="/find-music" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/find-music', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Unable to sign in. Please check your credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative overflow-hidden"
      aria-label="Login page"
    >
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-gray-200/40 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-gray-100/60 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up flex flex-col items-center">
        {hasClerkKey ? (
          <SignIn routing="path" path="/login" signUpUrl="/register" fallbackRedirectUrl="/find-music" />
        ) : (
          <div className="w-full surface-raised rounded-[2.5rem] p-8 md:p-10 shadow-xl">
            <div className="text-center mb-8">
              <Link to="/" className="inline-block mb-5" aria-label="Go to landing page">
                <img
                  src="/logo-sukhsangeet.webp"
                  alt="Sukh Sangeet"
                  className="w-12 h-12 mx-auto rounded-2xl shadow-sm object-cover"
                />
              </Link>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
              <p className="text-body-sm mt-1">Sign in to your account</p>
            </div>

            {error && (
              <p role="alert" className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-600">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label className="text-label mb-2 block" htmlFor="login-email">Email</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-label mb-2 block" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:shadow-lg active:scale-95 transition-all mt-2"
              >
                {isSubmitting ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <p className="mt-6 text-center text-xs font-semibold text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-black text-gray-900 underline hover:no-underline">
                Create one
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
