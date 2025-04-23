import { ArrowRight } from "lucide-react";

const VendorLandingSection = () => {
  // Updated color palette consistent with previous component
  const colors = {
    primary: "#E81C0E",          // Vibrant red
    secondary: "#FFD700",        // Rich gold/yellow
    accent: "#FFC107",           // Yellow accent
    dark: "#212121",             // Near black for text
    light: "#FFFFFF",            // White
    grey: "#F6F6F6",             // Light grey background
    background: "#FAFAFA",       // Off-white background
    darkBlue: "#1c1c28",         // Dark blue/black background (updated from #1c3144)
    lightRed: "rgba(232, 28, 14, 0.1)", // Transparent red
    darkRed: "#C61000",          // Darker red for hover states
  };

  return (
    <div className="lg:flex lg:w-full lg:justify-center mt-1 lg:mt-20 lg:mb-10">
      <div className="flex flex-col md:flex-row min-h-[600px] overflow-hidden md:rounded-md font-inter lg:shadow-md lg:w-[95%]">
        <div className="w-full md:w-1/2 bg-[#FFFFFF]">
          <img
            src="https://images.pexels.com/photos/6592746/pexels-photo-6592746.jpeg"
            alt="Vendor working on business growth"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 text-[#FFFFFF] p-12 md:p-12 sm:p-6 flex items-center bg-gray-800" >
          <div className="max-w-md mx-auto">
            <span className="block uppercase tracking-wider text-md font-semibold mb-4 text-yellow-400" >
              FOR BUSINESSES
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-[#FFFFFF]">
              Reach Global Customers
            </h2>

            <p className="text-lg text-[#FFFFFF] mb-8 leading-relaxed opacity-80">
              Connect with diaspora communities worldwide seeking services from their home country.
              Showcase, sell, and get paid securely—all in one platform.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400">
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">
                  Direct Access to International Buyers
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400" >
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">Secure Payments Guarantee</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full w-10 h-10 flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-400" >
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">Verified Business Status</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center text-[#FFFFFF] rounded-full py-2 px-6 transition duration-300 ease-in-out shadow-lg hover:-translate-y-1 hover:shadow-xl"
                style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.darkRed})` }}>
                <div className="mr-3 flex items-center">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <button className="bg-transparent border-0 text-[#FFFFFF] font-semibold cursor-pointer">
                  Onboard Your Business
                </button>
              </div>
            </div>

            <div className="text-sm text-[#FFFFFF] flex items-center opacity-80">
              <span className="mr-2" style={{ color: colors.secondary }}>✓</span>
              Join 1000+ Businesses Serving Global Diaspora
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLandingSection;