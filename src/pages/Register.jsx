import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const inputCls = `
  w-full rounded-xl border border-black/[0.06] bg-black/[0.03]
  px-5 py-3.5 text-sm font-semibold text-gray-900
  outline-none transition-all duration-200
  placeholder:text-gray-400/60 placeholder:font-normal
  focus:bg-black/[0.05] focus:border-gray-300
  focus:ring-2 focus:ring-gray-900/10
  min-h-[48px]
`;

const getErrorMessage = (err) => {
  const data = err?.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data?.detail) {
    return data.detail;
  }

  if (data?.error) {
    return data.error;
  }

  if (data && typeof data === 'object') {
    const fieldMessages = Object.values(data)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .filter((value) => typeof value === 'string' && value.trim());

    if (fieldMessages.length > 0) {
      return fieldMessages.join(' ');
    }
  }

  if (!err?.response) {
    return 'Unable to reach the server. Check the API URL and CORS settings.';
  }

  return 'Unable to create account. Please try again.';
};

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated, isLoading } = useAuth();
  const [username,        setUsername]        = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error,           setError]           = useState('');
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate('/app', { replace: true });
  }, [isAuthenticated, isLoading, navigate]);

  if (isAuthenticated && !isLoading) return <Navigate to="/app" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      navigate('/app', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 relative overflow-hidden"
      aria-label="Register page"
    >
      <div className="absolute top-0 left-0 w-[480px] h-[480px] bg-gray-100/60 rounded-full blur-[100px] -ml-40 -mt-40 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-[480px] h-[480px] bg-gray-200/40 rounded-full blur-[100px] -mr-40 -mb-40 pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-[460px] relative z-10 animate-fade-in-up">
        <div className="surface-raised rounded-[2.5rem] p-8 md:p-10 shadow-xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-5" aria-label="Go to landing page">
              <img
                src="/logo-sukhsangeet.webp"
                alt="Sukh Sangeet"
                className="w-14 h-14 rounded-2xl object-cover mx-auto shadow-lg transition-transform hover:scale-105"
              />
            </Link>
            <p className="text-label mb-2">Music Experience</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Create Profile
            </h1>
            <p className="text-body-sm mt-2">Join the community of listeners.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <label className="block" htmlFor="reg-username">
              <span className="text-label mb-2 block">Username</span>
              <input
                id="reg-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                placeholder="yourname"
                autoComplete="username"
                required
              />
            </label>

            <label className="block" htmlFor="reg-email">
              <span className="text-label mb-2 block">Email Address</span>
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block" htmlFor="reg-password">
                <span className="text-label mb-2 block">Password</span>
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Min 8 chars"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>

              <label className="block" htmlFor="reg-confirm">
                <span className="text-label mb-2 block">Confirm</span>
                <input
                  id="reg-confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputCls}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  required
                />
              </label>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-bold text-red-600 text-center"
              >
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
