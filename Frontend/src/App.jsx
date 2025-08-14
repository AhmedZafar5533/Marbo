import { useEffect, lazy, Suspense, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import NProgress from "nprogress";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import "nprogress/nprogress.css";

// Global Store
import { useAuthStore } from "../Store/authStore";

import ProtectedRoute from "./RoutesProtection/ProtecteRoutes";
import VendorProtectedRoute from "./RoutesProtection/VendorRoutes";
import AdminProtectedRoute from "./RoutesProtection/AdminRoutes";

import LoadingSpinner from "./components/LoadingSpinner";
import SuccessPage from "./Pages/successPage";
import Payments from "./components/Admin/Payments";
import Orders from "./components/Admin/Orders";
import Reviews from "./components/Admin/Reviews";
import VendorReviews from "./Pages/VendorDashboard/Reviews";
import VendorOrders from "./Pages/VendorDashboard/Orders";

const MainLayout = lazy(() => import("./Layout/MainlLayout"));
const VendorDashBoardLayout = lazy(() =>
  import("./Layout/VendorDashBoardLayout")
);
const CustomerDashboardLayout = lazy(() =>
  import("./Layout/UserDashboardLayout")
);

const Home = lazy(() => import("./Pages/home"));
const PricingPage = lazy(() => import("./Pages/PricingPage"));
const MarketPlace = lazy(() => import("./Pages/services"));
const ServicesProviders = lazy(() => import("./Pages/ServicesProviderPage"));
const ContactForm = lazy(() => import("./Pages/ContactUs"));
const NotFoundPage = lazy(() => import("./Pages/404Page"));
const RedirectPage = lazy(() => import("./Pages/RedirectPage"));

const LoginForm = lazy(() => import("./components/LoginForm"));
const RegisterForm = lazy(() => import("./components/RegisterForm"));
const OTPVerification = lazy(() => import("./components/OtpForm/OtpForm"));
const ResetPasswordForm = lazy(() => import("./Pages/resetPassword"));
const ForgotPasswordForm = lazy(() => import("./Pages/passwordResetEmail"));

const MainProductPage = lazy(() => import("./Pages/productListing"));
const ProductDetailPage = lazy(() => import("./Pages/productDetailPage"));

const CheckoutPage = lazy(() => import("./Layout/PaymentLayout"));

const DoctorsListingPage = lazy(() => import("./Pages/med/docListing"));
const Appointment = lazy(() => import("./Pages/med/appointment"));
const AppointmentForm = lazy(() => import("./Pages/med/docProfileDetails"));
const MedicalHealthService = lazy(() => import("./Pages/Medical"));

const UtilityPaymentPage = lazy(() => import("./Pages/UtilityPage"));
const MoneyTransferService = lazy(() => import("./Pages/moneyTransfer"));

const DomesticStaffingService = lazy(() => import("./Pages/DomesticStaffing"));

const HotelRoomsShowcase = lazy(() => import("./Pages/Hotel"));
const RoomDetailPage = lazy(() => import("./Pages/hotelRoomDetailsPage"));

const PropertyShowcase = lazy(() => import("./Pages/HolidayLetsSpots"));
const PropertyDetailPage = lazy(() => import("./Pages/HolidayLetsSpotDetails"));

const MainClothingPage = lazy(() => import("./Pages/ClothingListing"));
const ClothingDetailPage = lazy(() => import("./Pages/ClothingDetailPage"));

const PlansMarketplace = lazy(() => import("./Pages/Insurance"));
const PolicyManagement = lazy(() =>
  import("./Pages/insurance/policyManagement")
);
const InsuranceApplicationReview = lazy(() =>
  import("./Pages/insurance/applicationReview")
);
const InsuranceCheckout = lazy(() => import("./Pages/insurance/checkout"));
const InsurancePlanManagement = lazy(() =>
  import("./Pages/insurance/insuranceManagement")
);
const InsuranceDashboardContent = lazy(() =>
  import("./Pages/insurance/myPolicies")
);
const PlanDetailsApplication = lazy(() =>
  import("./Pages/insurance/planDetails")
);

const SubscriptionCheckout = lazy(() => import("./Pages/subscriptionCheckout"));
const VendorOnboardingForm = lazy(() => import("./Pages/Onboard"));
const VendorOnboardingPage = lazy(() =>
  import("./Pages/VendorDashboard/GotoOnboarding")
);
const UnderReviewPage = lazy(() =>
  import("./Pages/VendorDashboard/UnderReview")
);

const VendorDashboard = lazy(() =>
  import("./Pages/VendorDashboard/VendorServicesPage")
);
const VendorSubscription = lazy(() =>
  import("./Pages/VendorDashboard/VendorSubscription")
);

// Vendor Product Management
const ProductUploadForm = lazy(() =>
  import("./Pages/VendorDashboard/ProductCreation")
);
const TechProductUploadForm = lazy(() =>
  import("./Pages/VendorDashboard/TechStuffCreation")
);
const VendorOrderDashboard = lazy(() =>
  import("./Pages/VendorDashboard/orderManagement")
);
const InventoryPage = lazy(() => import("./Pages/VendorDashboard/Inventory"));

// Vendor Service Management
const StaffTypeCreationForm = lazy(() =>
  import("./Pages/VendorDashboard/StaffCreation")
);
const HolidayLetForm = lazy(() =>
  import("./Pages/VendorDashboard/HolidayLetsCreation")
);
const HotelRoomUploadForm = lazy(() =>
  import("./Pages/VendorDashboard/HotelRoomCreation")
);
const ClothingUploadForm = lazy(() =>
  import("./Pages/VendorDashboard/ClothCreation")
);
const DoctorTypeCreationForm = lazy(() =>
  import("./Pages/VendorDashboard/DoctorCreation")
);

// Vendor Dashboard Management
const DomesticStaffingDashboard = lazy(() =>
  import("./Pages/VendorDashboard/domesticStaffingManagament")
);
const HotelDashboard = lazy(() =>
  import("./Pages/VendorDashboard/hotelManagement")
);
const MedicalStaffingDashboard = lazy(() =>
  import("./Pages/VendorDashboard/medicalStaffMangament")
);
const PropertyManagementDashboard = lazy(() =>
  import("./Pages/VendorDashboard/PropertyManagment")
);
const ClothingManagement = lazy(() =>
  import("./Pages/VendorDashboard/ClothingMangemnet")
);

const CustomerOrderDashboard = lazy(() =>
  import("./Pages/User Dashboard/OrderManagment")
);

const AdminDashboard = lazy(() => import("./Pages/AdminPages/Admin"));
const VendorDetailsPage = lazy(() =>
  import("./Pages/AdminPages/VendorDetails")
);
const PendingVendors = lazy(() => import("./components/Admin/PendingVendors"));
const ListedVendors = lazy(() =>
  import("./components/Admin/RegisteredVendors")
);
const AdminServiceManagement = lazy(() =>
  import("./components/Admin/ServiceManagent")
);

const AdminMessages = lazy(() => import("./components/Admin/Messages"));

const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const EditablePage = lazy(() => import("./Pages/EditPage"));



const App = () => {
  const { checkAuth } = useAuthStore();
  const { pathname } = useLocation();

  const nprogressStyles = useMemo(
    () => `
    #nprogress .bar {
      background: red !important;
      height: 3px !important;
    }
    #nprogress .spinner {
      display: none !important;
    }
  `,
    []
  );

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
          {/* Public Routes - No authentication required */}
          <Route element={<MainLayout />}>
            {/* Core Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/services" element={<MarketPlace />} />
            <Route path="/contact-us" element={<ContactForm />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route
              path="/providers/:category"
              element={<ServicesProviders />}
            />

            {/* Medical Services */}
            <Route path="/medical" element={<DoctorsListingPage />} />
            <Route path="/appoint" element={<Appointment />} />
            <Route
              path="/service/Medical-Care/:id"
              element={<MedicalHealthService />}
            />

            {/* Product Services */}
            <Route
              path="/view/:type/:serviceId/:id"
              element={<ProductDetailPage />}
            />
            <Route
              path="/service/Groceries/:id"
              element={<MainProductPage />}
            />
            <Route
              path="/service/Tech-Supplies/:id"
              element={<MainProductPage />}
            />

            {/* Staffing & Professional Services */}
            <Route
              path="/service/Domestic-Staffing/:id"
              element={<DomesticStaffingService />}
            />

            {/* Financial Services */}
            <Route
              path="/service/Money-Transfer-Services/:id"
              element={<MoneyTransferService />}
            />
            <Route
              path="/service/:billType/:id"
              element={<UtilityPaymentPage />}
            />

            {/* Hospitality Services */}
            <Route
              path="/service/Hotel-Booking/:id"
              element={<HotelRoomsShowcase />}
            />
            <Route
              path="/service/hotel/room/details/:id"
              element={<RoomDetailPage />}
            />

            {/* Property Services */}
            <Route
              path="/service/Holiday-Lets/:id"
              element={<PropertyShowcase />}
            />
            <Route
              path="/service/Holiday-Lets/details/:id"
              element={<PropertyDetailPage />}
            />

            {/* Fashion Services */}
            <Route
              path="/service/Traditional-Clothing/:id"
              element={<MainClothingPage />}
            />
            <Route
              path="/service/Traditional-Clothing/view/:id"
              element={<ClothingDetailPage />}
            />

            {/* Insurance Services */}
            <Route path="/insurance" element={<PolicyManagement />} />
            <Route path="/service/insurance" element={<PlansMarketplace />} />

            {/* Catch-all for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Authentication Routes - No layout needed */}
          <Route path="/redirect" element={<RedirectPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/verify" element={<OTPVerification />} />

          {/* Password Reset Routes */}
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />
          <Route path="/forget-password" element={<ForgotPasswordForm />} />

          {/* Customer Protected Routes - Only for regular authenticated users */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/checkout/subscription"
              element={<SubscriptionCheckout />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <CustomerDashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard/customer/profile"
              element={<ProfilePage />}
            />
            <Route
              path="/dashboard/customer/orders"
              element={<CustomerOrderDashboard />}
            />
          </Route>

          {/* Test Route for Insurance */}
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <InsuranceDashboardContent />
              </ProtectedRoute>
            }
          />

          {/* Vendor Protected Routes - Independent of regular protected routes */}
          <Route
            element={
              <VendorProtectedRoute>
                <MainLayout />
              </VendorProtectedRoute>
            }
          >
            <Route path="/onboarding" element={<VendorOnboardingForm />} />
          </Route>

          <Route
            element={
              <VendorProtectedRoute>
                <VendorDashBoardLayout />
              </VendorProtectedRoute>
            }
          >
            {/* Vendor Onboarding & Status */}
            <Route path="/goto/onboarding" element={<VendorOnboardingPage />} />
            <Route path="/vendor/wait/review" element={<UnderReviewPage />} />

            {/* Vendor Core Dashboard */}
            <Route
              path="/dashboard/vendor/services"
              element={<VendorDashboard />}
            />
            <Route path="/dashboard/vendor/profile" element={<ProfilePage />} />
            <Route
              path="/dashboard/vendor/edit/page"
              element={<EditablePage />}
            />
            <Route
              path="/dashboard/subscriptions/vendor"
              element={<VendorSubscription />}
            />

            {/* Vendor Order & Inventory Management */}
            <Route path="/dashboard/vendor/orders" element={<VendorOrders />} />
            <Route
              path="/dashboard/vendor/reviews"
              element={<VendorReviews />}
            />
            <Route
              path="/dashboard/vendor/inventory"
              element={<InventoryPage />}
            />

            {/* Vendor Product Creation */}
            <Route
              path="/dashboard/vendor/add/products"
              element={<ProductUploadForm />}
            />
            <Route
              path="/dashboard/vendor/add/tech-products"
              element={<TechProductUploadForm />}
            />

            {/* Vendor Service Creation */}
            <Route
              path="/dashboard/vendor/add/staff"
              element={<StaffTypeCreationForm />}
            />
            <Route
              path="/dashboard/vendor/add/holiday/property"
              element={<HolidayLetForm />}
            />
            <Route
              path="/dashboard/vendor/add/hotel/rooms"
              element={<HotelRoomUploadForm />}
            />
            <Route
              path="/dashboard/vendor/add/clothing/clothes"
              element={<ClothingUploadForm />}
            />
            <Route
              path="/dashboard/vendor/add/medical/doctors"
              element={<DoctorTypeCreationForm />}
            />

            {/* Vendor Service Management */}
            <Route
              path="/dashboard/vendor/domestic-staffing-management"
              element={<DomesticStaffingDashboard />}
            />
            <Route
              path="/dashboard/vendor/hotel-managment"
              element={<HotelDashboard />}
            />
            <Route
              path="/dashboard/vendor/manage/medical-staff"
              element={<MedicalStaffingDashboard />}
            />
            <Route
              path="/dashboard/vendor/manage/clothes"
              element={<ClothingManagement />}
            />
            <Route
              path="/dashboard/vendor/manage/holiday-lets"
              element={<PropertyManagementDashboard />}
            />
          </Route>

          {/* Admin Protected Routes - Independent of other protected routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          >
            <Route path="/admin/pending-vendors" element={<PendingVendors />} />
            <Route path="/admin/listed-vendors" element={<ListedVendors />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/reviews" element={<Reviews />} />
            <Route path="/admin/payments" element={<Payments />} />
            <Route
              path="/admin/manage-services"
              element={<AdminServiceManagement />}
            />
          </Route>

          {/* Vendor Details (Admin Access) */}
          <Route
            path="/vendor-details/:id"
            element={
              <AdminProtectedRoute>
                <VendorDetailsPage />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
