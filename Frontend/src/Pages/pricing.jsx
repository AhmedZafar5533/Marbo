import { useState, useEffect } from 'react';
import { useSubscriptionStore } from '../../Store/subscriptionStore';

const PricingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeCard, setActiveCard] = useState(1);
  const [isAnnual, setIsAnnual] = useState(false);
  const { sendSubscriptionRequest } = useSubscriptionStore()

  // useEffect(() => {
  //   console.log('Fetching subscriptions...');
  //   fetchSubscriptions();
  // }, [fetchSubscriptions]);

  useEffect(() => {
    setIsLoaded(true);

  }, []);

  // Function to handle subscription selection
  const handleSubscriptionSelection = (subscriptionType, price, features) => {
    const subscriptionDetails = {
      type: subscriptionType,
      price: isAnnual ? price * 12 : price,
      billing: isAnnual ? 'Annual' : 'Monthly',
      features: features,
      timestamp: new Date().toISOString(),
    };
    sendSubscriptionRequest({
      type: subscriptionType,
      price: isAnnual ? price * 12 : price,
      billing: isAnnual ? 'Annual' : 'Monthly',

    })

  };

  return (
    <div className="max-w-7xl mx-auto px-5 bg-white min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute top-[-300px] right-[-300px] w-[600px] h-[600px] rounded-full bg-gradient-radial from-indigo-700/10 via-indigo-700/5 to-white/0 opacity-0 transition-opacity duration-1000 ease-in-out z-0 ${isLoaded ? 'opacity-100' : ''}`}></div>

      {/* Main content */}
      <main className={`text-center flex-grow pb-20 relative z-10 opacity-0 translate-y-5 transition-all duration-800 ease-out delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-indigo-700 to-indigo-700 bg-clip-text text-transparent inline-block relative after:content-[''] after:absolute after:w-[60px] after:h-1 after:bg-gradient-to-r after:from-indigo-700 after:to-indigo-700 after:bottom-[-8px] after:left-1/2 after:-translate-x-1/2 after:rounded-md">
          Choose your ad plan
        </h1>
        <p className="text-xl text-slate-700 mb-16 max-w-xl mx-auto">
          Amplify your brand with powerful advertising solutions
        </p>

        {/* Pricing toggle */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${!isAnnual ? 'bg-indigo-700 text-white' : 'bg-transparent text-slate-700'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isAnnual ? 'bg-indigo-700 text-white' : 'bg-transparent text-slate-700'
                }`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center perspective-1000">
          {/* Basic Card */}
          <div
            className={`bg-slate-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-slate-200 transition-all duration-400 transform-gpu opacity-0 animate-[cardAppear_0.5s_forwards_0.1s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 0 ? 'border-indigo-700 -translate-y-3 scale-103 shadow-xl shadow-indigo-700/15 z-30' : ''
              }`}
            onMouseEnter={() => setActiveCard(0)}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-900">Basic Ads</h2>
                <div className="text-xs font-semibold py-1 px-3 rounded-full bg-indigo-700/10 text-indigo-700">
                  Free
                </div>
              </div>
              <p className="text-sm text-slate-700 h-20 mb-5">
                Get started with essential advertising tools for small businesses and startups.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-slate-900">
                <span className="text-2xl mr-1">$</span>
                <span className="text-5xl leading-none">{isAnnual ? '49.99' : '4.99'}</span>
                <span className="text-sm text-slate-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() =>
                  handleSubscriptionSelection('Basic', 4.99, [
                    '100 ad impressions daily',
                    'Basic analytics dashboard',
                    'Limited audience targeting',
                  ])
                }
                className="w-full py-3 rounded-full border border-slate-200 bg-transparent text-slate-900 font-medium cursor-pointer mb-6 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-indigo-700/10 hover:-translate-y-0.5 group"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="list-none text-left mt-auto">
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>100 ad impressions daily</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.05s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Basic analytics dashboard</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.1s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Limited audience targeting</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Card */}
          <div
            className={`bg-slate-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-indigo-700 transition-all duration-400 transform-gpu shadow-lg shadow-indigo-700/10 z-20 opacity-0 animate-[cardAppear_0.5s_forwards_0.2s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 1 ? 'border-indigo-700 -translate-y-3 scale-103 shadow-xl shadow-indigo-700/15 z-30' : ''
              }`}
            onMouseEnter={() => setActiveCard(1)}
          >
            <div className="absolute top-3 right-3 bg-gradient-to-r from-indigo-700 to-indigo-700 text-white text-xs font-semibold py-1 px-3 rounded-full z-10 shadow-md shadow-indigo-700/20 animate-[badgePulse_2s_infinite]">
              <span>Popular</span>
            </div>
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-900">Premium Ads</h2>
                <div className="text-xs mt-4 font-semibold py-1 px-3 rounded-full bg-indigo-700/10 text-indigo-700">
                  Pro
                </div>
              </div>
              <p className="text-sm text-slate-700 h-20 mb-5">
                Advanced advertising solutions for growing businesses seeking better engagement and reach.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-slate-900">
                <span className="text-2xl mr-1">$</span>
                <span className="text-5xl leading-none">{isAnnual ? '99.99' : '9.99'}</span>
                <span className="text-sm text-slate-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() =>
                  handleSubscriptionSelection('Premium', 9.99, [
                    'Unlimited ad impressions',
                    'Advanced targeting options',
                    'Priority ad placement',
                  ])
                }
                className="w-full py-3 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-700 text-white font-medium cursor-pointer mb-6 transition-all duration-300 flex justify-center items-center gap-2 relative overflow-hidden hover:shadow-lg hover:shadow-indigo-700/30 hover:-translate-y-0.5 group before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-600 before:ease-out hover:before:left-full"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="list-none text-left mt-auto">
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Unlimited ad impressions</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.05s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Advanced targeting options</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.1s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Priority ad placement</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Diamond Card */}
          <div
            className={`bg-slate-50 rounded-2xl overflow-hidden w-full max-w-xs md:w-80 relative border border-slate-200 transition-all duration-400 transform-gpu opacity-0 animate-[cardAppear_0.5s_forwards_0.3s] hover:-translate-y-2.5 hover:rotate-x-1 hover:rotate-y-1 hover:shadow-xl hover:z-20 ${activeCard === 2 ? 'border-indigo-700 -translate-y-3 scale-103 shadow-xl shadow-indigo-700/15 z-30' : ''
              }`}
            onMouseEnter={() => setActiveCard(2)}
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-slate-900">Diamond Ads</h2>
                <div className="text-xs font-semibold py-1 px-3 rounded-full bg-indigo-700/10 text-indigo-700">
                  Business
                </div>
              </div>
              <p className="text-sm text-slate-700 h-20 mb-5">
                Full-service advertising strategy with custom campaigns for large brands and agencies.
              </p>

              <div className="my-6 font-bold flex items-baseline justify-center text-slate-900">
                <span className="text-5xl leading-none">{isAnnual ? '299.99' : '29.99'}</span>
                <span className="text-sm text-slate-700 ml-1 font-normal">/{isAnnual ? 'year' : 'month'}</span>
              </div>

              <button
                onClick={() =>
                  handleSubscriptionSelection('Diamond', 29.99, [
                    'Custom ad campaigns',
                    'Multi-channel ad management',
                    'Dedicated ad strategist',
                  ])
                }
                className="w-full py-3 rounded-full border border-slate-200 bg-transparent text-slate-900 font-medium cursor-pointer mb-6 transition-all duration-300 flex justify-center items-center gap-2 hover:bg-indigo-700/10 hover:-translate-y-0.5 group"
              >
                Get started
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </button>

              <ul className="list-none text-left mt-auto">
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Custom ad campaigns</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.05s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Multi-channel ad management</span>
                </li>
                <li className="mb-4 text-slate-700 flex items-center transition-transform duration-300 hover:translate-x-1 delay-[0.1s]">
                  <span className="text-indigo-700 mr-3 font-bold inline-flex items-center justify-center w-[18px] h-[18px]">✓</span>
                  <span>Dedicated ad strategist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Keyframes and Animation styles needed for Tailwind */}
      <style jsx global>{`
        @keyframes cardAppear {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes badgePulse {
          0% { box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2); }
          50% { box-shadow: 0 4px 12px rgba(75, 0, 130, 0.4); }
          100% { box-shadow: 0 4px 8px rgba(75, 0, 130, 0.2); }
        }
      `}</style>
    </div>
  );
};

export default PricingPage;