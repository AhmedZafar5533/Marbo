import { useState, useEffect } from 'react';
import { useSubscriptionStore } from '../../Store/subscriptionStore';
import { useNavigate } from 'react-router-dom';


const subscriptionTiers = [
  {
    name: "Basic Ads",
    type: "Basic",
    tier: "Free",
    priceMonthly: 4.99,
    priceAnnual: 49.99,
    features: [
      "100 ad impressions daily",
      "Basic analytics dashboard",
      "Limited audience targeting"
    ]
  },
  {
    name: "Premium Ads",
    type: "Premium",
    tier: "Pro",
    priceMonthly: 9.99,
    priceAnnual: 99.99,
    features: [
      "Unlimited ad impressions",
      "Advanced targeting options",
      "Priority ad placement"
    ]
  },
  {
    name: "Diamond Ads",
    type: "Diamond",
    tier: "Business",
    priceMonthly: 29.99,
    priceAnnual: 299.99,
    features: [
      "Custom ad campaigns",
      "Multi-channel ad management",
      "Dedicated ad strategist"
    ]
  }
];

const PricingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);
  const { setSubscriptionInfo } = useSubscriptionStore();
  const naviagete = useNavigate()

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubscriptionSelection = (subscriptionType, price) => {
    const selectedTier = subscriptionTiers.find(tier => tier.type === subscriptionType);
    if (!selectedTier) return;

    setSubscriptionInfo({
      type: subscriptionType,
      price: isAnnual ? selectedTier.priceAnnual : selectedTier.priceMonthly,
      billing: isAnnual ? 'Annual' : 'Monthly',
      features: selectedTier.features,
    });
    naviagete('/checkout/subscription')
  };


  return (
    <div className="max-w-7xl mx-auto px-5 bg-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Decorative blob in red-yellow */}
      <div className={`absolute top-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-gradient-radial from-red-600/10 via-red-600/5 to-white/0 opacity-0 transition-opacity duration-1000 ease-in-out z-0 ${isLoaded ? 'opacity-100' : ''}`}></div>

      <main className={`text-center flex-grow pb-20 relative z-10 opacity-0 translate-y-5 transition-all duration-800 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent inline-block relative after:content-[''] after:absolute after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-red-600 after:to-yellow-500 after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:rounded-md">
          Choose your ad plan
        </h1>
        <p className="text-xl text-gray-700 mb-16 max-w-xl mx-auto">
          Amplify your brand with powerful advertising solutions
        </p>

        <div className="flex justify-center mb-10">
          <div className="bg-gray-100 p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isAnnual ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAnnual ? 'bg-red-600 text-white' : 'bg-transparent text-gray-700'}`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center perspective-1000">
          {/* Basic Card */}
          <div
            className={`bg-gray-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-gray-200 transition-all duration-400 transform-gpu opacity-0 animate-[cardAppear_0.5s_forwards_0.1s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 0 ? 'border-red-600 -translate-y-3 scale-103 shadow-xl shadow-red-600/15 z-30' : ''}`}
            onMouseEnter={() => setActiveCard(0)}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Basic Ads</h2>
                <div className="text-xs font-semibold py-1 px-3 rounded-full bg-red-600/10 text-red-600">Free</div>
              </div>
              <p className="text-sm text-gray-700 h-20 mb-5">
                Get started with essential advertising tools for small businesses and startups.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-gray-800">
                <span className="text-2xl mr-1">$</span>
                <span className="text-5xl leading-none">{isAnnual ? '49.99' : '4.99'}</span>
                <span className="text-sm text-gray-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() => handleSubscriptionSelection('Basic', 4.99)}
                className="w-full py-3 rounded-full border border-gray-200 bg-transparent text-gray-800 font-medium mb-6 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-red-600/10 hover:-translate-y-0.5 group"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="text-left mt-auto space-y-4">
                {['100 ad impressions daily', 'Basic analytics dashboard', 'Limited audience targeting'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-300">
                    <span className="text-red-600 mr-3 font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Premium Card */}
          <div
            className={`bg-gray-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-red-600 transition-all duration-400 transform-gpu shadow-lg shadow-red-600/10 z-20 opacity-0 animate-[cardAppear_0.5s_forwards_0.2s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 1 ? 'border-red-600 -translate-y-3 scale-103 shadow-xl shadow-red-600/15 z-30' : ''}`}
            onMouseEnter={() => setActiveCard(1)}
          >
            <div className="absolute top-3 right-3 bg-gradient-to-r from-red-600 to-yellow-500 text-white text-xs font-semibold py-1 px-3 rounded-full z-10 shadow-md animate-[badgePulse_2s_infinite]">
              <span>Popular</span>
            </div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Premium Ads</h2>
                <div className="text-xs mt-4 font-semibold py-1 px-3 rounded-full bg-red-600/10 text-red-600">Pro</div>
              </div>
              <p className="text-sm text-gray-700 h-20 mb-5">
                Advanced advertising solutions for growing businesses seeking better engagement and reach.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-gray-800">
                <span className="text-2xl mr-1">$</span>
                <span className="text-5xl leading-none">{isAnnual ? '99.99' : '9.99'}</span>
                <span className="text-sm text-gray-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() => handleSubscriptionSelection('Premium', 9.99)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-red-600 to-yellow-500 text-white font-medium mb-6 transition-all duration-300 flex justify-center items-center gap-2 group hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="text-left mt-auto space-y-4">
                {['Unlimited ad impressions', 'Advanced targeting options', 'Priority ad placement'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-300">
                    <span className="text-red-600 mr-3 font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Diamond Card */}
          <div
            className={`bg-gray-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-gray-200 transition-all duration-400 transform-gpu opacity-0 animate-[cardAppear_0.5s_forwards_0.3s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 2 ? 'border-red-600 -translate-y-3 scale-103 shadow-xl shadow-red-600/15 z-30' : ''}`}
            onMouseEnter={() => setActiveCard(2)}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Diamond Ads</h2>
                <div className="text-xs font-semibold py-1 px-3 rounded-full bg-red-600/10 text-red-600">Business</div>
              </div>
              <p className="text-sm text-gray-700 h-20 mb-5">
                Full-service advertising strategy with custom campaigns for large brands and agencies.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-gray-800">
                <span className="text-5xl leading-none">{isAnnual ? '299.99' : '29.99'}</span>
                <span className="text-sm text-gray-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() => handleSubscriptionSelection('Diamond', 29.99)}
                className="w-full py-3 rounded-full border border-gray-200 bg-transparent text-gray-800 font-medium mb-6 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-red-600/10 hover:-translate-y-0.5"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="text-left mt-auto space-y-4">
                {['Custom ad campaigns', 'Multi-channel ad management', 'Dedicated ad strategist'].map((feature, i) => (
                  <li key={i} className="flex items-center text-gray-700 hover:text-red-600 transition-colors duration-300">
                    <span className="text-red-600 mr-3 font-bold">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes cardAppear { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes badgePulse { 0% { box-shadow: 0 4px 8px rgba(255, 165, 0, 0.2); } 50% { box-shadow: 0 4px 12px rgba(255, 165, 0, 0.4); } 100% { box-shadow: 0 4px 8px rgba(255, 165, 0, 0.2); } }
      `}</style>
    </div>
  );
};

export default PricingPage;
