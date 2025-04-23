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
    <div className="max-w-full lg:h-[80vh] mx-auto lg:mx-10 bg-gradient-to-br from-gray-50 to-yellow-300 shadow-2xl lg:rounded-lg overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-80 lg:h-[80vh] relative bg-white">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-700/30 to-yellow-400/30 z-10 mix-blend-overlay"></div>
          <img
            src="pexels-photo-3810792.jpeg"
            alt="Business team collaborating"
            className="absolute inset-0 w-full h-full object-cover filter grayscale-[15%] brightness-95 transition-all duration-500 ease-in-out"
            loading="lazy"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 lg:h-[80vh] bg-gray-800 p-8 md:p-10 relative lg:flex lg:gap-1 lg:flex-col lg:justify-center">
          <div className="h-2 w-full absolute top-0 left-0 bg-gradient-to-r from-red-700 via-red-500 to-yellow-500"></div>

          <div className="lg:flex lg:flex-col">
            <h2 className="text-3xl font-bold mt-2 mb-4 lg:mb-2 text-white">
              <span className="bg-gradient-to-r from-red-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Forging Bonds,
              </span>{" "}
              Delivering Trust
            </h2>

            <p className="text-white mb-8 opacity-90">
              Marbo Global connects international communities with trusted local sellers — making commerce seamless, safe, and borderless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            <Feature
              icon={<Package className="w-6 h-6 text-gray-900" />}
              title="Buying Power"
              description="Access home markets directly, negotiate better rates, and secure every purchase."
            />
            <Feature
              icon={<Truck className="w-6 h-6 text-gray-900" />}
              title="Family Gateway"
              description="Let family shop locally — you pay remotely. Simple and connected."
            />
            <Feature
              icon={<Shield className="w-6 h-6 text-gray-900" />}
              title="Trusted Payments"
              description="Pay only when goods are delivered. Our escrow system keeps it fair."
            />
            <Feature
              icon={<ShoppingBag className="w-6 h-6 text-gray-900" />}
              title="Boost Your Business"
              description="Showcase locally, sell globally. Reach buyers worldwide with ease."
            />
          </div>

          <Link
            to="/services"
            className="inline-flex items-center w-fit px-6 py-3 bg-gradient-to-r from-red-700 via-red-600 to-red-500 text-white font-medium rounded-lg shadow-lg hover:shadow-red-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            Unlock Opportunities
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>

          <div className="mt-6 flex items-center text-white text-sm opacity-90">
            <Check className="mr-2 text-yellow-400 w-5 h-5" />
            Global commerce with local peace of mind
          </div>
        </div>
      </div>
    </div>
  );
};

const Feature = ({ icon, title, description }) => (
  <div className="flex items-start space-x-3 group hover:translate-y-[-4px] transition-all duration-300">
    <div className="p-2 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-lg shadow-md group-hover:shadow-yellow-400/30 group-hover:shadow-lg transition-all duration-300">
      {icon}
    </div>
    <div>
      <h3 className="text-white font-medium mb-2 text-left">{title}</h3>
      <p className="text-white text-sm opacity-80 text-left">{description}</p>
    </div>
  </div>
);

export default AboutSection;
