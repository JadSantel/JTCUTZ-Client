import { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StyleSelector = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [faceShape, setFaceShape] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [products, setProducts] = useState('');

  const faceShapes = [
    { id: 'round', label: 'Round Face', icon: '◯' },
    { id: 'oval', label: 'Oval Face', icon: '⬭' },
    { id: 'square', label: 'Square Face', icon: '▢' },
    { id: 'heart', label: 'Heart Face', icon: '♡' },
    { id: 'oblong', label: 'Rectangle Face', icon: '▭' },
  ];

  const maintenanceLevels = [
    { id: 'low', label: 'Low Maintenance', desc: 'Minimal styling needed' },
    { id: 'medium', label: 'Medium Maintenance', desc: 'Some daily styling' },
    { id: 'high', label: 'High Maintenance', desc: 'Daily styling required' },
  ];

  const productUsage = [
    { id: 'none', label: 'No Products', desc: 'Natural look' },
    { id: 'light', label: 'Light Products', desc: 'Minimal grooming products' },
    { id: 'heavy', label: 'Heavy Products', desc: 'Lots of gel, pomade, etc.' },
  ];

  // Haircut recommendations based on answers
  const getRecommendation = () => {
    const recommendations = {
      round_low_none: { name: 'High Fade', desc: 'Creates vertical lines to elongate round face' },
      round_low_light: { name: 'Buzz Cut', desc: 'Clean and simple' },
      round_medium_light: { name: 'French Crop', desc: 'Textured and styled' },
      round_high_heavy: { name: 'Slick Back', desc: 'Defines the face shape' },
      oval_low_none: { name: 'Buzz Cut', desc: 'Flatters most face shapes' },
      oval_medium_light: { name: 'Curtains', desc: 'Versatile and stylish' },
      oval_high_heavy: { name: 'Modern Mullet', desc: 'Contemporary and bold' },
      square_low_light: { name: 'Low Fade', desc: 'Subtle and clean' },
      square_medium_light: { name: 'Mid Fade', desc: 'Balanced look' },
      square_high_heavy: { name: 'Slick Back', desc: 'Defines strong jawline' },
      heart_low_light: { name: 'Burst Fade', desc: 'Adds width at the back' },
      heart_medium_light: { name: 'French Crop', desc: 'Softens the top' },
      heart_high_heavy: { name: 'High Fade', desc: 'Bold and striking' },
      oblong_low_light: { name: 'Mid Taper', desc: 'Adds width' },
      oblong_medium_light: { name: 'Curtains', desc: 'Flatters length' },
      oblong_high_heavy: { name: 'High Taper', desc: 'Creates balance' },
    };

    const key = `${faceShape}_${maintenance}_${products}`;
    return recommendations[key] || { name: 'Slick Back', desc: 'Always a classic choice' };
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    const recommendation = getRecommendation();
    navigate('/dashboard/book', { state: { recommendedStyle: recommendation.name } });
    onClose();
  };

  const handleReset = () => {
    setStep(1);
    setFaceShape('');
    setMaintenance('');
    setProducts('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-brand-dark border-2 border-brand-border max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-border sticky top-0 bg-brand-dark">
          <h2 className="font-display text-2xl text-brand-light tracking-widest2">
            FIND YOUR STYLE
          </h2>
          <button
            onClick={() => {
              onClose();
              handleReset();
            }}
            className="p-1 hover:bg-brand-border rounded transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-brand-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-brand-orange' : 'bg-brand-border'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Face Shape */}
          {step === 1 && (
            <div>
              <h3 className="font-display text-2xl text-brand-light mb-6 tracking-widest">
                What's your face shape?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {faceShapes.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setFaceShape(shape.id)}
                    className={`p-4 border-2 rounded transition-all text-left ${
                      faceShape === shape.id
                        ? 'border-brand-orange bg-brand-orange/10'
                        : 'border-brand-border hover:border-brand-orange/50'
                    }`}
                  >
                    <div className="text-2xl mb-2">{shape.icon}</div>
                    <p className="font-body font-semibold text-brand-light text-sm">
                      {shape.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Maintenance */}
          {step === 2 && (
            <div>
              <h3 className="font-display text-2xl text-brand-light mb-6 tracking-widest">
                How much maintenance?
              </h3>
              <div className="space-y-3">
                {maintenanceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => setMaintenance(level.id)}
                    className={`w-full p-4 border-2 rounded transition-all text-left ${
                      maintenance === level.id
                        ? 'border-brand-orange bg-brand-orange/10'
                        : 'border-brand-border hover:border-brand-orange/50'
                    }`}
                  >
                    <p className="font-body font-semibold text-brand-light mb-1">
                      {level.label}
                    </p>
                    <p className="font-body text-xs text-brand-muted">{level.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Products */}
          {step === 3 && (
            <div>
              <h3 className="font-display text-2xl text-brand-light mb-6 tracking-widest">
                Product preference?
              </h3>
              <div className="space-y-3 mb-8">
                {productUsage.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setProducts(product.id)}
                    className={`w-full p-4 border-2 rounded transition-all text-left ${
                      products === product.id
                        ? 'border-brand-orange bg-brand-orange/10'
                        : 'border-brand-border hover:border-brand-orange/50'
                    }`}
                  >
                    <p className="font-body font-semibold text-brand-light mb-1">
                      {product.label}
                    </p>
                    <p className="font-body text-xs text-brand-muted">{product.desc}</p>
                  </button>
                ))}
              </div>

              {/* Recommendation preview */}
              {products && (
                <div className="bg-brand-orange/10 border-2 border-brand-orange p-4 rounded mb-6">
                  <p className="font-body text-xs text-brand-orange tracking-widest uppercase mb-2">
                    Your recommendation
                  </p>
                  <h4 className="font-display text-xl text-brand-light tracking-widest">
                    {getRecommendation().name}
                  </h4>
                  <p className="font-body text-sm text-brand-light/70 mt-2">
                    {getRecommendation().desc}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="btn-secondary flex-1"
              >
                BACK
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (step === 1 && !faceShape) ||
                  (step === 2 && !maintenance)
                }
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                NEXT
                <ChevronRight size={18} strokeWidth={2} />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!products}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                BOOK NOW
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;
