import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

import PublicNavbar from "./components/Navbar/PublicNavbar";
import Home from "./features/home/pages/Home";
import Dashboard from "./features/dashboard/pages/Dashboard";
import Assessment from "./features/assessment/pages/Assessment";
import AppLayout from "./layouts/AppLayout";
import AssessmentTest from "./features/assessment/pages/AssessmentTest";
import ResultPage from "./features/assessment/pages/ResultPage";
// import useSaveUser from "./hooks/useSaveUser";
import Roadmap from "./features/roadmap/pages/Roadmap";
import RoadmapTasks from "./features/roadmap/pages/RoadmapTasks";
import Resources from "./features/resources/pages/Resources";
import DailyAssessment from "./features/assessment/pages/DailyAssessment";
import Profile from "./features/profile/pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserResources from "./features/resources/pages/UserResources";
import JobTracker from "./features/job-tracker/pages/JobTracker";
import Community from "./features/community/pages/Community";
import { CommunityProvider } from "./context/CommunityContext";
import CommunityDashboard from "./features/community/pages/CommunityDashboard";
import Onboarding from "./features/onboarding/pages/Onboarding";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import { Logout } from "./features/auth/pages/Logout";
import ErrorPage from "./features/onboarding/pages/ErrorPage";
function App() {
  const { isSignedIn, isLoaded } = useUser();
  // useSaveUser();
  if (!isLoaded) return null;

  return (
    <>
      {/* Public Navbar */}
    

      {/* {!isSignedIn && <Home/>} */}
      <Routes>

        <Route
        path="/register"
          element={<Register />}
        />

        <Route
        path="/login"
          element={<Login />}
        />

        <Route
          path="/"
          element={<Home/>}
        />

            <Route
            path="/error"
            element={<ErrorPage />}
          />

          <Route
            path="/dashboard"
            element={
              
                <AppLayout>
                  <Dashboard />
                </AppLayout>
            }
          />
        

        (<Route 
          path="/onboarding"
           element={
          <Onboarding />
        } 
          />
        ) 

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
          }
        />
        <Route
          path="/roadmap/tasks"
          element={
            <AppLayout>
              <RoadmapTasks />
            </AppLayout>
          }
        />
        <Route
          path="/resources"
          element={
            <AppLayout>
              <Resources />
            </AppLayout>
          }
        />
        <Route
          path="/dailyassessment"
          element={
            <AppLayout>
              <DailyAssessment />
            </AppLayout>
          }
        />
        <Route
          path="/Profile"
          element={
            <AppLayout>
              <Profile />
            </AppLayout>
          }
        />
        <Route
          path="/userresources"
          element={
            <AppLayout>
              <UserResources />
            </AppLayout>
          }
          />
          <Route
          path="/jobtracker"
          element={
            <AppLayout>
              <JobTracker />
            </AppLayout>
          }/>
           <Route
          path="/community"
          element={
            <CommunityProvider>
              <AppLayout>
                <Community />
              </AppLayout>
            </CommunityProvider>
          }/>
          <Route
          path="/community/CommunityDashboard"
          element={
            <CommunityProvider>
              <AppLayout>
                <CommunityDashboard />
              </AppLayout>
            </CommunityProvider>
          }/>

           
        

          <Route
          path="/logout"
          element={
            <Logout/>
          }
          />
      </Routes>
    </>
  );
}

export default App;
