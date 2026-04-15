import { createContext } from "react";  
import { useState } from "react";
export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const onboardingState = {
        domain: null,
        target: null,
        experience: null,
        timeline: null,
        setDomain: (value) => { onboardingState.domain = value; },
        setTarget: (value) => { onboardingState.target = value; },
        setExperience: (value) => { onboardingState.experience = value; },
        setTimeline: (value) => { onboardingState.timeline = value; },
    }; // Placeholder for actual state and functions
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
  return (
    <OnboardingContext.Provider value={{ ...onboardingState, loading, error, setLoading, setError }}>
      {children}
    </OnboardingContext.Provider>
  );
};