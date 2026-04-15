import { ArrowRight } from 'lucide-react';
import {useClerk} from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
    const navigate = useNavigate();
  return (
    <section className="bg-color py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold text-color mb-3"
          style={{ fontFamily: 'var(--font-head)' }}
        >
          Ready to map your career?
        </h2>
        <p className="text-sm sm:text-base subText-color mb-8 leading-relaxed">
          Join thousands of learners using CareerCompass to land roles at top tech companies.
        </p>
        
         <button onClick={() => navigate('/login')} className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-sm px-7 py-3.5 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Start Your Roadmap
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}