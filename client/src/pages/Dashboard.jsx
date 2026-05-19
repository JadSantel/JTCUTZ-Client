import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, CalendarCheck, CalendarX, Clock, Scissors } from 'lucide-react';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import AppointmentCard from '../components/AppointmentCard';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [cancelMsg, setCancelMsg]       = useState('');

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments/my');
      if (data.success) setAppointments(data.appointments);
    } catch {
      setError('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      const { data } = await api.patch(`/appointments/${id}/cancel`);
      if (data.success) {
        setCancelMsg('Appointment cancelled successfully.');
        fetchAppointments();
        setTimeout(() => setCancelMsg(''), 3000);
      }
    } catch {
      setError('Could not cancel. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const upcoming  = appointments.filter((a) => a.status === 'upcoming');
  const past      = appointments.filter((a) => a.status !== 'upcoming');
  const cancelled = appointments.filter((a) => a.status === 'cancelled');

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* Page header */}
        <div className="mb-10">
          <p className="font-body text-brand-muted text-xs tracking-widest uppercase mb-2">
            Welcome back
          </p>
          <h1 className="font-display text-6xl md:text-7xl text-brand-light tracking-widest2">
            {user?.name?.toUpperCase()}
          </h1>
          <div className="w-12 h-0.5 bg-brand-orange mt-4" />
        </div>

        {/* Toast messages */}
        {cancelMsg && (
          <div className="mb-6 px-4 py-3 bg-green-900/30 border border-green-700
                          text-green-300 font-body text-sm tracking-wide">
            {cancelMsg}
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
          <StatCard label="Completed"      value={past.filter(a => a.status === 'completed').length} icon={CalendarCheck} />
          <StatCard label="Cancelled"      value={cancelled.length}    icon={CalendarX} />
        </div>

        {/* Book CTA */}
        <div className="bg-brand-card border-2 border-brand-border hover:border-brand-orange
                        transition-colors duration-300 p-8 mb-12 flex flex-col md:flex-row
                        items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Scissors size={16} className="text-brand-orange" strokeWidth={1.5} />
              <span className="font-body text-xs tracking-widest uppercase text-brand-orange">
                Ready for a fresh cut?
              </span>
            </div>
            <p className="font-display text-3xl text-brand-light tracking-wide">
              BOOK AN APPOINTMENT
            </p>
          </div>
          <Link to="/dashboard/book" className="btn-primary whitespace-nowrap">
            BOOK NOW
          </Link>
        </div>

        {/* Upcoming appointments */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-brand-light tracking-widest2">
              UPCOMING
            </h2>
            <span className="font-body text-xs text-brand-muted tracking-widest uppercase">
              {upcoming.length} appointment{upcoming.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <p className="font-body text-brand-muted text-sm tracking-wide animate-pulse">
              Loading...
            </p>
          ) : upcoming.length === 0 ? (
            <div className="border-2 border-dashed border-brand-border p-10 text-center">
              <CalendarPlus size={32} className="text-brand-muted mx-auto mb-3" strokeWidth={1} />
              <p className="font-body text-brand-muted text-sm tracking-wide">
                No upcoming appointments.{' '}
                <Link to="/dashboard/book" className="text-brand-orange hover:underline">
                  Book one now.
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcoming.map((a) => (
                <AppointmentCard key={a._id} appointment={a} onCancel={handleCancel} />
              ))}
            </div>
          )}
        </section>

        {/* Past appointments */}
        {past.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl text-brand-light tracking-widest2">
                HISTORY
              </h2>
              <span className="font-body text-xs text-brand-muted tracking-widest uppercase">
                {past.length} appointment{past.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {past.map((a) => (
                <AppointmentCard key={a._id} appointment={a} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
