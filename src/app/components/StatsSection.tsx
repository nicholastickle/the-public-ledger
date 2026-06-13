const STATS = [
  { label: 'TOTAL VOLUME', value: '$2.4B+', sublabel: 'traded across all markets' },
  { label: 'ACTIVE MARKETS', value: '1,200+', sublabel: 'open for trading now' },
  { label: 'TOTAL TRADERS', value: '485K+', sublabel: 'worldwide participants' },
];

export default function StatsSection() {
  return (
    <section className="bg-primary py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-caption-mono font-mono uppercase tracking-widest mb-xs"
                style={{ color: 'rgba(255,255,255,0.45)' }}>
                {stat.label}
              </div>
              <div className="text-display-xl font-semibold text-on-primary mb-xxs">
                {stat.value}
              </div>
              <div className="text-body-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
