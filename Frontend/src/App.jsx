import { useEffect, lazy, Suspense, memo, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Global Store
import { useAuthStore } from "../Store/authStore";

// Components
import LoadingSpinner from "./components/LoadingSpinner";
import ForgotPasswordForm from "./Pages/passwordResetEmail";
import ResetPasswordForm from "./Pages/resetPassword";
import SubscriptionCheckout from "./Pages/subscriptionCheckout";

// Lazy-loaded Layouts
const MainLayout = lazy(() => import("./Layout/MainlLayout"));
const VendorDashBoardLayout = lazy(() => import("./Layout/VendorDashBoardLayout"));
const CustomerDashboardLayout = lazy(() => import("./Layout/UserDashboardLayout"));

// Lazy-loaded Public Pages
const Home = lazy(() => import("./Pages/home"));
const PricingPage = lazy(() => import("./Pages/pricing"));
const DoctorsListingPage = lazy(() => import("./Pages/med/docListing"));
const Appointment = lazy(() => import("./Pages/med/appointment"));
const MarketPlace = lazy(() => import("./Pages/services"));
const ServicesProviders = lazy(() => import("./Pages/ServicesProviderPage"));
const UserViewPage = lazy(() => import("./Pages/ClientServicePage"));
const ContactForm = lazy(() => import("./Pages/ContactUs"));
const VendorDetailsPage = lazy(() => import("./Pages/VendorDetails"));
const NotFoundPage = lazy(() => import("./Pages/404Page"));
const RedirectPage = lazy(() => import("./Pages/RedirectPage"));

// Lazy-loaded Auth Pages
const LoginForm = lazy(() => import("./components/LoginForm"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const OTPVerification = lazy(() => import("./components/OtpForm/OtpForm"));

// Lazy-loaded Vendor Pages
const VendorOnboardingForm = lazy(() => import("./Pages/Onboard"));
const VendorOnboardingPage = lazy(() => import("./Pages/VendorDashboard/GotoOnboarding"));
const VendorDashboard = lazy(() => import("./Pages/VendorDashboard/VendorServicesPage"));
const VendorSubscription = lazy(() => import("./Pages/VendorDashboard/VendorSubscription"));
const UnderReviewPage = lazy(() => import("./Pages/VendorDashboard/UnderReview"));

// Lazy-loaded Customer Pages
const CustomerOrderDashboard = lazy(() => import("./Pages/User Dashboard/OrderManagment"));

// Lazy-loaded Insurance Pages
const InsuranceApplicationReview = lazy(() => import("./Pages/insurance/applicationReview"));
const InsuranceCheckout = lazy(() => import("./Pages/insurance/checkout"));
const InsurancePlanManagement = lazy(() => import("./Pages/insurance/insuranceManagement"));
const InsuranceDashboardContent = lazy(() => import("./Pages/insurance/myPolicies"));
const PlanDetailsApplication = lazy(() => import("./Pages/insurance/planDetails"));
const PlansMarketplace = lazy(() => import("./Pages/insurance/plansManagement"));
const PolicyManagement = lazy(() => import("./Pages/insurance/policyManagement"));

// Lazy-loaded Admin Pages
const AdminDashboard = lazy(() => import("./Pages/Admin"));

// Lazy-loaded Profile & Editor
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const EditablePage = lazy(() => import("./Pages/EditPage"));

// Protected Route Wrapper
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

  const nprogressStyles = useMemo(() => `
    #nprogress .bar {
      background: red !important;
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
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <style>{nprogressStyles}</style>
      <Toaster position="top-right" richColors closeButton />

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* ---------- PUBLIC ROUTES ---------- */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/medical" element={<DoctorsListingPage />} />
            <Route path="/appoint" element={<Appointment />} />
            <Route path="/view/:id" element={<UserViewPage />} />
            <Route path="/services" element={<MarketPlace />} />
            <Route path="/contact-us" element={<ContactForm />} />
            <Route path="/providers/:type" element={<ServicesProviders />} />
            <Route path="/onboarding" element={<ProtectedRoute><VendorOnboardingForm /></ProtectedRoute>} />
            <Route path="/checkout/subscription" element={
              <ProtectedRoute>
                <SubscriptionCheckout />
              </ProtectedRoute>} />
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            <Route path="/forget-password" element={<ForgotPasswordForm />} />

            <Route path="*" element={<NotFoundPage />} />

          </Route>

          <Route path="/redirect" element={<RedirectPage />} />

          {/* ---------- AUTH ROUTES ---------- */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/verify" element={<OTPVerification />} />

          {/* ---------- INSURANCE ROUTES (Protected) ---------- */}
          <Route path="/test" element={<ProtectedRoute><InsuranceDashboardContent /></ProtectedRoute>} />
          {/* Add more insurance routes here if needed */}

          {/* ---------- VENDOR DASHBOARD ROUTES ---------- */}
          <Route element={<ProtectedRoute><VendorDashBoardLayout /></ProtectedRoute>}>
            <Route path="/goto/onboarding" element={<VendorOnboardingPage />} />
            <Route path="/vendor/wait/review" element={<UnderReviewPage />} />
            <Route path="/dashboard/vendor/services" element={<VendorDashboard />} />
            <Route path="/dashboard/vendor/profile" element={<ProfilePage />} />
            <Route path="/dashboard/subscriptions/vendor" element={<VendorSubscription />} />
            <Route path="/dashboard/vendor/edit/page" element={<EditablePage />} />
          </Route>

          {/* ---------- CUSTOMER DASHBOARD ROUTES ---------- */}
          <Route element={<ProtectedRoute><CustomerDashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard/customer/profile" element={<ProfilePage />} />
            <Route path="/dashboard/customer/orders" element={<CustomerOrderDashboard />} />
          </Route>

          {/* ---------- ADMIN ROUTE ---------- */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* ---------- VENDOR DETAILS ---------- */}
          <Route path="/vendor-details/:id" element={<VendorDetailsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
