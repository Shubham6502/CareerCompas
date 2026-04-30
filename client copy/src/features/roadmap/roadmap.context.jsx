import { createContext,useState,useContext } from "react";

 const RoadmapContext = createContext(null);

export const RoadmapProvider = ({ children }) => {
  const[currentDay,setCurrentDay]=useState(0);
  const[progress,setProgress]=useState(0);
  return (
    <RoadmapContext.Provider value={{currentDay,setCurrentDay,progress,setProgress}}>
        {children}
    </RoadmapContext.Provider>
  );
}

export const useRoadmapContext = () => {
    const context = useContext(RoadmapContext);
    if (!context) {
        throw new Error("useRoadmapContext must be used within a RoadmapProvider");
    }
    return context;
}

