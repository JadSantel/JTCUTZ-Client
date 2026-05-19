const StatCard = ({ label, value, icon: Icon, accent = false }) => (
  <div className={`bg-brand-card border-2 p-6 flex items-center gap-5 transition-colors duration-200
    ${accent ? 'border-brand-orange' : 'border-brand-border hover:border-brand-muted'}`}>
    <div className={`p-3 ${accent ? 'bg-brand-orange/10' : 'bg-brand-border/40'}`}>
      <Icon
        size={22}
        strokeWidth={1.5}
        className={accent ? 'text-brand-orange' : 'text-brand-muted'}
      />
    </div>
    <div>
      <p className="font-body text-xs text-brand-muted tracking-widest uppercase mb-1">{label}</p>
      <p className="font-display text-3xl text-brand-light tracking-wide leading-none">{value}</p>
    </div>
  </div>
);

export default StatCard;
