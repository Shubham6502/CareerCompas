import { Map, CalendarDays, BarChart2, Users } from 'lucide-react';

const FEATURES = [
  {
    icon: Map,
    title: 'Personalized Roadmaps',
    desc: 'AI-powered career paths tailored to your goals — FAANG, Startups, or Government Tech roles.',
  },
  {
    icon: CalendarDays,
    title: 'Daily Task System',
    desc: 'Structured daily tasks across DSA, Development, CS Fundamentals, and Interview Prep.',
  },
  {
    icon: BarChart2,
    title: 'Skill Tracking',
    desc: 'Visualize your progress with radar charts, streaks, and XP-based gamification.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    desc: 'Share roadmaps, follow top achievers, and learn from real success stories.',
  },
];

export default function Features() {
  return (
    <section className="bg-color py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-color mb-3"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Everything you need to land your dream job
          </h2>
          <p className="text-sm sm:text-base subText-color max-w-md mx-auto leading-relaxed">
            Structured roadmaps, daily tasks, skill tracking, and a supportive
            community — all designed to get you hired.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="card-color rounded-2xl p-6 border card-border hover:border-indigo-200 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-color flex items-center justify-center mb-4">
                <f.icon size={18} className="text-indigo-500" strokeWidth={1.75} />
              </div>
              <h3
                className="text-[15px] font-semibold text-color mb-2"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                {f.title}
              </h3>
              <p className="text-sm subText-color leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}