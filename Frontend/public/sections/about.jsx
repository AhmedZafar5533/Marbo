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
    <div className="max-w-full lg:h-[80vh] mx-auto lg:mx-10 bg-gradient-to-br from-[#F5F5F5] via-[#FAFAFA] to-[#F0F0F0] shadow-2xl lg:rounded-2xl overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="w-full lg:w-1/2 h-80 lg:h-[80vh] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-yellow-500/5 z-10 mix-blend-overlay"></div>
          <img
            src="https://images.pexels.com/photos/3810792/pexels-photo-3810792.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="Business team collaborating"
            className="absolute inset-0 w-full h-full object-cover filter brightness-95 grayscale-[5%]"
          />
        </div>

        {/* Content Section */}
        <div className="w-full lg:w-1/2 lg:h-[80vh] bg-white/95 backdrop-blur-sm p-8 md:p-10 relative lg:flex lg:gap-1 lg:flex-col lg:justify-center">
          <div className="h-1 w-full absolute top-0 left-0 bg-gradient-to-r from-red-600 to-yellow-500"></div>

          <div className="lg:flex lg:flex-col">
            <h2 className="text-3xl font-bold mt-2 mb-4 lg:mb-2 text-gray-900">
              <span className="bg-gradient-to-r from-red-600 to-yellow-500 bg-clip-text text-transparent">
                Empowering Connections
              </span>{" "}
              for a Better Tomorrow
            </h2>

            <p className="text-gray-700 mb-8 leading-relaxed">

            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-left">
            {[
              { 
                icon: Package, 
                title: "Quality Service", 
                description: "Meticulously crafted solutions that exceed industry standards and client expectations.",
                iconBg: "bg-red-50",
                iconText: "text-red-600"
              },
              { 
                icon: Truck, 
                title: "Expert Services", 
                description: "A curated network of top-tier professionals delivering precision and expertise.",
                iconBg: "bg-yellow-50",
                iconText: "text-yellow-700"
              },
              { 
                icon: Shield, 
                title: "Secure Transactions", 
                description: "Advanced security protocols ensuring trust, confidentiality, and peace of mind.",
                iconBg: "bg-red-50",
                iconText: "text-red-600"
              },
              { 
                icon: ShoppingBag, 
                title: "Innovative Solutions", 
                description: "Cutting-edge approaches tailored to address complex challenges with creative strategies.",
                iconBg: "bg-yellow-50",
                iconText: "text-white-600"
              }
            ].map(({ icon: Icon, title, description, iconBg, iconText }) => (
              <div key={title} className="flex items-start space-x-4">
                <div className={`p-3 ${iconBg} ${iconText} rounded-xl shadow-sm`}>
                  <Icon className="w-6 h-6 "  />
                </div>
                <div className="w-full">
                  <h3 className="text-gray-900 font-semibold mb-2 text-left">
                    {title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/services"
            className="inline-flex items-center w-fit px-7 py-3.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore Services Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>

          <div className="mt-6 flex items-center text-gray-600 text-sm">
            <Check className="mr-2 text-red-600 w-5 h-5" />
            Trusted by Thousands of Clients Worldwide
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;