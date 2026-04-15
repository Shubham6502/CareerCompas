const STATS = [
  { value: '100+',  label: 'Active Learners' },
  { value: '50+',  label: 'Roadmaps Created' },
  { value: '92%',   label: 'Goal Completion' },
  { value: '30–90', label: 'Day Programs' },
];

export default function Stats() {
  return (
    <section className="bg-color  py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <div
              className="text-2xl sm:text-3xl font-bold text-color mb-1"
              style={{ fontFamily: 'var(--font-head)' }}
            >
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm subText-color">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}