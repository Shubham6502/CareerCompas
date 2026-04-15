import { createContext, useState, useContext, useEffect } from "react";
import { getme } from "./services/auth.services";
import { useNavigate } from "react-router-dom";
const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ ADD HERE
  const navigate = useNavigate();

  // 🔥 Load user from localStorage ONCE
  useEffect(() => {
    async function loadUser(){
     try{
       const userData= await getme();
      setUser(userData.user);

     }
      catch(error){
        console.error("Error loading user data:", error);
      }
      finally{
          setIsInitialized(true); 
      }
    }
    loadUser();
  }, []);

  

  const useLogin = (userData) => {
    setUser(userData);
    navigate("/dashboard");

  };
  const getuserData=(userData)=>{
    setUser(userData);
  }
  const useLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, useLogin, getuserData, useLogout, isInitialized }} 
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};