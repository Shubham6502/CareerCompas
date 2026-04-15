import { useState,createContext,useContext } from "react";

export const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [roadmapId, setRoadmapId] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState(null);

    return (
        <DashboardContext.Provider value={{ loading, setLoading,user,setUser, error, setError, roadmapId, setRoadmapId, totalUsers, setTotalUsers, currentUserRank, setCurrentUserRank }}>
          {children}
        </DashboardContext.Provider>
      );
}   

const useDashboardContext = () => {
    const context = useContext(DashboardContext);
    if (!context) {
      throw new Error("useDashboardContext must be used within a DashboardProvider");
    }
    return context;
  };

export { useDashboardContext };