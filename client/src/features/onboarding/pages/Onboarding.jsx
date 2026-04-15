import { AnimatePresence, motion } from 'framer-motion';
import { useOnboarding } from '../hooks/useOnboarding.js';
import StepIndicator from '../components/StepIndicator.jsx';
import BottomBar from '../components/BottomBar.jsx';
// import ThemeToggle from '../components/ThemeToggle';
import DomainPage from './DomainPage.jsx';
import TargetPage from './TargetPage.jsx';
import ExperiencePage from './ExperiencePage.jsx';
import TimelinePage from './TimelinePage.jsx';
import { Sun, Moon } from 'lucide-react';
import { useState ,useContext} from 'react';
import { OnboardingContext } from '../onboarding.context.jsx';
import GeneratingRoadmap from '../components/GeneratingRoadmapLoader.jsx';
import { useNavigate } from 'react-router-dom';



// import {useTheme } from '../../../context/ThemeContext.jsx';



const pageVariants = {
  enter:  { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0,  transition: { duration: 0.3, ease: 'easeOut' } },
  exit:   { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

export default function Onboarding() {
  const { currentStep, selections,roadmapLoading, select, canContinue, next, back, goTo, onSubmit } = useOnboarding();
  const { loading, error } = useContext(OnboardingContext);
  const navigate = useNavigate();
 
  const renderPage = () => {
    switch (currentStep) {
      case 1: return <DomainPage     selected={selections.domain}     onSelect={v => select('domain', v)} />;
      case 2: return <TargetPage     selected={selections.target}     onSelect={v => select('target', v)} />;
      case 3: return <ExperiencePage selected={selections.experience} onSelect={v => select('experience', v)} />;
      case 4: return <TimelinePage   selected={selections.timeline}   onSelect={v => select('timeline', v)} />;
      default: return null;
    }
  };

 if (loading && !error) {
    return (

     <GeneratingRoadmap onComplete={() => {navigate('/dashboard')}} />
    );
}
if(error && error !== 404 && !loading){
  return( navigate('/error'))
}

    // {roadmapLoading && (
    //   <RoadmapLoader onComplete={() => {navigate('/dashboard ') }} /> 
    // )}

  return (
    <div className="flex flex-col min-h-dvh bg-neutral-100  font-body transition-colors duration-300">

      {/* Header */}
      <header className="sticky top-0 z-50 h-[60px] bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between gap-2">
  {/* Logo — hide text on very small screens */}
  <div className="flex items-center gap-2 shrink-0">
    <div className="w-[34px] h-[34px] rounded-[9px] bg-indigo-500 flex items-center justify-center">
      {/* icon */}
    </div>
    <span className="hidden sm:block font-semibold text-neutral-900">
      CareerCompass
    </span>
  </div>

  <StepIndicator currentStep={currentStep} onGoTo={goTo} />
  {/* <ThemeToggle /> */}
</header>

      {/* Main */}
      <main className="flex-1 overflow-y-auto flex flex-col items-center px-5 pt-12 pb-28">
        <div className="w-full max-w-[760px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomBar
        currentStep={currentStep}
        canContinue={canContinue(currentStep)}
        onBack={back}
        onNext={next}
        onSubmit={onSubmit}
        isLast={currentStep === 4}
      />
    </div>
  );
}