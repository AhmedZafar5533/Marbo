import {
  ArrowRight,
  Check,
  Package,
  Truck,
  Shield,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <div className="max-w-full lg:h-[80vh] mx-auto lg:mx-10 bg-gradient-to-br from-white to-[#E6D08E] shadow-2xl lg:rounded-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-80 lg:h-[80vh] relative bg-[#FFFFFF]">
          <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(253,26,3,0.2)] to-[rgba(252,230,166,0.2)] z-10 mix-blend-overlay"></div>
          <img
            src="https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg"
            alt="Business team collaborating"
            className="absolute inset-0 w-full h-full object-cover filter grayscale-[15%] brightness-90"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 lg:h-[80vh] bg-[#1c3144] p-8 md:p-10 relative lg:flex lg:gap-1 lg:flex-col lg:justify-center">  <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-[#FD1A03] to-[#FCE6A6]"></div>

          <div className="lg:flex lg:flex-col">
            <h2 className="text-3xl font-bold mt-2 mb-4 lg:mb-2 text-[#FFFFFF]">
              <span className="bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] bg-clip-text text-transparent">
                Empowering Connections
              </span>{" "}
              for a Better Tomorrow
            </h2>

            <p className="text-[#FFFFFF] mb-8 opacity-80">
              Marbo Global is your gateway to a seamless network—connecting trusted service providers with individuals and families worldwide, delivering exceptional value through strategic partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-[#FD1A03] rounded-lg shadow-md">
                <Package className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div className="w-full">
                <h3 className="text-[#FFFFFF] font-medium mb-2 text-left">
                  Quality Service
                </h3>
                <p className="text-[#FFFFFF] text-sm opacity-70 text-left">
                  Meticulously crafted solutions that exceed industry standards and client expectations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] rounded-lg shadow-md">
                <Truck className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div className="w-full">
                <h3 className="text-[#FFFFFF] font-medium mb-1 text-left">
                  Expert Services
                </h3>
                <p className="text-[#FFFFFF] text-sm opacity-70 text-left">
                  A curated network of top-tier professionals delivering precision and expertise.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] rounded-lg shadow-md">
                <Shield className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div className="w-full">
                <h3 className="text-[#FFFFFF] font-medium mb-1 text-left">
                  Secure Transactions
                </h3>
                <p className="text-[#FFFFFF] text-sm opacity-70 text-left">
                  Advanced security protocols ensuring trust, confidentiality, and peace of mind.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] rounded-lg shadow-md">
                <ShoppingBag className="w-6 h-6 text-[#FFFFFF]" />
              </div>
              <div className="w-full">
                <h3 className="text-[#FFFFFF] font-medium mb-1 text-left">
                  Innovative Solutions
                </h3>
                <p className="text-[#FFFFFF] text-sm opacity-70 text-left">
                  Cutting-edge approaches tailored to address complex challenges with creative strategies.
                </p>
              </div>
            </div>
          </div>

          <Link
            to="/services"
            className="inline-flex items-center w-fit px-6 py-3 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] text-[#FFFFFF] font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Services Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>

          <div className="mt-6 flex items-center text-[#FFFFFF] text-sm opacity-80">
            <Check className="mr-2 text-[#FD1A03] w-4 h-4" />
            Trusted by Thousands of Clients Worldwide
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
