import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Music2 } from 'lucide-react';

/* Shared input style – kept in sync with Login.jsx */
const inputCls = `
  w-full rounded-xl border border-black/[0.06] bg-black/[0.03]
  px-5 py-3.5 text-sm font-semibold text-gray-900
  outline-none transition-all duration-200
  placeholder:text-gray-400/60 placeholder:font-normal
  focus:bg-black/[0.05] focus:border-gray-300
  focus:ring-2 focus:ring-gray-900/10
  min-h-[48px]
`;

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const [isSubmitting,    setIsSubmitting]    = useState(false);
  const [touched, setTouched] = useState({ username: false, email: false, password: false, confirm: false });

  const usernameError = touched.username && !username.trim() ? 'Username is required.' : '';
  const emailError = touched.email && !email.trim() ? 'Email is required.' : '';
  const passwordError = touched.password && password.length < 8 ? 'Use at least 8 characters.' : '';
  const confirmError = touched.confirm && confirmPassword !== password ? 'Passwords do not match.' : '';

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated && !isLoading) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ username: true, email: true, password: true, confirm: true });

    if (!username.trim() || !email.trim() || password.length < 8 || password !== confirmPassword) {
      if (!username.trim()) {
        setError('Username is required.');
        return;
      }
      if (!email.trim()) {
        setError('Email is required.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(username, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Unable to create account. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative overflow-hidden"
      aria-label="Register page"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-[480px] h-[480px] bg-gray-100/60 rounded-full blur-[100px] -ml-40 -mt-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-gray-200/40 rounded-full blur-[100px] -mr-40 -mb-40 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[460px] relative z-10 animate-fade-in-up">
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
              Create Profile
            </h1>
            <p className="text-body-sm mt-2">Join the community of listeners.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Username */}
            <label className="block" htmlFor="reg-username">
              <span className="text-label mb-2 block">Username</span>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, username: true }))}
                className={`${inputCls} ${usernameError ? 'border-red-300 bg-red-50/60' : username && touched.username ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                placeholder="yourname"
                autoComplete="username"
                aria-invalid={Boolean(usernameError)}
                aria-describedby="reg-username-state"
                required
              />
              <p id="reg-username-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${usernameError ? 'text-red-600' : username && touched.username ? 'text-emerald-600' : 'text-gray-500'}`}>
                {usernameError ? <AlertCircle size={14} /> : username && touched.username ? <CheckCircle2 size={14} /> : null}
                {usernameError || (username && touched.username ? 'Looks good.' : 'Pick a memorable handle.')}
              </p>
            </label>

            {/* Email */}
            <label className="block" htmlFor="reg-email">
              <span className="text-label mb-2 block">Email Address</span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                className={`${inputCls} ${emailError ? 'border-red-300 bg-red-50/60' : email && touched.email ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
                aria-invalid={Boolean(emailError)}
                aria-describedby="reg-email-state"
                required
              />
              <p id="reg-email-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${emailError ? 'text-red-600' : email && touched.email ? 'text-emerald-600' : 'text-gray-500'}`}>
                {emailError ? <AlertCircle size={14} /> : email && touched.email ? <CheckCircle2 size={14} /> : null}
                {emailError || (email && touched.email ? 'Looks good.' : 'Use a valid email address.')}
              </p>
            </label>

            {/* Password row – side by side on wider screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block" htmlFor="reg-password">
                <span className="text-label mb-2 block">Password</span>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                  className={`${inputCls} ${passwordError ? 'border-red-300 bg-red-50/60' : password && touched.password ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                  placeholder="Min 8 chars"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby="reg-password-state"
                />
                <p id="reg-password-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${passwordError ? 'text-red-600' : password && touched.password ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {passwordError ? <AlertCircle size={14} /> : password && touched.password ? <CheckCircle2 size={14} /> : null}
                  {passwordError || (password && touched.password ? 'Looks good.' : 'Use 8+ characters.')}
                </p>
              </label>

              <label className="block" htmlFor="reg-confirm">
                <span className="text-label mb-2 block">Confirm</span>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((current) => ({ ...current, confirm: true }))}
                  className={`${inputCls} ${confirmError ? 'border-red-300 bg-red-50/60' : confirmPassword && touched.confirm && confirmPassword === password ? 'border-emerald-300 bg-emerald-50/60' : ''}`}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  required
                  aria-invalid={Boolean(confirmError)}
                  aria-describedby="reg-confirm-state"
                />
                <p id="reg-confirm-state" className={`mt-2 flex items-center gap-2 text-xs font-semibold ${confirmError ? 'text-red-600' : confirmPassword && touched.confirm && confirmPassword === password ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {confirmError ? <AlertCircle size={14} /> : confirmPassword && touched.confirm && confirmPassword === password ? <CheckCircle2 size={14} /> : null}
                  {confirmError || (confirmPassword && touched.confirm && confirmPassword === password ? 'Passwords match.' : 'Repeat the password exactly.')}
                </p>
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-bold text-red-600 text-center flex items-center justify-center gap-2"
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
              id="register-submit-btn"
            >
              {isSubmitting ? 'Creating Account…' : 'Join Platform'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-black/[0.04] text-center">
            <p className="text-body-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-gray-900 underline decoration-2 underline-offset-4 hover:decoration-[3px] transition-all"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
