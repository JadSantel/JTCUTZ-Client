import { Calendar, Clock, Scissors, User, XCircle } from 'lucide-react';

const STATUS_STYLES = {
  upcoming: { dot: 'bg-green-400', text: 'text-green-400', label: 'Upcoming' },
  completed: { dot: 'bg-brand-muted', text: 'text-brand-muted', label: 'Completed' },
  cancelled: { dot: 'bg-red-500', text: 'text-red-400', label: 'Cancelled' },
};

const AppointmentCard = ({ appointment, onCancel, showUser = false }) => {
  const { _id, date, time, service, status, notes, userId } = appointment;
  const s = STATUS_STYLES[status] || STATUS_STYLES.upcoming;

  const formattedDate = new Date(date).toLocaleDateString('en-PH', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-brand-card border-2 border-brand-border hover:border-brand-muted transition-colors duration-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.dot}`} />
          <span className={`font-body text-xs tracking-widest uppercase ${s.text}`}>
            {s.label}
          </span>
        </div>
        {status === 'upcoming' && onCancel && (
          <button
            onClick={() => onCancel(_id)}
            className="flex items-center gap-1.5 font-body text-xs tracking-wide text-brand-muted hover:text-red-400 transition-colors duration-200"
          >
            <XCircle size={14} strokeWidth={1.5} />
            Cancel
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Scissors size={15} className="text-brand-orange flex-shrink-0" strokeWidth={1.5} />
        <span className="font-display text-xl text-brand-light tracking-wide">{service}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-brand-muted">
          <Calendar size={13} strokeWidth={1.5} />
          <span className="font-body text-xs tracking-wide">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-brand-muted">
          <Clock size={13} strokeWidth={1.5} />
          <span className="font-body text-xs tracking-wide">{time}</span>
        </div>
        {showUser && userId && (
          <div className="flex items-center gap-2 text-brand-muted">
            <User size={13} strokeWidth={1.5} />
            <span className="font-body text-xs tracking-wide">
              {userId.name} - {userId.email}
            </span>
          </div>
        )}
      </div>

      {notes && (
        <p className="mt-3 pt-3 border-t border-brand-border font-body text-xs text-brand-muted tracking-wide italic">
          &quot;{notes}&quot;
        </p>
      )}
    </div>
  );
};

export default AppointmentCard;
