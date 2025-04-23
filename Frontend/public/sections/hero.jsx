import { useRef, useEffect, useState } from 'react';

const HeroSection = () => {
  const titleRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const text = "Empowering Global Connections";
    let index = 0;

    const typeWriter = () => {
      if (titleRef.current) {
        if (index <= text.length) {
          titleRef.current.innerText = text.substring(0, index);
          index++;
          setTimeout(() => requestAnimationFrame(typeWriter), 40);
        } else {
          const periodSpan = document.createElement('span');
          periodSpan.className = 'animate-pulse text-orange-600 font-bold';
          periodSpan.textContent = '.';
          titleRef.current.appendChild(periodSpan);
        }
      }
    };

    const animationDelay = setTimeout(() => {
      requestAnimationFrame(typeWriter);
    }, 200);

    return () => clearTimeout(animationDelay);
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchValue);
  };

  const renderFloatingProfiles = () => {
    const profiles = [
      { top: '15%', left: '8%', bg: 'bg-gradient-to-br from-orange-500 to-red-600', delay: '0s' },
      { top: '75%', left: '12%', bg: 'bg-gradient-to-br from-amber-200 to-yellow-300', delay: '1s' },
      { top: '25%', right: '12%', bg: 'bg-gradient-to-br from-slate-600 to-gray-700', delay: '2s' },
      { top: '68%', right: '8%', bg: 'bg-gradient-to-br from-orange-500 to-red-600', delay: '1.5s' },
      { top: '8%', left: '32%', bg: 'bg-gradient-to-br from-amber-200 to-yellow-300', delay: '0.5s' },
      { top: '80%', right: '28%', bg: 'bg-gradient-to-br from-slate-600 to-gray-700', delay: '2.5s' }
    ];

    return profiles.map((profile, index) => (
      <div
        key={index}
        className={`absolute w-20 h-20 rounded-full shadow-lg transition-all duration-500 ease-in-out hover:scale-110 hover:z-10 animate-float opacity-90 hidden lg:block ${profile.bg}`}
        style={{
          top: profile.top,
          left: profile.left,
          right: profile.right,
          animationDelay: profile.delay,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white">
          <img
            src={`/api/placeholder/${80}/${80}`}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    ));
  };

  return (
    <section className="relative py-16 lg:py-24 px-4 md:px-6 text-center overflow-hidden min-h-screen flex flex-col justify-center bg-gradient-to-b from-white via-amber-50 to-orange-50">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-amber-100 opacity-20 transform -skew-y-6"></div>
        <div className="absolute top-0 right-0 w-2/3 h-full bg-orange-100 opacity-30 rounded-bl-full transform -translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-slate-100 opacity-30 rounded-tr-full transform translate-x-1/4"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-300 to-amber-200 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-400 to-slate-300 opacity-20 rounded-full blur-3xl"></div>

      {/* Floating Profile Elements */}
      <div className="absolute w-full h-full top-0 left-0 z-0 overflow-hidden">
        {renderFloatingProfiles()}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Mobile Profiles */}
        <div className="flex justify-center gap-4 mb-8 lg:hidden">
          {[1, 2, 3].map((_, index) => (
            <div
              key={index}
              className={`w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md ${index === 1 ? '-mt-6' : index === 2 ? '-mt-2' : 'mt-0'
                } ${index === 0 ? 'bg-gradient-to-br from-orange-500 to-red-600' :
                  index === 1 ? 'bg-gradient-to-br from-amber-200 to-yellow-300' :
                    'bg-gradient-to-br from-slate-600 to-gray-700'
                }`}
            >
              <img
                src={`/api/placeholder/${64}/${64}`}
                alt="Profile"
                className="w-full h-full object-cover opacity-90"
              />
            </div>
          ))}
        </div>

        {/* Title and Description */}
        <div className="mb-10 lg:mb-12">
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif tracking-wider text-orange-600 mb-6"
          ></h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
            Build your network, grow your business, and support your community with our global marketplace
          </p>
        </div>

        {/* Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="mb-10 max-w-2xl mx-auto"
        >
          <div
            className={`relative flex flex-col sm:flex-row bg-white bg-opacity-80 backdrop-blur-sm rounded-tl-2xl rounded-br-2xl border border-amber-200 p-2 pl-5 transition-all duration-300 ${isSearchFocused ? 'shadow-xl -translate-y-1' : 'shadow-md'}`}
          >
            <input
              ref={searchInputRef}
              type="text"
              placeholder="What are you looking for today?"
              value={searchValue}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="flex-1 py-3 border-none outline-none text-base bg-transparent text-slate-700 w-full"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 mt-2 sm:mt-0 rounded-xl flex items-center justify-center gap-2 font-semibold hover:from-orange-600 hover:to-red-700 hover:shadow-md transition-all w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-16">
          <a
            href="/market"
            className="group relative overflow-hidden px-8 py-4 rounded-tl-xl rounded-br-xl uppercase font-bold text-base bg-gradient-to-r from-amber-200 to-yellow-300 text-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10">Explore</span>
            <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-yellow-400 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </a>
          <a
            href="/redirect"
            className="group relative overflow-hidden px-8 py-4 rounded-tl-xl rounded-br-xl uppercase font-bold text-base bg-white bg-opacity-70 backdrop-blur-sm text-orange-600 border-2 border-orange-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10">Join Now</span>
            <span className="absolute inset-0 bg-orange-50 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
          </a>
        </div>

        {/* Trusted By Section */}
        <div className="relative z-10">
          <p className="text-sm text-slate-600 mb-6 uppercase tracking-wider font-medium">Trusted by top businesses worldwide</p>
          <div className="flex justify-center items-center gap-8 lg:gap-12 flex-wrap">
            {[1, 2, 3, 4, 5].map((logo) => (
              <div
                key={logo}
                className="w-20 sm:w-24 lg:w-32 h-10 bg-white bg-opacity-60 backdrop-blur-sm border border-slate-200 rounded-lg opacity-70 hover:opacity-100 hover:shadow-md transition-all duration-300 flex items-center justify-center"
              >
                <span className="text-slate-400 text-xs">LOGO</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-15px) rotate(3deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          75% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 15s infinite ease-in-out;
        }
        `}
      </style>
    </section>
  );
};

export default HeroSection;