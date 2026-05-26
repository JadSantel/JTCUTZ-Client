import { useEffect, useState } from 'react';
import {
  Users, CalendarCheck, CalendarX, Clock,
  Search, Filter, ShieldCheck,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import AppointmentCard from '../components/AppointmentCard';
import api from '../api/axios';

const FILTERS = ['all', 'upcoming', 'completed', 'cancelled'];

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [successMsg, setSuccessMsg]     = useState('');
  const [filter, setFilter]             = useState('all');
  const [search, setSearch]             = useState('');

  const fetchAll = async () => {
    try {
      const { data } = await api.get('/appointments/all');
      if (data.success) setAppointments(data.appointments);
    } catch {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAll();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment on behalf of the client?')) return;
    try {
      const { data } = await api.patch(`/appointments/${id}/cancel`);
      if (data.success) {
        setSuccessMsg('Appointment cancelled.');
        fetchAll();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setError('Could not cancel. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleComplete = async (id) => {
    if (!confirm('Mark this appointment as completed?')) return;
    try {
      const { data } = await api.patch(`/appointments/${id}/complete`);
      if (data.success) {
        setSuccessMsg('Appointment marked completed.');
        fetchAll();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch {
      setError('Could not mark completed. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  // Apply filter + search
  const filtered = appointments
    .filter((a) => filter === 'all' || a.status === filter)
    .filter((a) => {
      const q = search.toLowerCase();
      if (!q) return true;
      return (
        a.service?.toLowerCase().includes(q) ||
        a.userId?.name?.toLowerCase().includes(q) ||
        a.userId?.email?.toLowerCase().includes(q)
      );
    });

  const upcoming  = appointments.filter((a) => a.status === 'upcoming');
  const completed = appointments.filter((a) => a.status === 'completed');
  // Unique client count
  const uniqueClients = new Set(appointments.map((a) => a.userId?._id)).size;

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={14} className="text-brand-orange" strokeWidth={1.5} />
            <p className="font-body text-brand-muted text-xs tracking-widest uppercase">
              Admin Panel
            </p>
          </div>
          <h1 className="font-display text-6xl md:text-7xl text-brand-light tracking-widest2">
            ALL BOOKINGS
          </h1>
          <div className="w-12 h-0.5 bg-brand-orange mt-4" />
        </div>

        {/* Toast messages */}
        {successMsg && (
          <div className="mb-6 px-4 py-3 bg-green-900/30 border border-green-700
                          text-green-300 font-body text-sm tracking-wide">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700
                          text-red-300 font-body text-sm tracking-wide">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard label="Total Bookings" value={appointments.length} icon={CalendarCheck} />
          <StatCard label="Upcoming"       value={upcoming.length}     icon={Clock}          accent />
          <StatCard label="Completed"      value={completed.length}    icon={CalendarCheck} />
          <StatCard label="Unique Clients" value={uniqueClients}       icon={Users} />
        </div>

        {/* Filter + Search bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Search by client name, email, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-base pl-11 text-sm"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-brand-muted flex-shrink-0" strokeWidth={1.5} />
            <div className="flex gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`font-body text-xs tracking-widest uppercase px-4 py-2.5
                              border-2 transition-colors duration-200
                    ${filter === f
                      ? 'border-brand-orange text-brand-orange bg-brand-orange/10'
                      : 'border-brand-border text-brand-muted hover:border-brand-muted'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-3xl text-brand-light tracking-widest2">
            {filter === 'all' ? 'ALL APPOINTMENTS' : filter.toUpperCase()}
          </h2>
          <span className="font-body text-xs text-brand-muted tracking-widest uppercase">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Appointments grid */}
        {loading ? (
          <p className="font-body text-brand-muted text-sm tracking-wide animate-pulse">
            Loading all appointments...
          </p>
        ) : filtered.length === 0 ? (
          <div className="border-2 border-dashed border-brand-border p-12 text-center">
            <CalendarX size={32} className="text-brand-muted mx-auto mb-3" strokeWidth={1} />
            <p className="font-body text-brand-muted text-sm tracking-wide">
              No appointments found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <AppointmentCard
                key={a._id}
                appointment={a}
                onCancel={handleCancel}
                onComplete={handleComplete}
                showUser
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
