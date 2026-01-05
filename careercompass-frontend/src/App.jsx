import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import PublicNavbar from "./components/Navbar/PublicNavbar";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import Assessment from "./Pages/Assessment";
import AppLayout from "./layouts/AppLayout";
import AssessmentTest from "./Pages/AssessmentTest";
import ResultPage from "./Pages/ResultPage";
import useSaveUser from "./hooks/useSaveUser";
import Roadmap from "./Pages/Roadmap";
import RoadmapTasks from "./Pages/RoadmapTasks";
import Resources from "./Pages/Resources";


function App() {
  const { isSignedIn, isLoaded } = useUser();
  useSaveUser();
  // Wait until Clerk is loaded
  if (!isLoaded) return null;

  return (
    <>
      {/* Public Navbar */}
      {!isSignedIn && <PublicNavbar />}

      <Routes>
       
        {!isSignedIn && <Route path="/" element={<Home />} />}

       
        {isSignedIn && (
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        )}

       
        {isSignedIn && (
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
        )}

       
        {isSignedIn && (
          <Route
            path="/assessment"
            element={
              <AppLayout>
                <Assessment />
              </AppLayout>
            }
          />
        )}
        {isSignedIn && (
          <Route
            path="/assessment/test"
            element={
              <AppLayout>
                <AssessmentTest />
              </AppLayout>
            }
          />
        )}
        <Route
          path="/assessment/result"
          element={
            <AppLayout>
              <ResultPage />
            </AppLayout>
          }
        />
        <Route
      path="/roadmap"
      element={
        <AppLayout>
          <Roadmap />
          </AppLayout>
        }/>
        <Route
        path="/roadmap/tasks"
        element={
          <AppLayout>
            <RoadmapTasks/>
          </AppLayout>
        }/>
        <Route 
        path='/resources'
        element={
          <AppLayout>
            <Resources/>
            </AppLayout>
          
        }
        />

      </Routes>

      
        
    </>
  );
}

export default App;
