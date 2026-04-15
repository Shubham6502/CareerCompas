import { Compass, CalendarDays, Trophy } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Compass,
    title: 'Choose Your Path',
    desc: 'Select a career domain, experience level, and target goal.',
  },
  {
    num: '02',
    icon: CalendarDays,
    title: 'Get Your Roadmap',
    desc: 'Receive a structured 30–90 day plan with daily tasks and resources.',
  },
  {
    num: '03',
    icon: Trophy,
    title: 'Track & Achieve',
    desc: 'Complete tasks, earn XP, build streaks, and land your dream role.',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-color py-16 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className="text-2xl sm:text-3xl font-bold text-color"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            How it works
          </h2>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="text-xs font-bold text-indigo-400 mb-3 tracking-widest"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                {step.num}
              </span>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                <step.icon size={22} className="text-indigo-500" strokeWidth={1.75} />
              </div>
              <h3
                className="text-[15px] font-semibold text-color mb-2"
                style={{ fontFamily: 'var(--font-head)' }}
              >
                {step.title}
              </h3>
              <p className="text-sm subText-color leading-relaxed max-w-[200px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}