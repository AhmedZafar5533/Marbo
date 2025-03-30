import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const titleRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');

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
          periodSpan.className = 'animate-fadeIn opacity-0 font-bold';
          periodSpan.textContent = '.';
          titleRef.current.appendChild(periodSpan);
        }
      }
    };

    const animationDelay = setTimeout(() => {
      requestAnimationFrame(typeWriter);
    }, 200);

    const searchInput = searchInputRef.current;
    if (searchInput) {
      const handleFocus = () => {
        searchInput.parentElement?.classList.add('transform', '-translate-y-1.5', 'shadow-lg');
      };

      const handleBlur = () => {
        if (!searchInput.value) {
          searchInput.parentElement?.classList.remove('transform', '-translate-y-1.5', 'shadow-lg');
        }
      };

      searchInput.addEventListener('focus', handleFocus);
      searchInput.addEventListener('blur', handleBlur);

      return () => {
        clearTimeout(animationDelay);
        searchInput.removeEventListener('focus', handleFocus);
        searchInput.removeEventListener('blur', handleBlur);
      };
    }
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
      { top: '20%', left: '10%', bg: 'bg-[#FD1A03]', img: '/path/to/local/image1.jpg', delay: '0s' },
      { top: '70%', left: '15%', bg: 'bg-[#E6D08E]', img: '/path/to/local/image2.jpg', delay: '1s' },
      { top: '30%', right: '15%', bg: 'bg-[#646965]', img: '/path/to/local/image3.jpg', delay: '2s' },
      { top: '65%', right: '10%', bg: 'bg-[#FD1A03]', img: '/path/to/local/image4.jpg', delay: '1.5s' },
      { top: '10%', left: '30%', bg: 'bg-[#E6D08E]', img: '/path/to/local/image5.jpg', delay: '0.5s' },
      { top: '75%', right: '25%', bg: 'bg-[#646965]', img: '/path/to/local/image6.jpg', delay: '2.5s' }
    ];

    return profiles.map((profile, index) => (
      <div
        key={index}
        className="absolute w-20 h-20 rounded-full bg-cover bg-center border-4 border-white shadow-md transition-transform duration-300 ease-in-out hover:scale-110 hover:z-[2] animate-float hidden md:block"
        style={{
          top: profile.top,
          left: profile.left,
          right: profile.right,
          backgroundImage: `url(${profile.img})`,
          backgroundSize: 'cover',
          animationDelay: profile.delay,
          backgroundColor: 'transparent'
        }}
      />
    ));
  };

  const renderStaticProfiles = () => {
    const mobileProfiles = [
      '/path/to/local/mobile-image1.jpg',
      '/path/to/local/mobile-image2.jpg'
    ];

    return (
      <div className="flex justify-center -mb-4 mt-4 md:hidden">
        {mobileProfiles.map((img, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full bg-cover bg-center border-4 border-white shadow-md mx-2 ${index === 0 ? '-mt-4' : 'mt-4'}`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="relative py-12 md:py-16 lg:py-[120px] px-4 md:px-5 text-center rounded-xl overflow-hidden min-h-[80vh] flex flex-col justify-center bg-white">
      <div className="absolute w-full h-full top-0 left-0 z-[1] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#E6D08E] opacity-10 transform -skew-y-6 origin-top-left"></div>
        {renderFloatingProfiles()}
      </div>

      <div className="relative z-[3] max-w-[1200px] mx-auto px-4 sm:px-5 mt-6 md:mt-15">
        {renderStaticProfiles()}

        <div className="heading-container mt-8 md:mt-0">
          <h1
            ref={titleRef}
            id="animatedTitle"
            className="inline-block text-3xl sm:text-4xl md:text-5xl font-bold font-['Playfair_Display'] tracking-wider leading-tight text-[#FD1A03]"
          ></h1>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-['alergy'] text-[#646965] mb-6 md:mb-10 max-w-[700px] mx-auto leading-relaxed">
          Build your network, grow your business, and support your community with our global marketplace
        </p>

        <form onSubmit={handleSearchSubmit} className="mb-6 md:mb-[30px] max-w-[600px] mx-auto">
          <div className="relative flex flex-col sm:flex-row bg-white rounded-tl-xl rounded-br-xl shadow-md border border-[#E6D08E] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 p-1.5 pl-5">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="What are you looking for today?"
              value={searchValue}
              onChange={handleSearchChange}
              className="flex-1 py-3 border-none outline-none text-base bg-transparent text-[#646965] w-full"
            />
            <button
              type="submit"
              className="bg-[#FD1A03] text-white px-6 py-2.5 mt-2 sm:mt-0 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-opacity-90 transition-colors w-full sm:w-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              Search
            </button>
          </div>
        </form>

        <div className="flex  justify-center font-['alergy'] gap-4 sm:gap-5  mt-5">
          <a
            to="/market"
            className="no-underline relative overflow-hidden px-5 sm:px-7 py-3 sm:py-3.5 rounded-mid uppercase font-semibold text-sm sm:text-base cursor-pointer bg-[#F5DE9A] text-[#333] rounded-tl-lg rounded-br-lg hover:shadow-xl hover:-translate-y-1.5 group w-full sm:w-auto text-center"
          >
            Explore
          </a>
          <a
            to="/redirect"
            className="no-underline relative overflow-hidden px-5 sm:px-7 py-3 sm:py-3.5 rounded-mid uppercase font-semibold text-sm sm:text-base cursor-pointer bg-white text-[#FD1A03] rounded-tl-xl rounded-br-xl hover:shadow-xl hover:-translate-y-1.5 group border border-[#FD1A03] w-full sm:w-auto text-center"
          >
            Join Now 
          </a>
        </div>
      </div>

      <div className="mt-10 md:mt-[60px] relative z-[3]">
        <p className="text-xs sm:text-sm text-[#646965] mb-3 sm:mb-5 uppercase tracking-wider">Trusted by top businesses worldwide</p>
        <div className="flex justify-center items-center gap-4 sm:gap-[30px] flex-wrap px-4">
          {[1, 2, 3, 4, 5].map((logo) => (
            <div
              key={logo}
              className="w-16 sm:w-24 md:w-[120px] h-6 sm:h-8 md:h-10 bg-[#646965]/10 rounded-md opacity-70 hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>

      <style>
        {`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-float {
      animation: float 8s infinite ease-in-out;
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s forwards 0.3s;
    }
  `}
      </style>
    </section>
  );
};

export default HeroSection;