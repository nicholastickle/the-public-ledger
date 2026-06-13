const STATS = [
  { label: 'VOTES CAST', value: '2.4M+', sublabel: 'across all active bills' },
  { label: 'ACTIVE BILLS', value: '48', sublabel: 'currently before parliament' },
  { label: 'MPs TRACKED', value: '650', sublabel: 'voting records monitored' },
];

export default function StatsSection() {
  return (
    <section className="bg-primary py-3xl md:py-5xl">
      <div className="max-w-[1400px] mx-auto px-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2xl md:gap-4xl">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-caption-mono font-mono uppercase tracking-widest mb-xs"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
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
