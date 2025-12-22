import { useClerk } from "@clerk/clerk-react";
import bgPattern from "../assets/background.jpg";

const Home = () => {
  const { openSignIn } = useClerk();

  return (
      <div className="min-h-screen bg-[#0B0F1A]/99 grid-bg">


      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center text-center px-6 pt-32 pb-24">
        
        <span className="mb-6 px-4 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-gray-300">
          Career Compass v1.0 is Live
        </span>

       <h1 className="text-center font-extrabold tracking-tight leading-[1.05]">
  
  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white">
    Engineer Your
  </div>

  
  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                  bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500
                  bg-clip-text text-transparent">
    Career Success Roadmap.
  </div>
</h1>

        <p className="mt-6 max-w-2xl text-gray-400 text-lg">
          Career Compass is an AI-powered career guidance platform designed to
          help students choose the right domain, follow a structured roadmap,
          and prepare confidently for placements.
        </p>

        <div className="mt-10 flex gap-4">
  

  <div className="relative inline-block">
    
 
    <div
      className="absolute inset-0 rounded-lg blur-xl opacity-60
                 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600
                 pointer-events-none"
    />

   
    <button
      onClick={openSignIn}
      className="relative z-10 px-6 py-3 rounded-lg
                 bg-blue-600 hover:bg-blue-700
                 text-white font-medium transition"
    >
      Get Started →
    </button>
  </div>

  
  <a
    href="#modules"
    className="px-6 py-3 rounded-lg border border-white/10
               hover:bg-white/5 transition text-white"
  >
    Explore Modules
  </a>

</div>

      </section>

      {/* PREVIEW MOCK SECTION */}
      <section className="flex justify-center px-6 pb-32">
        <div className="w-full max-w-5xl rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 p-6">
          <div className="h-64 rounded-xl bg-[#0F172A] flex items-center justify-center text-gray-500">
            Dashboard Preview (UI Mock)
          </div>
        </div>
      </section>

      {/* MODULES */}
      <section id="modules" className="px-6 pb-32 max-w-6xl mx-auto text-white">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Career Compass Modules
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModuleCard
            title="AI Career Assessment"
            desc="Analyze interests and skills to recommend the best career domain."
          />
          <ModuleCard
            title="Personalized Roadmaps"
            desc="Step-by-step learning paths tailored to your career goal."
          />
          <ModuleCard
            title="Progress Tracking"
            desc="Track your preparation journey and stay consistent."
          />
          <ModuleCard
            title="Placement Preparation"
            desc="Prepare for interviews, DSA, and technical rounds efficiently."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Career Compass. All rights reserved.
      </footer>
    </div>
  );
};

const ModuleCard = ({ title, desc }) => (
  <div className="rounded-xl bg-[#0F172A] border border-white/10 p-6 hover:border-blue-500/40 transition">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </div>
);

export default Home;
