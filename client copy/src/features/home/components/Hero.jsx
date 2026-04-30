import { ArrowRight } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function Hero() {
    const navigate = useNavigate();
  return (
    <section className="bg-color pt-16 pb-12 px-4 text-center">
      <div className="max-w-2xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 card-color text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 border card-border">
          <Sparkles size={12} />
          AI-Powered Career Roadmaps
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-color leading-tight mb-4"
          style={{ fontFamily: 'var(--font-head)' }}
        >
          Your Career,{' '}
          <span className="text-indigo-500">Mapped Out</span>
        </h1>

        {/* Subheading */}
        <p className="text-base sm:text-lg subText-color leading-relaxed mb-8 max-w-xl mx-auto">
          Choose your domain, set your goal, and get a personalized day-by-day
          roadmap with tasks, resources, and progress tracking — all in one place.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          
           <button onClick={navigate.bind(null, "/register")} className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-200 w-full sm:w-auto justify-center"
          >
            Get Started Free
            <ArrowRight size={16} />
          </button>
          
           <button onClick={navigate.bind(null, "/login")} className="text-sm font-medium text-subText-color hover:text-color px-6 py-3 rounded-lg border border-card-border hover:border-hover-border transition-all duration-200 w-full sm:w-auto text-center"
          >
            Log in to Dashboard
          </button>
        </div>
      </div>
    </section>
  );
}