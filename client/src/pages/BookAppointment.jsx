import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Scissors, Calendar, Clock, FileText,
  ChevronLeft, CheckCircle, AlertCircle, Sparkles,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/axios';

// ── Services ──────────────────────────────────────────────────────────────
const SERVICES = [
  { name: 'Regular Haircut',   duration: '30 min', price: '₱150' },
  { name: 'High Fade',         duration: '45 min', price: '₱200' },
  { name: 'Low Fade',          duration: '45 min', price: '₱180' },
  { name: 'Skin Fade',         duration: '45 min', price: '₱220' },
  { name: 'Pompadour',         duration: '60 min', price: '₱250' },
  { name: 'Undercut',          duration: '50 min', price: '₱230' },
  { name: 'Buzz Cut',          duration: '20 min', price: '₱120' },
  { name: 'Line Up / Edge Up', duration: '20 min', price: '₱100' },
  { name: 'Beard Trim',        duration: '20 min', price: '₱100' },
  { name: 'Haircut + Beard',   duration: '60 min', price: '₱280' },
];

// ── Time slots ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  '9:00 AM',  '9:30 AM',  '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM',  '1:30 PM',
  '2:00 PM',  '2:30 PM',  '3:00 PM',  '3:30 PM',
  '4:00 PM',  '4:30 PM',  '5:00 PM',
];

const todayISO  = () => new Date().toISOString().split('T')[0];
const maxDateISO = () => {
  const d = new Date();
  d.setDate(d.getDate() + 60);
  return d.toISOString().split('T')[0];
};

// ─────────────────────────────────────────────────────────────────────────────
const BookAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const recommendedStyle = location.state?.recommendedStyle;

  const [step,         setStep]         = useState(1);
  const [service,      setService]      = useState(recommendedStyle || '');
  const [date,         setDate]         = useState('');
  const [time,         setTime]         = useState('');
  const [notes,        setNotes]        = useState('');
  const [takenSlots,   setTakenSlots]   = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState(false);

  const selectedService = SERVICES.find((s) => s.name === service);

  // ── Fetch taken slots for chosen date ────────────────────────────────────
  const handleDateChange = async (selectedDate) => {
    setDate(selectedDate);
    setTime('');
    if (!selectedDate) return;
    setLoadingSlots(true);
    try {
      const { data } = await api.get(`/appointments/slots?date=${selectedDate}`);
      setTakenSlots(data.takenSlots || []);
    } catch {
      setTakenSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // ── Submit booking ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!service || !date || !time) {
      setError('Please complete all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/appointments', { service, date, time, notes });
      if (data.success) setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Step indicator ────────────────────────────────────────────────────────
  const STEP_LABELS = ['Choose Service', 'Date & Time', 'Confirm'];
  const StepIndicator = () => (
    <div className="flex items-center mb-10">
      {[1, 2, 3].map((s, i) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 flex items-center justify-center border-2
                           transition-all duration-300
            ${step === s ? 'border-brand-orange bg-brand-orange text-brand-dark'
              : step > s  ? 'border-green-500 bg-green-500/10 text-green-400'
                          : 'border-brand-border text-brand-muted'}`}>
            {step > s
              ? <CheckCircle size={14} strokeWidth={2} />
              : <span className="font-display text-sm">{s}</span>}
          </div>
          {i < 2 && (
            <div className={`h-0.5 w-12 md:w-20 transition-all duration-300
              ${step > s ? 'bg-green-500' : 'bg-brand-border'}`} />
          )}
        </div>
      ))}
      <span className="ml-4 font-body text-xs text-brand-muted tracking-widest uppercase">
        {STEP_LABELS[step - 1]}
      </span>
    </div>
  );

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-brand-dark">
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500
                            flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-400" strokeWidth={1.5} />
            </div>
            <h1 className="font-display text-5xl text-brand-light tracking-widest2 mb-3">
              BOOKED!
            </h1>
            <div className="w-12 h-0.5 bg-brand-orange mx-auto mb-6" />
            <p className="font-body text-brand-muted text-sm tracking-wide mb-2">
              Your appointment has been confirmed.
            </p>
            <p className="font-body text-brand-muted text-xs tracking-wide mb-8">
              A confirmation email has been sent to your inbox.
            </p>

            <div className="bg-brand-card border-2 border-brand-border p-6 text-left mb-8 space-y-3">
              <div className="flex items-center gap-2">
                <Scissors size={14} className="text-brand-orange" strokeWidth={1.5} />
                <span className="font-body text-sm text-brand-light">{service}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-brand-muted" strokeWidth={1.5} />
                <span className="font-body text-sm text-brand-muted">
                  {new Date(date + 'T00:00:00').toLocaleDateString('en-PH', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-brand-muted" strokeWidth={1.5} />
                <span className="font-body text-sm text-brand-muted">{time}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">
                VIEW DASHBOARD
              </button>
              <button
                onClick={() => {
                  setSuccess(false); setStep(1); setService(recommendedStyle || '');
                  setDate(''); setTime(''); setNotes('');
                }}
                className="btn-ghost flex-1"
              >
                BOOK ANOTHER
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')}
            className="text-brand-muted hover:text-brand-orange transition-colors duration-200"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-brand-light tracking-widest2">
              BOOK APPOINTMENT
            </h1>
            <div className="w-10 h-0.5 bg-brand-orange mt-2" />
          </div>
        </div>

        <StepIndicator />

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-900/30 border border-red-700
                          text-red-300 px-4 py-3 mb-6 text-sm font-body">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {/* Recommendation badge */}
        {recommendedStyle && service === recommendedStyle && (
          <div className="flex items-center gap-2 bg-brand-orange/10 border border-brand-orange px-4 py-3 mb-6 text-sm font-body">
            <Sparkles size={16} className="text-brand-orange shrink-0" />
            <span className="text-brand-orange">
              Based on your quiz, we recommended: <strong>{recommendedStyle}</strong>
            </span>
          </div>
        )}

        {/* ── STEP 1: Choose Service ──────────────────────────────────── */}
        {step === 1 && (
          <div>
            <p className="font-body text-brand-muted text-sm tracking-wide mb-6">
              Select the service you'd like to book.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SERVICES.map((svc) => (
                <button
                  key={svc.name}
                  onClick={() => setService(svc.name)}
                  className={`text-left p-5 border-2 transition-all duration-200
                    ${service === svc.name
                      ? 'border-brand-orange bg-brand-orange/5'
                      : 'border-brand-border bg-brand-card hover:border-brand-muted'}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-display text-xl text-brand-light tracking-wide">
                      {svc.name}
                    </span>
                    {service === svc.name && (
                      <CheckCircle size={16} className="text-brand-orange shrink-0 mt-0.5"
                                   strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-body text-xs text-brand-muted">{svc.duration}</span>
                    <span className="w-1 h-1 rounded-full bg-brand-border" />
                    <span className="font-body text-xs text-brand-orange">{svc.price}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setStep(2)} disabled={!service} className="btn-primary">
                NEXT: PICK DATE & TIME
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Date & Time ─────────────────────────────────────── */}
        {step === 2 && (
          <div>
            <p className="font-body text-brand-muted text-sm tracking-wide mb-6">
              Choose a date and available time slot.
            </p>

            {/* Date */}
            <div className="mb-8">
              <label className="block font-body text-xs tracking-widest uppercase
                                text-brand-muted mb-3">
                Select Date
              </label>
              <div className="relative max-w-xs">
                <Calendar size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none"
                  strokeWidth={1.5} />
                <input
                  type="date"
                  value={date}
                  min={todayISO()}
                  max={maxDateISO()}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="input-base pl-11 max-w-xs"
                  required
                />
              </div>
            </div>

            {/* Time slots */}
            {date && (
              <div className="mb-8">
                <label className="block font-body text-xs tracking-widest uppercase
                                  text-brand-muted mb-3">
                  Select Time
                  {loadingSlots && (
                    <span className="ml-3 text-brand-orange animate-pulse normal-case">
                      Checking availability...
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const taken = takenSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        onClick={() => !taken && setTime(slot)}
                        disabled={taken}
                        className={`py-2.5 px-3 border-2 font-body text-xs tracking-wide
                                    transition-all duration-200
                          ${taken
                            ? 'border-brand-border text-brand-border cursor-not-allowed line-through'
                            : time === slot
                            ? 'border-brand-orange bg-brand-orange/10 text-brand-orange'
                            : 'border-brand-border text-brand-muted hover:border-brand-muted'}`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                <p className="font-body text-xs text-brand-muted mt-3 tracking-wide">
                  Strikethrough slots are already booked.
                </p>
              </div>
            )}

            {/* Notes */}
            {time && (
              <div className="mb-8">
                <label className="block font-body text-xs tracking-widest uppercase
                                  text-brand-muted mb-3">
                  Notes <span className="text-brand-muted/50 normal-case">(optional)</span>
                </label>
                <div className="relative">
                  <FileText size={16}
                    className="absolute left-4 top-4 text-brand-muted pointer-events-none"
                    strokeWidth={1.5} />
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special requests or notes for your barber..."
                    rows={3}
                    maxLength={500}
                    className="input-base pl-11 resize-none"
                  />
                  <p className="font-body text-xs text-brand-muted mt-2">
                    {notes.length}/500 characters
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-ghost">BACK</button>
              <button onClick={() => setStep(3)} disabled={!date || !time} className="btn-primary">
                NEXT: CONFIRM
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Confirm ─────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <p className="font-body text-brand-muted text-sm tracking-wide mb-6">
              Review your appointment details before confirming.
            </p>

            <div className="bg-brand-card border-2 border-brand-border p-8 mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Scissors size={16} className="text-brand-orange" strokeWidth={1.5} />
                <span className="font-body text-xs tracking-widest uppercase text-brand-orange">
                  Appointment Summary
                </span>
              </div>
              <div className="space-y-5">
                {/* Service + price */}
                <div className="flex items-start justify-between pb-4 border-b border-brand-border">
                  <div>
                    <p className="font-body text-xs text-brand-muted tracking-widest uppercase mb-1">
                      Service
                    </p>
                    <p className="font-display text-3xl text-brand-light tracking-wide">{service}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-xs text-brand-muted tracking-widest uppercase mb-1">
                      Price
                    </p>
                    <p className="font-display text-3xl text-brand-orange tracking-wide">
                      {selectedService?.price}
                    </p>
                  </div>
                </div>
                {/* Date */}
                <div className="flex items-center gap-3">
                  <Calendar size={15} className="text-brand-muted" strokeWidth={1.5} />
                  <div>
                    <p className="font-body text-xs text-brand-muted tracking-wide">Date</p>
                    <p className="font-body text-sm text-brand-light">
                      {new Date(date + 'T00:00:00').toLocaleDateString('en-PH', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                {/* Time */}
                <div className="flex items-center gap-3">
                  <Clock size={15} className="text-brand-muted" strokeWidth={1.5} />
                  <div>
                    <p className="font-body text-xs text-brand-muted tracking-wide">Time</p>
                    <p className="font-body text-sm text-brand-light">{time}</p>
                  </div>
                </div>
                {/* Duration */}
                <div className="flex items-center gap-3">
                  <Scissors size={15} className="text-brand-muted" strokeWidth={1.5} />
                  <div>
                    <p className="font-body text-xs text-brand-muted tracking-wide">Duration</p>
                    <p className="font-body text-sm text-brand-light">{selectedService?.duration}</p>
                  </div>
                </div>
                {/* Notes */}
                {notes && (
                  <div className="flex items-start gap-3 pt-4 border-t border-brand-border">
                    <FileText size={15} className="text-brand-muted mt-0.5" strokeWidth={1.5} />
                    <div>
                      <p className="font-body text-xs text-brand-muted tracking-wide">Notes</p>
                      <p className="font-body text-sm text-brand-muted italic">"{notes}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border px-5 py-3 mb-8
                            flex items-center gap-3">
              <CheckCircle size={14} className="text-green-400 shrink-0" strokeWidth={1.5} />
              <p className="font-body text-xs text-brand-muted tracking-wide">
                A confirmation email will be sent to your inbox after booking.
              </p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-ghost">BACK</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? 'CONFIRMING...' : 'CONFIRM BOOKING'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BookAppointment;
