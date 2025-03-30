import { ArrowRight } from 'lucide-react';

const VendorLandingSection = () => {
  return (
    <div className='lg:flex lg:w-full lg:justify-center mt-1 lg:mt-20 lg:mb-20'>
      <div className="flex flex-col md:flex-row min-h-[600px] overflow-hidden rounded-md font-inter lg:shadow-md lg:w-[90%]">
        <div className="w-full md:w-1/2 bg-[#FFFFFF]">
          <img
src='https://images.pexels.com/photos/6592746/pexels-photo-6592746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'            alt="Vendor working on business growth"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 bg-[#646965] text-[#FFFFFF] p-12 md:p-12 sm:p-6 flex items-center">
          <div className="max-w-md mx-auto">
            <span className="block uppercase tracking-wider text-sm opacity-70 mb-4 text-[#FD1A03]">
              For Vendors
            </span>

            <h2 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-[#FFFFFF]">
              Grow Your Business Effortlessly
            </h2>

            <p className="text-lg text-[#FFFFFF] mb-8 leading-relaxed opacity-80">
              Unlock flexible pricing plans designed to scale your business with zero overhead and maximum potential.
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="bg-[#FD1A03] bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center">
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">Transparent, Scalable Pricing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#FD1A03] bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center">
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">24/7 Premium Support</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-[#FD1A03] bg-opacity-10 rounded-full w-10 h-10 flex items-center justify-center">
                  <ArrowRight className="text-[#FFFFFF] w-5 h-5" />
                </div>
                <span className="text-[#FFFFFF]">No Hidden Fees</span>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center bg-gradient-to-r from-[#FD1A03] to-[#FCE6A6] text-[#FFFFFF] rounded-full py-2 px-6 transition duration-300 ease-in-out shadow-lg hover:-translate-y-1 hover:shadow-xl">
                <div className="mr-3 flex items-center">
                  <ArrowRight className="w-5 h-5" />
                </div>
                <button className="bg-transparent border-0 text-[#FFFFFF] font-semibold cursor-pointer">
                  View Pricing Plans
                </button>
              </div>
            </div>

            <div className="text-sm text-[#FFFFFF] flex items-center opacity-80">
              <span className="mr-2 text-[#FD1A03]">✓</span>
              Trusted by 500+ Successful Vendors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLandingSection;