import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Logout = async() => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  await handleLogout();
  console.log("User logged out successfully.");
  navigate("/");
  return null;
};
