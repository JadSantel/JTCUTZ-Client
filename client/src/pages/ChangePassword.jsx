import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Lock, ShieldCheck } from 'lucide-react';
import Navbar from '../components/Navbar';
import useAuth from '../context/useAuth';

const ChangePassword = () => {
  const { isAdmin, changePassword } = useAuth();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword.length < 6) {
      return setError('New password must be at least 6 characters.');
    }

    if (form.newPassword !== form.confirmPassword) {
      return setError('New passwords do not match.');
    }

    if (form.currentPassword === form.newPassword) {
      return setError('New password must be different from current password.');
    }

    setLoading(true);
    try {
      const data = await changePassword(form.currentPassword, form.newPassword);
      if (data.success) {
        setSuccess(data.message || 'Password changed successfully.');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <div className="mb-10">
          <p className="font-body text-brand-muted text-xs tracking-widest uppercase mb-2">
            Account security
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-brand-light tracking-widest2">
            CHANGE PASSWORD
          </h1>
          <div className="w-12 h-0.5 bg-brand-orange mt-4" />
        </div>

        <div className="bg-brand-card border-2 border-brand-border p-6 md:p-8">
          <div className="flex items-start gap-4 mb-8">
            <div className="shrink-0 w-11 h-11 border-2 border-brand-border flex items-center justify-center">
              <ShieldCheck size={22} className="text-brand-orange" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-display text-3xl text-brand-light tracking-widest">
                PASSWORD
              </h2>
              <p className="font-body text-sm text-brand-muted tracking-wide mt-1">
                Enter your current password before setting a new one.
              </p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 mb-6 text-sm font-body">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 mb-6 text-sm font-body">
              <CheckCircle size={16} className="shrink-0" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                Current Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="password"
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={handleChange}
                  placeholder="Current password"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-brand-muted font-body text-xs tracking-widest uppercase mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                  className="input-base pl-11"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
              <Link to={isAdmin ? '/admin' : '/dashboard'} className="btn-ghost text-center">
                CANCEL
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePassword;
