import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const titleRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const text = "Global Connections, Local Trust";
    let index = 0;

    const typeWriter = () => {
      if (titleRef.current) {
        if (index <= text.length) {
          titleRef.current.innerText = text.substring(0, index);
          index++;
          
          setTimeout(() => requestAnimationFrame(typeWriter), 50);
        } else {
          setIsTypingComplete(true);
          const periodSpan = document.createElement("span");
          periodSpan.className = "animate-pulse text-red-600 font-bold";
          periodSpan.innerText = ".";
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
        searchInput.parentElement?.classList.add(
          "transform",
          "-translate-y-2",
          "shadow-lg"
        );
      };

      const handleBlur = () => {
        if (!searchInput.value) {
          searchInput.parentElement?.classList.remove(
            "transform",
            "-translate-y-2",
            "shadow-lg"
          );
        }
      };

      searchInput.addEventListener("focus", handleFocus);
      searchInput.addEventListener("blur", handleBlur);

      return () => {
        clearTimeout(animationDelay);
        searchInput.removeEventListener("focus", handleFocus);
        searchInput.removeEventListener("blur", handleBlur);
      };
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchValue);
  };

  const renderFloatingProfiles = () => {
    const profiles = [

      {
        top: "70%",
        left: "15%",
        bg: "bg-[#E6D08E]",
        img: "https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "1s",
      },
      {
        top: "30%",
        right: "10%",
        bg: "bg-[#646965]",
        img: "https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "2s",
      },

      {
        top: "10%",
        left: "30%",
        bg: "bg-[#E6D08E]",
        img: "https://images.pexels.com/photos/965324/pexels-photo-965324.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "0.5s",
      },
      {
        top: "75%",
        right: "25%",
        bg: "bg-[#646965]",
        img: "https://images.pexels.com/photos/813940/pexels-photo-813940.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "2.5s",
      },
    ];


    return profiles.map((profile, index) => (
      <div
        key={index}
        className="absolute w-20 h-20 rounded-full bg-cover bg-center border-4 border-white shadow-md transition-all duration-500 ease-in-out hover:scale-110 hover:z-20 animate-float hidden md:block"
        style={{
          top: profile.top,
          left: profile.left,
          right: profile.right,
          backgroundImage: `url(${profile.img})`,
          backgroundSize: "cover",
          animationDelay: profile.delay,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
        }}
      />
    ));
  };

  const renderStaticProfiles = () => {
    const mobileProfiles = [
      "https://images.pexels.com/photos/813940/pexels-photo-813940.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    return (
      <div className="flex justify-center -mb-4 mt-8 md:hidden">
        {mobileProfiles.map((img, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-full bg-cover bg-center border-4 border-white shadow-lg transition-transform duration-300 hover:scale-105 ${index === 1 ? "mx-2 z-10" : index === 0 ? "-mr-3 mt-3" : "-ml-3 mt-3"
              }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
            }}
          />
        ))}
      </div>
    );
  };



  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-amber-50">
      {/* Hero Section */}
      <div className="relative py-16 md:py-20 lg:py-10 px-4 md:px-8 text-center min-h-[90vh] flex flex-col justify-center">
        {/* Background pattern */}
        <div className="absolute w-full h-full top-0 left-0 z-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-amber-200 opacity-10 origin-top-left"></div>
          <div className="absolute w-full h-full bg-white bg-opacity-40"></div>
          <div
            className="absolute top-0 right-0 w-1/2 h-full bg-red-500 opacity-5 rounded-bl-3xl"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%)" }}
          ></div>
          {renderFloatingProfiles()}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-0">
          {renderStaticProfiles()}

          <div className="flex justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold ">
              Connecting Across Borders
            </span>
          </div>

          <div className={`heading-container mt-6 md:mt-0 transition-all duration-700 ${isTypingComplete ? 'opacity-100' : 'opacity-90'}`}>
            <h1
              ref={titleRef}
              id="animatedTitle"
              className="inline-block text-4xl sm:text-5xl md:text-6xl font-bold font-['Playfair_Display'] tracking-wider leading-tight text-gray-900"
            >
              Global Connections, Local Trust
            </h1>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-6 mb-8 md:mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
            Marbo Global connects diasporans and global workforce to goods & service providers back home and worldwide. View it, like it, pay it – all on one secure platform.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mb-8 md:mb-10 max-w-3xl mx-auto"
          >
            <div className="relative flex flex-col sm:flex-row bg-white rounded-tl-2xl rounded-br-2xl shadow-xl border border-amber-300/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-1.5 pl-5">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="What service are you looking for today?"
                value={searchValue}
                onChange={handleSearchChange}
                className="flex-1 py-4 border-none outline-none text-lg bg-transparent text-gray-700 w-full placeholder-gray-500/60"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-8 py-3.5 mt-2 sm:mt-0 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-red-700 transition-colors w-full sm:w-auto shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                Search
              </button>
            </div>
          </form>

          <div className="hidden md:flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-6">
            <a
              href="/services"
              className="no-underline relative overflow-hidden px-8 py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-red-600 text-white hover:shadow-2xl hover:-translate-y-1.5 group w-full sm:w-auto text-center transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Explore Services
              </span>
              <span className="absolute inset-0 bg-black bg-opacity-20 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </a>
            <Link
              to="/signup"
              className="no-underline relative overflow-hidden px-8 py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-white text-red-600 hover:shadow-2xl hover:text-white hover:-translate-y-1.5 group border-2 border-red-600 w-full sm:w-auto text-center transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Join Now
              </span>
              <span className="absolute inset-0 bg-red-600 transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </div>
          <div className="md:hidden flex flex-row justify-center items-center font-['alergy'] gap-4 sm:gap-3  mt-6">
            <Link
              to="/services"
              className="no-underline relative overflow-hidden px-5 sm:px-5 py-4 sm:py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-[#FD1A03] text-white hover:shadow-2xl hover:-translate-y-1.5 group w-full sm:w-auto text-center transition-all duration-300"
            >
              <span className="relative z-10">Explore</span>
              <span className="absolute inset-0 bg-black bg-opacity-20 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
            <Link
              to="/redirect"
              className="no-underline relative overflow-hidden px-5 sm:px-5 py-4 sm:py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-white text-[#FD1A03] hover:shadow-2xl hover:text-white hover:-translate-y-1.5 group border-2 border-[#FD1A03] w-full sm:w-auto text-center transition-all duration-300"
            >
              <span className="relative z-10">Join Now</span>
              <span className="absolute inset-0 bg-[#FD1A03] bg-opacity-10 transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100"></span>
            </Link>
          </div>



        </div>
      </div>


      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-float {
          animation: float 10s infinite ease-in-out;
        }
        .animate-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        `}
      </style>
    </section>
  );
};

export default HeroSection;