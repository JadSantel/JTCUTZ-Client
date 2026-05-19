import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Scissors, Mail, NotepadText, UserCheck, Images, } from 'lucide-react';
import useAuth from '../context/useAuth';
import Navbar from '../components/Navbar';
import GallerySlider from '../components/GallerySlider';
import StyleSelector from '../components/StyleSelector';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [styleModalOpen, setStyleModalOpen] = useState(false);

  const handleStyleClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setStyleModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark">
      <Navbar />

      <main>
        {/* Hero section */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 md:pb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Scissors size={16} className="text-brand-orange" strokeWidth={1.5} />
                <span className="font-body text-xs tracking-widest uppercase text-brand-orange">
                  Welcome to
                </span>
              </div>
              <h1 className="font-display text-7xl md:text-8xl text-brand-light tracking-widest2 mb-6">
                JT CUTZ
              </h1>
              <p className="font-body text-lg text-brand-light/70 tracking-wide mb-8 leading-relaxed">
                Professional barbershop experience tailored to your style. Book your appointment
                today and discover your perfect cut.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <>
                    <Link to="/dashboard/book" className="btn-primary flex items-center justify-center gap-2">
                      BOOK NOW
                      <ArrowRight size={18} strokeWidth={2} />
                    </Link>
                    <button
                      onClick={handleStyleClick}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      FIND YOUR STYLE
                      <Sparkles size={18} strokeWidth={2} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary flex items-center justify-center gap-2">
                      GET STARTED
                      <ArrowRight size={18} strokeWidth={2} />
                    </Link>
                    <button
                      onClick={handleStyleClick}
                      className="btn-secondary flex items-center justify-center gap-2"
                    >
                      FIND YOUR STYLE
                      <Sparkles size={18} strokeWidth={2} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-brand-card border-2 border-brand-border p-8 rounded-lg">
                <div className="text-4xl font-bold text-brand-orange mb-2">13+</div>
                <p className="font-body text-sm text-brand-muted tracking-wide">
                  Haircut Styles
                </p>
              </div>
              <div className="bg-brand-card border-2 border-brand-border p-8 rounded-lg">
                <div className="text-4xl font-bold text-brand-orange mb-2">100%</div>
                <p className="font-body text-sm text-brand-muted tracking-wide">
                  Satisfaction
                </p>
              </div>
              <div className="bg-brand-card border-2 border-brand-border p-8 rounded-lg">
                <div className="text-4xl font-bold text-brand-orange mb-2">Pro</div>
                <p className="font-body text-sm text-brand-muted tracking-wide">
                  Barber
                </p>
              </div>
              <div className="bg-brand-card border-2 border-brand-border p-8 rounded-lg">
                <div className="text-4xl font-bold text-brand-orange mb-2">24/7</div>
                <p className="font-body text-sm text-brand-muted tracking-wide">
                  Booking
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery section */}
        <section className="bg-brand-card/50 border-t-2 border-b-2 border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                <Images size={14} className="text-brand-orange" strokeWidth={1.5} />
                <p className="font-body text-brand-muted text-xs tracking-widest uppercase">
                  Style Gallery
                </p>
              </div>
              <h2 className="font-display text-6xl md:text-7xl text-brand-light tracking-widest2 mb-4">
                OUR COLLECTION
              </h2>
              <p className="font-body text-brand-light/70 tracking-wide max-w-2xl">
                Browse through our wide selection of professional haircut styles. Swipe, tap, or
                use the arrows to explore.
              </p>
            </div>
            <GallerySlider />
          </div>
        </section>

        {/* Style Selector CTA */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="bg-brand-card border-2 border-brand-border p-12 md:p-16">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles size={16} className="text-brand-orange" strokeWidth={1.5} />
                <span className="font-body text-xs tracking-widest uppercase text-brand-orange">
                  Need help deciding?
                </span>
              </div>
              <h3 className="font-display text-5xl md:text-6xl text-brand-light tracking-widest2 mb-4">
                TAKE THE QUIZ
              </h3>
              <p className="font-body text-lg text-brand-light/70 tracking-wide mb-8">
                Answer 3 simple questions about your face shape, maintenance preference, and product
                use. Our AI-powered tool will recommend the perfect style for you.
              </p>
              <button
                onClick={handleStyleClick}
                className="btn-primary flex items-center gap-2 hover:gap-3 transition-all"
              >
                DISCOVER YOUR STYLE
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="bg-brand-card/50 border-t-2 border-brand-border py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-5xl md:text-6xl text-brand-light tracking-widest2 mb-12">
              WHY BOOK WITH US?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-brand-dark border-2 border-brand-border p-8 rounded-lg">
                <UserCheck size={40} className="text-brand-orange" strokeWidth={1.5} />
                <h4 className="font-display text-xl text-brand-light mb-3 tracking-wide">
                  Professional Quality
                </h4>
                <p className="font-body text-sm text-brand-light/70 tracking-wide">
                  Expert barber with years of experience delivering premium cuts.
                </p>
              </div>
              <div className="bg-brand-dark border-2 border-brand-border p-8 rounded-lg">
                <Mail size={40} className="text-brand-orange" strokeWidth={1.5} />
                <h4 className="font-display text-xl text-brand-light mb-3 tracking-wide">
                  Email Confirmations
                </h4>
                <p className="font-body text-sm text-brand-light/70 tracking-wide">
                  Get instant booking and cancellation confirmations via email.
                </p>
              </div>
              <div className="bg-brand-dark border-2 border-brand-border p-8 rounded-lg">
                <NotepadText size={40} className="text-brand-orange" strokeWidth={1.5} />
                <h4 className="font-display text-xl text-brand-light mb-3 tracking-wide">
                  Style Recommendations
                </h4>
                <p className="font-body text-sm text-brand-light/70 tracking-wide">
                  Our interactive quiz helps you find the perfect cut for your look.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Style Selector Modal */}
      <StyleSelector isOpen={styleModalOpen} onClose={() => setStyleModalOpen(false)} />
    </div>
  );
};

export default Home;
