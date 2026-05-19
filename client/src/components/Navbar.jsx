import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Scissors, LogOut, LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';
import useAuth from '../context/useAuth';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`font-body text-xs tracking-widest uppercase transition-colors duration-200
        ${isActive(to)
          ? 'text-brand-orange'
          : 'text-brand-muted hover:text-brand-light'}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/95 backdrop-blur-sm
                    border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to={user ? (isAdmin ? '/admin' : '/dashboard') : '/'}
              className="flex items-center gap-2.5 group">
          <Scissors
            size={20}
            className="text-brand-orange group-hover:rotate-12 transition-transform duration-300"
            strokeWidth={1.5}
          />
          <span className="font-display text-2xl text-brand-light tracking-widest">
            JT CUTZ
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {isAdmin ? (
            <>
              {navLink('/admin', 'Admin Panel')}
              {navLink('/admin/appointments', 'All Appointments')}
            </>
          ) : (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/dashboard/book', 'Book Appointment')}
            </>
          )}
        </div>

        {/* Desktop right side */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2">
            {isAdmin
              ? <ShieldCheck size={14} className="text-brand-orange" strokeWidth={1.5} />
              : <LayoutDashboard size={14} className="text-brand-muted" strokeWidth={1.5} />
            }
            <span className="font-body text-xs text-brand-muted tracking-wide">
              {user?.name}
            </span>
          </div>
          <div className="w-px h-4 bg-brand-border" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 font-body text-xs tracking-widest uppercase
                       text-brand-muted hover:text-brand-orange transition-colors duration-200"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Logout
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-brand-muted hover:text-brand-light transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-brand-card border-t border-brand-border px-6 py-6
                        flex flex-col gap-5">
          {isAdmin ? (
            <>
              {navLink('/admin', 'Admin Panel')}
              {navLink('/admin/appointments', 'All Appointments')}
            </>
          ) : (
            <>
              {navLink('/dashboard', 'Dashboard')}
              {navLink('/dashboard/book', 'Book Appointment')}
            </>
          )}
          <div className="h-px bg-brand-border" />
          <div className="flex items-center justify-between">
            <span className="font-body text-xs text-brand-muted tracking-wide">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-body text-xs tracking-widest uppercase
                         text-brand-muted hover:text-brand-orange transition-colors duration-200"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
