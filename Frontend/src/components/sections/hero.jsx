import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const titleRef = useRef(null);
  const searchInputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    const text = "Bridging Home and Global Service Providers";
    let index = 0;

    const typeWriter = () => {
      if (titleRef.current) {
        if (index <= text.length) {
          titleRef.current.innerText = text.substring(0, index);
          index++;
          setTimeout(() => requestAnimationFrame(typeWriter), 40);
        } else {
          setIsTypingComplete(true);
          const periodSpan = document.createElement("span");
          periodSpan.className = "animate-pulse text-[#FD1A03] font-bold";
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
        top: "20%",
        left: "10%",
        bg: "bg-[#FD1A03]",
        img: "https://images.pexels.com/photos/904332/pexels-photo-904332.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "0s",
      },
      {
        top: "70%",
        left: "15%",
        bg: "bg-[#E6D08E]",
        img: "https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "1s",
      },
      {
        top: "30%",
        right: "15%",
        bg: "bg-[#646965]",
        img: "https://images.pexels.com/photos/1820919/pexels-photo-1820919.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "2s",
      },
      {
        top: "65%",
        right: "10%",
        bg: "bg-[#FD1A03]",
        img: "https://images.pexels.com/photos/718978/pexels-photo-718978.jpeg?auto=compress&cs=tinysrgb&w=600",
        delay: "1.5s",
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

  // const companyLogos = [
  //   "https://via.placeholder.com/150x50.png?text=Logo1",
  //   "https://via.placeholder.com/150x50.png?text=Logo2",
  //   "https://via.placeholder.com/150x50.png?text=Logo3",
  //   "https://via.placeholder.com/150x50.png?text=Logo4",
  //   "https://via.placeholder.com/150x50.png?text=Logo5",
  // ];

  return (
    <section className="relative py-16 md:py-20 lg:py-24 px-4 md:px-8 text-center overflow-hidden min-h-[90vh] flex flex-col justify-center bg-gradient-to-br from-white to-[#F5F2EA]">
      {/* Background pattern */}
      <div className="absolute w-full h-full top-0 left-0 z-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#E6D08E] opacity-10 origin-top-left"></div>
        <div className="absolute w-full h-full bg-white bg-opacity-40"></div>
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-[#FD1A03] opacity-5 rounded-bl-[200px]"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 30% 100%)" }}
        ></div>
        {renderFloatingProfiles()}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  md:mt-15">
        {renderStaticProfiles()}

        <div className={`heading-container mt-10 md:mt-0 transition-all duration-700 ${isTypingComplete ? 'opacity-100' : 'opacity-90'}`}>
          <h1
            ref={titleRef}
            id="animatedTitle"
            className="inline-block text-3xl sm:text-4xl md:text-5xl font-bold font-['Playfair_Display'] tracking-wider leading-tight text-[#FD1A03]"
          >
            Bridging Home and Global Service Providers
          </h1>
        </div>

        <p className="text-base sm:text-lg md:text-xl font-['alergy'] text-[#646965] mt-6 mb-8 md:mb-10 max-w-[800px] mx-auto leading-relaxed opacity-90">
          We bridge the gap between diasporans, their loved ones, and global service providers—fostering trust and growth across borders.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="mb-8 md:mb-10 max-w-[700px] mx-auto"
        >
          <div className="relative flex flex-col sm:flex-row bg-white rounded-tl-2xl rounded-br-2xl shadow-xl border border-[#E6D08E]/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-1.5 pl-5">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="What are you looking for today?"
              value={searchValue}
              onChange={handleSearchChange}
              className="flex-1 py-4 border-none outline-none text-lg bg-transparent text-[#646965] w-full placeholder-[#646965]/60"
            />
            <button
              type="submit"
              className="bg-[#FD1A03] text-white px-8 py-3.5 mt-2 sm:mt-0 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-opacity-90 transition-colors w-full sm:w-auto shadow-md"
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

        <div className="flex justify-center items-center font-['alergy'] gap-4 sm:gap-6 mt-6">
          <Link
            to="/market"
            className="no-underline relative overflow-hidden px-8 sm:px-10 py-4 sm:py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-[#FD1A03] text-white hover:shadow-2xl hover:-translate-y-1.5 group w-full sm:w-auto text-center transition-all duration-300"
          >
            <span className="relative z-10">Explore</span>
            <span className="absolute inset-0 bg-black bg-opacity-20 transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
          <Link
            to="/redirect"
            className="no-underline relative overflow-hidden px-8 sm:px-10 py-4 sm:py-4 rounded-tl-2xl rounded-br-2xl uppercase font-semibold text-base sm:text-lg cursor-pointer bg-white text-[#FD1A03] hover:shadow-2xl hover:text-white hover:-translate-y-1.5 group border-2 border-[#FD1A03] w-full sm:w-auto text-center transition-all duration-300"
          >
            <span className="relative z-10">Join Now</span>
            <span className="absolute inset-0 bg-[#FD1A03] bg-opacity-10 transform scale-x-0 origin-right transition-transform duration-300 group-hover:scale-x-100"></span>
          </Link>
        </div>
      </div>

      <div className="mt-16 md:mt-25 relative z-10">
        <p className="text-sm sm:text-base text-[#646965] mb-6 uppercase tracking-wider font-semibold">
          Trusted by top businesses worldwide
        </p>
        {/* <div className="flex justify-center items-center gap-6 sm:gap-10 flex-wrap px-4 max-w-6xl mx-auto">
          {companyLogos.map((logo, index) => (
            <div
              key={index}
              className="w-24 sm:w-32 md:w-40 h-12 md:h-16 bg-white rounded-lg shadow-sm flex items-center justify-center p-2 opacity-70 hover:opacity-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-md group"
            >
              <img src={logo} alt={`Partner logo ${index + 1}`} className="max-w-full max-h-full transition-all duration-500 grayscale group-hover:grayscale-0" />
            </div>
          ))}
        </div> */}
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