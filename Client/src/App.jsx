import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ResetPassword from "./pages/auth/ResetPassword";
import OnboardPage from "./pages/OnboardPage";
import LoadingPage from "./pages/LoadingPage";
import ResultPage from "./pages/ResultPage";
import RefinementPage from "./pages/RefinementPage";
import WeeklyPlanPage from "./pages/WeeklyPlanPage";
import DashboardPage from "./pages/DashboardPage";
import IdeasPage from "./pages/IdeasPage";
import ContentPage from "./pages/ContentPage";
import PlansPage from "./pages/PlansPage";
import SettingPage from "./pages/SettingPage";
import UpdateResultPage from "./pages/UpdateResultPage";
import UpdateLoadingPage from "./pages/UpdateLoadingPage";
import MoreLoading from "./pages/MoreLoading";
import MoreResult from "./pages/MoreResult";
import GAV from "./pages/GAV";
import PlanView from "./pages/PlanView";
import SingleIdeaPage from "./pages/SingleIdeaPage";


import { Toaster } from "sonner";
import { getDefaultAuthenticatedPath, getStoredAuth } from "./utils/authRouting";
import { useTheme } from "./context/ThemeContext";

function HomeEntry() {
  const { token, user } = getStoredAuth();
  if (token && user) {
    return <Navigate to={getDefaultAuthenticatedPath(user)} replace />;
  }

  return <LandingPage />;
}

function GuestRoute({ children }) {
  const { token, user } = getStoredAuth();
  if (token && user) {
    return <Navigate to={getDefaultAuthenticatedPath(user)} replace />;
  }

  return children;
}

function ProtectedRoute({ children, allowBeforeOnboarding = false }) {
  const { token, user } = getStoredAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowBeforeOnboarding && !user.isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function App() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors theme={theme} />
      <Routes>
        <Route path="/" element={<HomeEntry />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/VerifyOtpPage" element={<GuestRoute><VerifyOtpPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute allowBeforeOnboarding={true}><OnboardPage /></ProtectedRoute>} />
        <Route path="/Onboarding" element={<Navigate to="/onboarding" replace />} />
        <Route path="/LoadingPage" element={<ProtectedRoute allowBeforeOnboarding={true}><LoadingPage /></ProtectedRoute>}/>
        <Route path="/ResultPage" element={<ProtectedRoute><ResultPage /></ProtectedRoute>}/>
        <Route path="/RefinementPage" element={<ProtectedRoute><RefinementPage /></ProtectedRoute>} />
        <Route path="/WeeklyPlanPage" element={<ProtectedRoute><WeeklyPlanPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/ideas" element={<ProtectedRoute><IdeasPage /></ProtectedRoute>} />
        <Route path="/content" element={<ProtectedRoute><ContentPage /></ProtectedRoute>} />
        <Route path="/plans" element={<ProtectedRoute><PlansPage /></ProtectedRoute>} />
        <Route path="/DashboardPage" element={<Navigate to="/dashboard" replace />} />

        <Route path="/settings" element={<ProtectedRoute><SettingPage /></ProtectedRoute>} />
        <Route path="/UpdateResultPage" element={<ProtectedRoute><UpdateResultPage /></ProtectedRoute>} />
        <Route path="/UpdateLoadingPage" element={<ProtectedRoute><UpdateLoadingPage /></ProtectedRoute>} />
        <Route path="/MoreLoading" element={<ProtectedRoute><MoreLoading /></ProtectedRoute>} />
        <Route path="/MoreResult" element={<ProtectedRoute><MoreResult /></ProtectedRoute>} />
        <Route path="/GAV" element={<ProtectedRoute><GAV /></ProtectedRoute>} />
        <Route path="/PlanView" element={<ProtectedRoute><PlanView /></ProtectedRoute>} />
        <Route path="/idea" element={<ProtectedRoute><SingleIdeaPage /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
