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
import DailyAssessment from "./Pages/DailyAssessment";
import Profile from "./Pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserResources from "./Pages/UserResources";
function App() {
  const { isSignedIn, isLoaded } = useUser();
  useSaveUser();
  if (!isLoaded) return null;

  return (
    <>
      {/* Public Navbar */}
      {!isSignedIn && <PublicNavbar />}
      {/* {!isSignedIn && <Home/>} */}
      <Routes>
        <Route
          path="/"
          element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Home />}
        />

        {/* {isSignedIn && (
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        )} */}

        {isSignedIn && (
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
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
      </Routes>
    </>
  );
}

export default App;
