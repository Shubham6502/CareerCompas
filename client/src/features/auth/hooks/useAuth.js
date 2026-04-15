import { login, register,logout,getme } from "../services/auth.services";
import { useContext ,useState} from "react";
import { useAuthContext } from "../auth.context.jsx";
import { useNavigate } from "react-router-dom";
import Login from "../pages/Login.jsx";



export const useAuth = () => {
  const {user,useLogin,getuserData,useLogout} = useAuthContext();

  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const getUser = async() => {
   const responce= await getme();
   getuserData(responce.user);
   console.log("User data fetched:", responce.user);
   return responce;
  }


  const handleLogin = async (email, password) => {
    try {
      const response = await login(email, password);
      console.log("Login successful:", response);
      useLogin(response);
     setError(null);
      navigate("/dashboard");

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password");
      throw error;
    }
    
  };
  const handleRegister = async (email, password, displayName) => {
    try {
      const response = await register(email, password, displayName);
      console.log("Registration successful:", response);
      useLogin(response.user);
      setError(null);
      navigate("/onboarding");
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed Invalid Details");
      throw error;
    } 
  };

  const handleLogout = async () => {
    const response= await logout();
    console.log(response);
    useLogout();
    navigate("/login");
  };

  return { handleLogin, handleRegister, handleLogout,error ,setError};
};
