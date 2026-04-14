import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Music2 } from 'lucide-react';

/* Shared input style */
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
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && !email.trim() ? 'Email is required.' : '';
  const passwordError = touched.password && !password.trim() ? 'Password is required.' : '';
  const hasFieldError = Boolean(emailError || passwordError);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated && !isLoading) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    if (!email.trim() || !password.trim()) {
      setError('Please complete both fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/', { replace: true });
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
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-gray-200/40 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-[480px] h-[480px] bg-gray-100/60 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
        <div className="surface-raised rounded-[2.5rem] p-8 md:p-10 shadow-xl">

          {/* Brand */}
          <div className="text-center mb-8">
            <div
              className="w-14 h-14 bg-gray-900 rounded-2xl flex items-center justify-center
                         mx-auto mb-5 shadow-lg transition-transform hover:scale-105"
              aria-hidden="true"
            >
              <Music2 size={24} className="text-white" />
            </div>
            <p className="text-label mb-2">Music Experience</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-body-sm mt-2">Sign in and find your flow.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <label className="block" htmlFor="login-email">
              <span className="text-label mb-2 block">Email Address</span>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                className={`${inputCls} ${emailError ? 'border-red-300 bg-red-50/60' : email && touched.email ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby="login-email-hint login-email-state"
                required
              />
              <p id="login-email-hint" className="mt-2 text-xs text-gray-500">Use the email tied to your account.</p>
              <p id="login-email-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${emailError ? 'text-red-600' : email && touched.email ? 'text-emerald-600' : 'text-gray-500'}`}>
                {emailError ? <AlertCircle size={14} /> : email && touched.email ? <CheckCircle2 size={14} /> : null}
                {emailError || (email && touched.email ? 'Looks good.' : '')}
              </p>
            </label>

            <label className="block" htmlFor="login-password">
              <span className="text-label mb-2 block">Password</span>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                className={`${inputCls} ${passwordError ? 'border-red-300 bg-red-50/60' : password && touched.password ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                placeholder="Your password"
                autoComplete="current-password"
                aria-invalid={Boolean(passwordError)}
                aria-describedby="login-password-hint login-password-state"
                required
              />
              <p id="login-password-hint" className="mt-2 text-xs text-gray-500">Minimum 8 characters recommended.</p>
              <p id="login-password-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${passwordError ? 'text-red-600' : password && touched.password ? 'text-emerald-600' : 'text-gray-500'}`}>
                {passwordError ? <AlertCircle size={14} /> : password && touched.password ? <CheckCircle2 size={14} /> : null}
                {passwordError || (password && touched.password ? 'Looks good.' : '')}
              </p>
            </label>

            {error && (
              <p
                role="alert"
                className={`rounded-xl px-4 py-3 text-xs font-bold text-center flex items-center justify-center gap-2 ${hasFieldError ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-red-50 border border-red-100 text-red-600'}`}
              >
                <AlertCircle size={14} />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full rounded-xl bg-gray-900 py-4 mt-2
                text-xs font-black uppercase tracking-[0.22em] text-white
                transition-all duration-200 shadow-lg
                hover:shadow-xl hover:scale-[1.01]
                active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
                min-h-[52px]
              "
              id="login-submit-btn"
            >
              {isSubmitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black/[0.04] text-center">
            <p className="text-body-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-gray-900 underline decoration-2 underline-offset-4 hover:decoration-[3px] transition-all"
              >
                Join the platform
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
