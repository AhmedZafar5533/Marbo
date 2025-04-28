import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const testimonialsData = [
  {
    id: 1,
    quote:
      "Very easy to work with! Was able to quickly get something beautiful and performant up and running in minutes. Straightforward to customize, as well. Dashkit is 🔥!!!",
    name: "Tanya",
    role: "Marbo customer",
    image: "https://images.pexels.com/photos/6422421/pexels-photo-6422421.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    background:
      "https://images.unsplash.com/photo-1740504713072-2b634befcf6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Mnx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    quote:
      "Absolutely love the support and attention to detail. This is exactly what I needed!",
    name: "James",
    role: "Web Developer",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    background:
      "https://images.unsplash.com/photo-1740004731264-3cde5c198cc2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Function to handle next slide
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonialsData.length - 1 ? 0 : prevIndex + 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Function to handle previous slide
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonialsData.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Function to handle dot navigation
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentIndex) {
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentIndex]);

  return (
    <section className="relative py-16 px-4 lg:py-24 overflow-hidden bg-gradient-to-t from-[#FFF] to-[#fffbeb]">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Testimonial Card Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="overflow-hidden relative lg:ml-12">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonialsData.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="w-full flex-shrink-0"
                    >
                      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={testimonial.background}
                            alt="background"
                            className="w-full h-full object-cover transform scale-105 transition-transform duration-700 hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FD1A03]/20"></div>
                          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
                        </div>

                        <div className="px-6 pt-0 pb-10 text-center">
                          <div className="relative -mt-10 mb-6 flex justify-center">
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
                            />
                          </div>

                          <blockquote className="italic text-[#646965] text-lg mb-6 relative">
                            <span className="absolute -top-4 -left-2 text-4xl text-[#FD1A03]/20">"</span>
                            {testimonial.quote}
                            <span className="absolute -bottom-4 -right-2 text-4xl text-[#FD1A03]/20">"</span>
                          </blockquote>

                          <h4 className="font-bold text-xl text-[#FD1A03] mb-1">{testimonial.name}</h4>
                          <p className="text-[#646965]">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-center mt-6 gap-4">
                <button
                
                name="prev"
                  onClick={prevSlide}
                  disabled={isTransitioning}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] text-white flex items-center justify-center shadow-md hover:bg-[#FD1A03]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FD1A03]/40 focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button
                name="next"
                  onClick={nextSlide}
                  disabled={isTransitioning}
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] text-white flex items-center justify-center shadow-md hover:bg-[#FD1A03]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FD1A03]/40 focus:ring-offset-2 disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>

              {/* Pagination Indicator */}
              <div className="flex justify-center gap-2 mt-4">
                {testimonialsData.map((_, index) => (
                  <button
                    name="pagination"
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? "bg-[#FD1A03] w-6" : "bg-[#FD1A03]/30 w-2"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#FD1A03] leading-tight">
              Why Our Customers <span className="text-[#646965]">Love Us</span>
            </h2>

            <p className="text-[#646965] text-lg">
              At Marbo Global, we empower diasporans, their families and friends, and service providers
              with seamless, secure transactions. Whether supporting loved ones or offering services, we make shopping effortless and stress-free.
            </p>

            <div className="space-y-4 mt-6">
              {[
                "Thousands of happy customers worldwide",
                "Effortless buying and selling with secure payments",
                "Dedicated support ensuring a hassle-free experience"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#FCE6A6] text-[#FD1A03] flex items-center justify-center mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <p className="text-[#646965]">{item}</p>
                </div>
              ))}
            </div>
            {/* <a to="/signup"> */}
            <a href="/signup" className="mt-8 px-6 py-3 bg-gradient-to-r from-[#FD1A03] to-[#ec5f4f] text-white font-medium rounded-lg shadow-md hover:bg-[#FD1A03]/80 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FD1A03]/50 focus:ring-offset-2">
              Join us Now
            </a>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;