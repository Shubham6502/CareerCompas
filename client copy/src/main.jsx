import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppContextProvider } from "./context/AppContext.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthContextProvider } from "./features/auth/auth.context.jsx";
import { OnboardingProvider } from "./features/onboarding/onboarding.context.jsx";
import { DashboardProvider } from "./features/dashboard/Dashboard.context.jsx";
import { RoadmapProvider } from "./features/roadmap/roadmap.context.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <ThemeProvider>
        <AppContextProvider>
          <AuthContextProvider>
            <OnboardingProvider>
              <DashboardProvider>
                <RoadmapProvider>
                  <App />
                </RoadmapProvider>
              </DashboardProvider>
            </OnboardingProvider>
          </AuthContextProvider>
        </AppContextProvider>
      </ThemeProvider>
    </BrowserRouter>
 
);
