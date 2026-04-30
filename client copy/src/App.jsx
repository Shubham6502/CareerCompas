import { Routes, Route, Navigate } from "react-router-dom";

import PublicNavbar from "./components/Navbar/PublicNavbar";
import Home from "./features/home/pages/Home";
import Dashboard from "./features/dashboard/pages/Dashboard";
import AppLayout from "./layouts/AppLayout";
import Roadmap from "./features/roadmap/pages/Roadmap";
import RoadmapTasks from "./features/roadmap/pages/RoadmapTasks";
import Resources from "./features/resources/pages/Resources";
import Profile from "./features/profile/pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import UserResources from "./features/resources/pages/UserResources";
import JobTracker from "./features/job-tracker/pages/JobTracker";
import Community from "./features/community/pages/Community";
import CommunityDashboard from "./features/community/pages/CommunityDashboard";
import Onboarding from "./features/onboarding/pages/Onboarding";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import { Logout } from "./features/auth/pages/Logout";
import ErrorPage from "./features/onboarding/pages/ErrorPage";
// import { useAuthContext } from "./features/auth/auth.context.jsx";
function App() {

  return (
    <>
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
                <ProtectedRoute>
                 <AppLayout>
                    <Dashboard />
                 </AppLayout>
                </ProtectedRoute>
              }
            />
          

        (<Route 
          path="/onboarding"
           element={
          <Onboarding />
        } 
          />
        )         
       
 
       
        <Route
          path="/roadmap"
          element={
            <ProtectedRoute>
               <AppLayout>
                 <Roadmap />
               </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/roadmap/tasks"
          element={
            <ProtectedRoute>
            <AppLayout>
              <RoadmapTasks />
            </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
            <AppLayout>
              <Resources />
            </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Profile"
          element={
            <ProtectedRoute>
            <AppLayout>
              <Profile />
            </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userresources"
          element={
            <ProtectedRoute>
            <AppLayout>
              <UserResources />
            </AppLayout>
            </ProtectedRoute>
          }
          />
          <Route
          path="/jobtracker"
          element={
            <ProtectedRoute>
            <AppLayout>
              <JobTracker />
            </AppLayout>
            </ProtectedRoute>
          }/>
           
        

          <Route
          path="/logout"
          element={
            <ProtectedRoute>
            <Logout/>
            </ProtectedRoute>
          }
          />
      </Routes>
    </>
  );
}

export default App;
