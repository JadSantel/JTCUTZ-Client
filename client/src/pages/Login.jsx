import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, AlertCircle } from 'lucide-react';
import useAuth from '../context/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(form.email, form.password);
      if (data.success) {
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <div className="hidden lg:flex lg:w-1/2 bg-brand-card border-r-2 border-brand-border flex-col items-center justify-center p-16 relative overflow-hidden">
        <span className="absolute text-[20rem] font-display text-white/[0.02] select-none leading-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          JT
        </span>

        <Scissors size={64} className="text-brand-orange mb-8" strokeWidth={1.5} />
        <h1 className="font-display text-7xl text-brand-light tracking-widest3 mb-4">
          JT CUTZ
        </h1>
        <div className="w-16 h-0.5 bg-brand-orange mb-6" />
        <p className="text-brand-muted font-body tracking-widest text-center text-sm uppercase">
          Precision Cuts | Premium Grooming
        </p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <Scissors size={28} className="text-brand-orange" strokeWidth={1.5} />
            <span className="font-display text-3xl text-brand-light tracking-widest">JT CUTZ</span>
          </div>

          <h2 className="font-display text-5xl text-brand-light tracking-widest2 mb-2">
            WELCOME BACK
          </h2>
          <p className="text-brand-muted font-body text-sm tracking-wide mb-10">
            Sign in to manage your appointments
          </p>

          {error && (
            <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 mb-6 text-sm font-body">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <p className="text-brand-muted font-body text-sm text-center mt-8">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-brand-orange hover:text-brand-light transition-colors duration-200">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
