import { useEffect, lazy, Suspense, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Global Store
import { useAuthStore } from "../Store/authStore";

// Route Guards
import ProtectedRoute from "./RoutesProtection/ProtecteRoutes";
import VendorProtectedRoute from "./RoutesProtection/VendorRoutes";
import AdminProtectedRoute from "./RoutesProtection/AdminRoutes";

// Components
import LoadingSpinner from "./components/LoadingSpinner";
import AppointmentForm from "./Pages/med/docProfileDetails";
import RegistrationLookup from "./Pages/UtilityPage";

// Eager-loaded Pages
import MainProductPage from "./Pages/productListing";
import ProductDetailPage from "./Pages/productDetailPage";
import ProductUploadForm from "./Pages/VendorDashboard/ProductCreation";
import VendorOrderDashboard from "./Pages/VendorDashboard/orderManagement";
import InventoryPage from "./Pages/VendorDashboard/Inventory";
import MoneyTransferService from "./Pages/moneyTransfer";
import DomesticStaffingService from "./Pages/DomesticStaffing";
import StaffTypeCreationForm from "./Pages/VendorDashboard/StaffCreation";
import HotelRoomsShowcase from "./Pages/Hotel";
import PropertyDetailPage from "./Pages/HolidayLetsSpotDetails";
import MedicalHealthService from "./Pages/Medical";
import HolidayLetForm from "./Pages/VendorDashboard/HolidayLetsCreation";
import HotelRoomUploadForm from "./Pages/VendorDashboard/HotelRoomCreation";
import PlansMarketplace from "./Pages/Insurance";
import ClothingUploadForm from "./Pages/VendorDashboard/ClothCreation";
import DoctorTypeCreationForm from "./Pages/VendorDashboard/DoctorCreation";
import RoomDetailPage from "./Pages/hotelRoomDetailsPage";
import PropertyShowcase from "./Pages/HolidayLetsSpots";
import MainClothingPage from "./Pages/ClothingListing";
import ClothingDetailPage from "./Pages/ClothingDetailPage";
import DomesticStaffingDashboard from "./Pages/VendorDashboard/domesticStaffingManagament";
import HotelDashboard from "./Pages/VendorDashboard/hotelManagement";
import MedicalStaffingDashboard from "./Pages/VendorDashboard/medicalStaffMangament";
import PropertyManagementDashboard from "./Pages/VendorDashboard/PropertyManagment";

// Lazy Layouts
const MainLayout = lazy(() => import("./Layout/MainlLayout"));
const VendorDashBoardLayout = lazy(() => import("./Layout/VendorDashBoardLayout"));
const CustomerDashboardLayout = lazy(() => import("./Layout/UserDashboardLayout"));

// Lazy Public Pages
const Home = lazy(() => import("./Pages/home"));
const PricingPage = lazy(() => import("./Pages/PricingPage"));
const DoctorsListingPage = lazy(() => import("./Pages/med/docListing"));
const Appointment = lazy(() => import("./Pages/med/appointment"));
const MarketPlace = lazy(() => import("./Pages/services"));
const ServicesProviders = lazy(() => import("./Pages/ServicesProviderPage"));
const UserViewPage = lazy(() => import("./Pages/ClientServicePage"));
const ContactForm = lazy(() => import("./Pages/ContactUs"));
const NotFoundPage = lazy(() => import("./Pages/404Page"));
const RedirectPage = lazy(() => import("./Pages/RedirectPage"));

// Lazy Auth Pages
const LoginForm = lazy(() => import("./components/LoginForm"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const OTPVerification = lazy(() => import("./components/OtpForm/OtpForm"));
const ResetPasswordForm = lazy(() => import("./Pages/resetPassword"));
const ForgotPasswordForm = lazy(() => import("./Pages/passwordResetEmail"));
const SubscriptionCheckout = lazy(() => import("./Pages/subscriptionCheckout"));

// Lazy Vendor Pages
const VendorOnboardingForm = lazy(() => import("./Pages/Onboard"));
const VendorOnboardingPage = lazy(() => import("./Pages/VendorDashboard/GotoOnboarding"));
const VendorDashboard = lazy(() => import("./Pages/VendorDashboard/VendorServicesPage"));
const VendorSubscription = lazy(() => import("./Pages/VendorDashboard/VendorSubscription"));
const UnderReviewPage = lazy(() => import("./Pages/VendorDashboard/UnderReview"));

// Lazy Customer Pages
const CustomerOrderDashboard = lazy(() => import("./Pages/User Dashboard/OrderManagment"));

// Lazy Insurance Pages
const PolicyManagement = lazy(() => import("./Pages/insurance/policyManagement"));
const InsuranceApplicationReview = lazy(() => import("./Pages/insurance/applicationReview"));
const InsuranceCheckout = lazy(() => import("./Pages/insurance/checkout"));
const InsurancePlanManagement = lazy(() => import("./Pages/insurance/insuranceManagement"));
const InsuranceDashboardContent = lazy(() => import("./Pages/insurance/myPolicies"));
const PlanDetailsApplication = lazy(() => import("./Pages/insurance/planDetails"));

// Lazy Admin Pages
const AdminDashboard = lazy(() => import("./Pages/AdminPages/Admin"));
const VendorDetailsPage = lazy(() => import("./Pages/AdminPages/VendorDetails"));

// Lazy Profile & Editor
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const EditablePage = lazy(() => import("./Pages/EditPage"));

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

          {/* PUBLIC ROUTES */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/medical" element={<DoctorsListingPage />} />
            <Route path="/appoint" element={<Appointment />} />
            <Route path="/view/:id" element={<ProductDetailPage />} />
            <Route path="/services" element={<MarketPlace />} />
            <Route path="/contact-us" element={<ContactForm />} />
            <Route path="/providers/:category" element={<ServicesProviders />} />
            <Route path="/service/Groceries/:id" element={<MainProductPage />} />
            <Route path="/service/Domestic-Staffing/:id" element={<DomesticStaffingService />} />
            <Route path="/service/Money-Transfer-Services/:id" element={<MoneyTransferService />} />
            <Route path="/service/payment" element={<RegistrationLookup />} />
            <Route path="/service/Hotel-Booking/:id" element={<HotelRoomsShowcase />} />
            <Route path="/insurance" element={<PolicyManagement />} />
            <Route path="/service/Holiday-Lets/:id" element={<PropertyShowcase />} />
            <Route path="/service/Holiday-Lets/details/:id" element={<PropertyDetailPage />} />
            <Route path="/service/hotel/room/details/:id" element={<RoomDetailPage />} />
            <Route path="/service/Traditional-Clothing/:id" element={<MainClothingPage />} />
            <Route path="/service/Traditional-Clothing/view/:id" element={<ClothingDetailPage />} />
            <Route path="/service/Medical-Care/:id" element={<MedicalHealthService />} />

            <Route path="/service/insurance" element={<PlansMarketplace />} />

            {/* PUBLIC AUTH / PASSWORD / SUBSCRIPTION */}
            <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
            <Route path="/forget-password" element={<ForgotPasswordForm />} />
            <Route path="/checkout/subscription" element={
              <ProtectedRoute><SubscriptionCheckout /></ProtectedRoute>
            } />
            <Route path="/onboarding" element={
              <ProtectedRoute><VendorProtectedRoute><VendorOnboardingForm /></VendorProtectedRoute></ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          <Route path="/redirect" element={<RedirectPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/verify" element={<OTPVerification />} />

          {/* INSURANCE DASHBOARD (Protected) */}
          <Route path="/test" element={
            <ProtectedRoute><InsuranceDashboardContent /></ProtectedRoute>
          } />

          {/* VENDOR DASHBOARD ROUTES */}
          <Route element={
            <ProtectedRoute><VendorProtectedRoute><VendorDashBoardLayout /></VendorProtectedRoute></ProtectedRoute>
          }>
            <Route path="/goto/onboarding" element={<VendorOnboardingPage />} />
            <Route path="/vendor/wait/review" element={<UnderReviewPage />} />
            <Route path="/dashboard/vendor/services" element={<VendorDashboard />} />
            <Route path="/dashboard/vendor/profile" element={<ProfilePage />} />
            <Route path="/dashboard/subscriptions/vendor" element={<VendorSubscription />} />
            <Route path="/dashboard/vendor/orders" element={<VendorOrderDashboard />} />
            <Route path="/dashboard/vendor/add/products" element={<ProductUploadForm />} />
            <Route path="/dashboard/vendor/edit/page" element={<EditablePage />} />
            <Route path="/dashboard/vendor/inventory" element={<InventoryPage />} />
            <Route path="/dashboard/vendor/domestic-staffing-management" element={<DomesticStaffingDashboard />} />
            <Route path="/dashboard/vendor/hotel-managment" element={<HotelDashboard />} />
            <Route path="/dashboard/vendor/manage/medical-staff" element={<MedicalStaffingDashboard />} />
            <Route path="/dashboard/vendor/manage/holiday-lets" element={<PropertyManagementDashboard />} />
            <Route path="/dashboard/vendor/add/staff" element={<StaffTypeCreationForm />} />
            <Route path="/dashboard/vendor/add/holiday/property" element={<HolidayLetForm />} />
            <Route path="/dashboard/vendor/add/hotel/rooms" element={<HotelRoomUploadForm />} />
            <Route path="/dashboard/vendor/add/clothing/clothes" element={<ClothingUploadForm />} />
            <Route path="/dashboard/vendor/add/medical/doctors" element={<DoctorTypeCreationForm />} />
          </Route>

          {/* CUSTOMER DASHBOARD ROUTES */}
          <Route element={<ProtectedRoute><CustomerDashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard/customer/profile" element={<ProfilePage />} />
            <Route path="/dashboard/customer/orders" element={<CustomerOrderDashboard />} />
          </Route>

          {/* ADMIN DASHBOARD ROUTE */}
          <Route path="/admin" element={
            <ProtectedRoute><AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute></ProtectedRoute>
          } />

          {/* OTHER PROTECTED ROUTES */}
          <Route path="/vendor-details/:id" element={<VendorDetailsPage />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
