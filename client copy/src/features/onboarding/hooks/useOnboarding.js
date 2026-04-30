import { useState, useCallback } from 'react';
import { useContext } from 'react';
import { OnboardingContext } from '../onboarding.context.jsx';
import { generateRoadmap } from '../services/onboarding.services.js';
import { useNavigate } from 'react-router-dom';


export function useOnboarding() {
  const { setLoading, setError } = useContext(OnboardingContext); // ✓ top level
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    domain: null,
    target: null,
    experience: null,
    timeline: { timeline: null, hours: null, prompt: null },
  });
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const select = (key, value) =>
    setSelections(prev => ({ ...prev, [key]: value }));

  const selectTimeline = (key, value) =>
    setSelections(prev => ({
      ...prev,
      timeline: { ...prev.timeline, [key]: value },
    }));

  const canContinue = (step) => {
    const checks = {
      1: () => !!selections.domain,
      2: () => !!selections.target,
      3: () => !!selections.experience,
      4: () => !!selections.timeline.timeline && !!selections.timeline.hours,
    };
    return checks[step]?.() ?? false;
  };

  const next = () => setCurrentStep(p => Math.min(p + 1, 4));
  const back = () => setCurrentStep(p => Math.max(p - 1, 1));
  const goTo = (step) => { if (step < currentStep) setCurrentStep(step); };

  // ✓ plain async function — no hooks called inside
  const onSubmit = useCallback(async () => {
    setLoading(true);
   
    setError(null);
    try {
      const response = await generateRoadmap(selections);
      console.log('Roadmap generated:', response);
      return response;

    } catch (error) {
     console.error("Error generating roadmap:");
      const message = error?.response?.data?.message ?? 'Failed to generate roadmap.';
      setError(404);
    } finally {
      // setLoading(false); // always runs even if error
    }
  }, [selections, setLoading, setError]);

  return {
    currentStep,
    selections,
    roadmapLoading,
    select,
    selectTimeline,
    canContinue,
    next,
    back,
    goTo,
    onSubmit,

  };
}