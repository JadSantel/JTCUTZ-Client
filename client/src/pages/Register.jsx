import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import useAuth from '../context/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      const data = await register(form.name, form.email, form.password, form.phone);
      if (data.success) {
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            CREATE ACCOUNT
          </h2>
          <p className="text-brand-muted font-body text-sm tracking-wide mb-10">
            Join and book your first appointment
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
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Juan dela Cruz"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

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
                Phone Number <span className="text-brand-muted/50">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+63 9XX XXX XXXX"
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
                  placeholder="Min. 6 characters"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="********"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-brand-muted font-body text-sm text-center mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-orange hover:text-brand-light transition-colors duration-200">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
