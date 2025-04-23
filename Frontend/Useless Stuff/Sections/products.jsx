import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import '../../styles/products.css';

const LandingPageProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const products = [
    {
      id: 1,
      title: "Wireless Noise-Canceling Headphones",
      description: "Experience immersive sound with active noise cancellation and up to 30 hours of battery life.",
      image: "/api/placeholder/400/320",
      category: "Electronics",
      price: 199.99
    },
    {
      id: 2,
      title: "Smartwatch Pro X",
      description: "Stay connected with advanced health tracking, GPS, and seamless smartphone integration.",
      image: "/api/placeholder/400/320",
      category: "Wearables",
      price: 249.99
    },
    {
      id: 3,
      title: "Ergonomic Office Chair",
      description: "Designed for maximum comfort and lumbar support, perfect for long working hours.",
      image: "/api/placeholder/400/320",
      category: "Furniture",
      price: 299.99
    },
    {
      id: 4,
      title: "4K Ultra HD Smart TV",
      description: "Stunning visuals and smart features, including voice control and streaming apps.",
      image: "/api/placeholder/400/320",
      category: "Home Entertainment",
      price: 499.99
    },
    {
      id: 5,
      title: "Gaming Mechanical Keyboard",
      description: "High-performance mechanical switches, customizable RGB lighting, and durable build.",
      image: "/api/placeholder/400/320",
      category: "Gaming",
      price: 129.99
    }
  ];


  const handleScroll = (direction) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const cardWidth = container.querySelector('.product-card').offsetWidth;
      const scrollAmount = direction === 'left'
        ? -cardWidth
        : cardWidth;

      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });

      setCurrentIndex(prev =>
        direction === 'left'
          ? Math.max(0, prev - 1)
          : Math.min(products.length - 1, prev + 1)
      );
    }
  };

  return (
    <div className="netflix-products-container">
      {/* Decorative Background Elements */}
      <div className="background-elements">
        <div className="background-circle-top" />
        <div className="background-circle-bottom" />
      </div>

      <section className="products-section">
        <div className="products-content">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="section-title"
          >
            Featured Products
            <div className="title-underline" />
          </motion.h2>

          <div className="carousel-container">
            {/* Carousel Navigation */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="nav-button nav-button-left"
              onClick={() => handleScroll('left')}
            >
              <ChevronLeft className="nav-icon" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="nav-button nav-button-right"
              onClick={() => handleScroll('right')}
            >
              <ChevronRight className="nav-icon" />
            </motion.button>

            {/* Product Container */}
            <div
              ref={containerRef}
              className="product-container custom-scrollbar"
            >
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1
                    }}
                    viewport={{ once: true }}
                    className="product-card hover-grow"
                  >
                    <div className="product-card-inner">
                      <div
                        className="product-image"
                        style={{ backgroundImage: `url(${product.image})` }}
                      />
                      <div className="product-details">
                        {/* Category Badge */}
                        <span className="category-badge">
                          {product.category}
                        </span>

                        <div className="product-header">
                          <h3 className="product-title">
                            {product.title}
                          </h3>
                          <span className="product-price">
                            ${product.price}
                          </span>
                        </div>

                        <p className="product-description">
                          {product.description}
                        </p>

                        <button className="product-button">
                          <span>View Details</span>
                          <ChevronRight className="button-icon" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Browse More Card */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="browse-more-card hover-grow"
                >
                  <div className="browse-more-inner">
                    <div className="browse-more-icon">
                      <ArrowRight className="icon" />
                    </div>

                    <h3 className="browse-more-title">
                      Explore More
                    </h3>

                    <p className="browse-more-description">
                      Discover our comprehensive range of products and services
                    </p>

                    <button className="browse-more-button">
                      <span>View All Products</span>
                      <ChevronRight className="button-icon" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Carousel Dots */}
            <div className="carousel-dots">
              {products.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`dot ${currentIndex === index ? 'active-dot' : ''}`}
                  onClick={() => {
                    const container = containerRef.current;
                    const cardWidth = container.querySelector('.product-card').offsetWidth;
                    container.scrollTo({
                      left: index * (cardWidth + 32),
                      behavior: 'smooth'
                    });
                    setCurrentIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageProducts;