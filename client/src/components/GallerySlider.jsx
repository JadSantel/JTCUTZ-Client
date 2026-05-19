import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';

const GallerySlider = () => {
  const [gallery, setGallery] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get('/gallery');
        if (data.success) setGallery(data.gallery);
      } catch {
        setError('Failed to load gallery');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  useEffect(() => {
    if (gallery.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % gallery.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [gallery.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % gallery.length);
  };

  const handleDotClick = (idx) => {
    setCurrent(idx);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.clientX;
    const diff = dragStart - dragEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const dragEnd = e.changedTouches[0].clientX;
    const diff = dragStart - dragEnd;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-brand-card border-2 border-brand-border flex items-center justify-center">
        <p className="font-body text-brand-muted text-sm tracking-wide animate-pulse">
          Loading gallery...
        </p>
      </div>
    );
  }

  if (error || gallery.length === 0) {
    return (
      <div className="w-full h-96 bg-brand-card border-2 border-brand-border flex items-center justify-center">
        <p className="font-body text-brand-muted text-sm tracking-wide">
          {error || 'No gallery images available'}
        </p>
      </div>
    );
  }

  const slide = gallery[current];

  return (
    <div className="w-full">
      {/* Slider container */}
      <div
        className="relative w-full h-96 md:h-[500px] bg-brand-card border-2 border-brand-border overflow-hidden group cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image */}
        <img
          src={slide.image}
          alt={slide.name}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />

        {/* Overlay with text */}
        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-6 md:p-8">
          <h3 className="font-display text-3xl md:text-4xl text-brand-light tracking-widest2 mb-2">
            {slide.name}
          </h3>
          <p className="font-body text-sm md:text-base text-brand-light/80 tracking-wide">
            {slide.description}
          </p>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                     bg-brand-orange/80 hover:bg-brand-orange text-brand-dark
                     transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                     bg-brand-orange/80 hover:bg-brand-orange text-brand-dark
                     transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>

        {/* Slide counter */}
        <div className="absolute top-4 right-4 bg-brand-dark/70 px-3 py-1 rounded-full">
          <p className="font-body text-xs text-brand-light tracking-widest">
            {current + 1} / {gallery.length}
          </p>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {gallery.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? 'bg-brand-orange w-8'
                : 'bg-brand-muted w-2 hover:bg-brand-muted/60'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default GallerySlider;
