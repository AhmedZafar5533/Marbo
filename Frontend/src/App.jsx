import { useEffect, lazy, Suspense, memo, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuthStore } from "../Store/authStore";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import LoadingSpinner from "./components/LoadingSpinner";
import VendorOnboardingPage from "./Pages/VendorDashboard/GotoOnboarding";
import ServicesProviders from "./Pages/ServicesProviderPage";

const MainLayout = lazy(() => import("./Layout/MainlLayout"));
const VendorDashBoardLayout = lazy(() => import("./Layout/VendorDashBoardLayout"));
const LoginForm = lazy(() => import("./components/LoginForm"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const OTPVerification = lazy(() => import("./components/OtpForm/OtpForm"));
const VendorOnboardingForm = lazy(() => import("./Pages/Onboard"));
const Dashboard = lazy(() => import("./Pages/Admin"));
const VendorDashboard = lazy(() => import("./Pages/VendorDashboard/VendorServicesPage"));
const EditablePage = lazy(() => import("./Pages/EditPage"));
const UserViewPage = lazy(() => import("./Pages/ClientServicePage"));
const MarketPlace = lazy(() => import("./Pages/services"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const ContactForm = lazy(() => import("./Pages/ContactUs"));
const VendorSubscription = lazy(() => import("./Pages/VendorSubscription"));
const AdminDashboard = lazy(() => import("./Pages/Admin"));
const RedirectPage = lazy(() => import("./Pages/RedirectPage"));
const Home = lazy(() => import("./Pages/home"));
const PricingPage = lazy(() => import("./Pages/pricing"));
const VendorDetailsPage = lazy(() => import("./Pages/VendorDetails"));
const NotFoundPage = lazy(() => import("./Pages/404Page"));

const ProtectedRoute = memo(({ children }) => {
  const { authenticationState, loading, redirectToOtp } = useAuthStore();
  const { pathname } = useLocation();

  if (loading) return <LoadingSpinner />;

  if (redirectToOtp && pathname !== "/verify") {
    return <Navigate to="/verify" state={{ from: pathname }} replace />;
  }

  if (!authenticationState && pathname !== "/login") {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  }

  return children;
});

const App = () => {
  const { checkAuth } = useAuthStore();
  const { pathname } = useLocation();
  const excludedPaths = new Set(["/", "/services", '/providers', '/pricing']);

  const nprogressStyles = useMemo(() => `
    #nprogress .bar {
      background: #007bff !important;
      height: 3px !important;
    }
    #nprogress .spinner {
      display: none !important;
    }
  `, []);

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!excludedPaths.has(pathname)) {
      checkAuth();
    }
  }, [pathname, checkAuth]);

  return (
    <div>
      <style>{nprogressStyles}</style>
      <Toaster position="top-right" richColors closeButton />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/view/:id" element={<UserViewPage />} />
            <Route path="/services" element={<MarketPlace />} />
            <Route path="/contact-us" element={<ContactForm />} />
            <Route path="/providers" element={<ServicesProviders />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/redirect" element={<RedirectPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/verify" element={<OTPVerification />} />
          <Route element={<ProtectedRoute><VendorDashBoardLayout /></ProtectedRoute>}>
            <Route path="/goto/onboarding" element={<VendorOnboardingPage />} />
            <Route path="/dashboard/vendor/services" element={<VendorDashboard />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/subscriptions/vendor" element={<VendorSubscription />} />
          </Route>
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/edit/:id" element={<ProtectedRoute><EditablePage /></ProtectedRoute>} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
