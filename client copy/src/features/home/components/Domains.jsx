import { Code2, BarChart2, Brain, Server, Layout, Terminal } from 'lucide-react';

const DOMAINS = [
  { icon: Code2,     label: 'Software Engineer',    color: 'bg-blue-50   text-blue-500' },
  { icon: BarChart2, label: 'Data Analyst',         color: 'bg-amber-50  text-amber-500' },
  { icon: Brain,     label: 'AI / ML Engineer',     color: 'bg-purple-50 text-purple-500' },
  { icon: Server,    label: 'DevOps Engineer',      color: 'bg-neutral-100 text-neutral-500' },
  { icon: Layout,    label: 'Frontend Developer',   color: 'bg-pink-50   text-pink-500' },
  { icon: Terminal,  label: 'Backend Developer',    color: 'bg-green-50  text-green-500' },
];

export default function Domains() {
  return (
    <section className="bg-color py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h2
            className="text-2xl sm:text-3xl font-bold text-color mb-3"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Pick your career domain
          </h2>
          <p className="text-sm sm:text-base subText-color max-w-xs mx-auto leading-relaxed">
            We support multiple tech career paths with curated, day-by-day roadmaps for each.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {DOMAINS.map((d, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 p-5 card-color rounded-2xl border card-border hover:border-indigo-200 hover:shadow-sm cursor-pointer transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-color ${d.color}`}>
                <d.icon size={22} className={d.color.split(' ')[1]} strokeWidth={1.75} />
              </div>
              <span
                className="text-sm font-semibold text-color text-center group-hover:text-indigo-600 transition-colors"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}