import React, { useState, useEffect, useCallback, useRef } from "react";

const MainProductPage = () => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("MainProductPage");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("marboWishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [sortOption, setSortOption] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Categories slider ref
  const sliderRef = useRef(null);
  const [showSliderControls, setShowSliderControls] = useState(false);

  const products = [
    {
      id: 1,
      name: "Wireless Earbuds, IPX8",
      description: "Organic, Cotton, Earwax certified",
      price: 89.99,
      rating: 5,
      reviewCount: 121,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Sony",
      stock: 15,
      tags: ["wireless", "waterproof", "bluetooth"],
    },
    {
      id: 2,
      name: "AirPods Max",
      description: "A perfect balance of high-fidelity audio",
      price: 559.99,
      rating: 5,
      reviewCount: 121,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Apple",
      stock: 8,
      tags: ["wireless", "noise-canceling"],
    },
    {
      id: 3,
      name: "Bose BT Earphones",
      description: "Treks with ear profile, zitexed nemerobick",
      price: 289.99,
      rating: 4.5,
      reviewCount: 121,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Bose",
      stock: 12,
      tags: ["wireless", "bluetooth"],
    },
    {
      id: 4,
      name: "VIVEFOX Headphones",
      description: "Wired Stereo Headset With Mic",
      price: 39.99,
      rating: 5,
      reviewCount: 121,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "VIVEFOX",
      stock: 23,
      tags: ["wired", "microphone"],
    },
    {
      id: 5,
      name: "JBL TUNE 600BTNC",
      description: "Premium Bass Cancelation Open Ear Bluetooth",
      price: 129.99,
      rating: 4.5,
      reviewCount: 89,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "JBL",
      stock: 17,
      tags: ["wireless", "noise-canceling"],
    },
    {
      id: 6,
      name: "Sony WH-1000XM4",
      description: "Wireless Noise Canceling Overhead Headphones",
      price: 349.99,
      rating: 5,
      reviewCount: 245,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Sony",
      stock: 9,
      tags: ["wireless", "noise-canceling", "premium"],
    },
    {
      id: 7,
      name: "Sennheiser HD 450BT",
      description: "Bluetooth 5.0 Wireless Headphone",
      price: 199.99,
      rating: 4.5,
      reviewCount: 156,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Sennheiser",
      stock: 14,
      tags: ["wireless", "bluetooth"],
    },
    {
      id: 8,
      name: "Beats Studio3",
      description: "Wireless Noise Cancelling Over-Ear Headphones",
      price: 279.99,
      rating: 4,
      reviewCount: 178,
      image: "/api/placeholder/300/300",
      category: 1,
      brand: "Beats",
      stock: 11,
      tags: ["wireless", "noise-canceling"],
    },
    // Added more products
    {
      id: 9,
      name: "MacBook Pro 16",
      description: "Apple M2 Pro chip with 10-core CPU",
      price: 2499.99,
      rating: 5,
      reviewCount: 89,
      image: "/api/placeholder/300/300",
      category: 2,
      brand: "Apple",
      stock: 6,
      tags: ["laptop", "premium"],
    },
    {
      id: 10,
      name: "Dell XPS 15",
      description: "12th Gen Intel Core i7, 16GB RAM, 512GB SSD",
      price: 1799.99,
      rating: 4.5,
      reviewCount: 143,
      image: "/api/placeholder/300/300",
      category: 2,
      brand: "Dell",
      stock: 8,
      tags: ["laptop", "premium"],
    },
  ];

  // Categories data
  const categories = [
    {
      id: 1,
      name: "Headphones",
      icon: "headphones",
      image:
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D",
      count: 8,
    },
    {
      id: 2,
      name: "Laptops",
      icon: "laptop",
      image:
        "https://plus.unsplash.com/premium_photo-1681566925246-cc584a44d7fe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bGFwdG9wc3xlbnwwfHwwfHx8MA%3D%3D",
      count: 12,
    },
    {
      id: 3,
      name: "Smartphones",
      icon: "mobile",
      image:
        "https://plus.unsplash.com/premium_photo-1680985551022-ad298e8a5f82?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bW9iaWxlfGVufDB8fDB8fHww",
      count: 15,
    },
    {
      id: 4,
      name: "TVs",
      icon: "tv",
      image:
        "https://images.unsplash.com/photo-1558888401-3cc1de77652d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRlbGV2aXNpb258ZW58MHx8MHx8fDA%3D",
      count: 7,
    },
    {
      id: 5,
      name: "Gaming",
      icon: "gamepad",
      image:
        "https://images.unsplash.com/photo-1690467536647-7bc8f3813402?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDExfHx8ZW58MHx8fHx8",
      count: 10,
    },
    {
      id: 6,
      name: "Home Devices",
      icon: "home",
      image:
        "https://images.unsplash.com/photo-1618941716939-553df3c6c278?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGZhbnxlbnwwfHwwfHx8MA%3D%3D",
      count: 9,
    },
  ];


  const BestSellingStores = () => {
    const stores = [
      {
        id: 'belibeli',
        name: 'BeliBeli Mall',
        tagline: 'Shop, Explore, Delight and Experience Mall Magic!',
        logo: null,
        featured: true,
        products: []
      },
      {
        id: 'nike',
        name: 'Nike Sae Mall',
        tagline: '"Just do it bro!"',
        logo: 'N',
        featured: false,
        products: [
          { image: '/api/placeholder/80/80', price: 'Rp650.000' },
          { image: '/api/placeholder/80/80', price: 'Rp270.000' },
          { image: '/api/placeholder/80/80', price: 'Rp99.000' }
        ]
      },
      {
        id: 'barudak',
        name: 'Barudak Disaster Mall',
        tagline: '"Unleash Your Fashion"',
        logo: 'B',
        featured: false,
        products: [
          { image: '/api/placeholder/80/80', price: 'Rp324.000' },
          { image: '/api/placeholder/80/80', price: 'Rp199.000' },
          { image: '/api/placeholder/80/80', price: 'Rp120.000' }
        ]
      },
      {
        id: 'galaxy',
        name: 'Galaxy Galleria Mall',
        tagline: '"Be Extraordinary"',
        logo: 'G',
        featured: false,
        products: [
          { image: '/api/placeholder/80/80', price: 'Rp179.000' },
          { image: '/api/placeholder/80/80', price: 'Rp199.000' },
          { image: '/api/placeholder/80/80', price: 'Rp253.000' }
        ]
      },
      {
        id: 'aurora',
        name: 'Aurora Well Mall',
        tagline: '"Chic, Bold, Confident"',
        logo: 'A',
        featured: false,
        products: [
          { image: '/api/placeholder/80/80', price: 'Rp250.000' },
          { image: '/api/placeholder/80/80', price: 'Rp162.000' },
          { image: '/api/placeholder/80/80', price: 'Rp255.000' }
        ]
      }
    ];

    return (
      <div className="max-w-6xl mx-auto px-4 py-12 bg-gray-50">
        <div className="flex items-center justify-center mb-10">
          <div className="h-0.5 bg-indigo-300 w-12 mr-4"></div>
          <h2 className="text-3xl font-bold text-gray-800">Best Selling Stores</h2>
          <div className="h-0.5 bg-indigo-300 w-12 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Mall Card (BeliBeli) */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-indigo-100 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative h-full flex flex-col">
              <div className="absolute top-4 right-4 bg-indigo-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                Featured
              </div>
              <div className="p-6 flex-grow flex flex-col justify-center items-center text-center">
                <div className="mb-4 w-full">
                  <img
                    src="/api/placeholder/400/250"
                    alt="Shopping bags"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mt-4">{stores[0].name}</h3>
                <p className="text-md text-gray-600 mt-2 italic">{stores[0].tagline}</p>
                <button className="mt-6 bg-indigo-700 hover:bg-indigo-800 text-white py-2 px-6 rounded-full font-medium transition-all duration-200 flex items-center">
                  Visit Store
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Regular Mall Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.slice(1).map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm">
                      {store.logo}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{store.name}</h3>
                      <p className="text-sm text-gray-500">{store.tagline}</p>
                    </div>
                    <div className="ml-auto">
                      <div className="bg-indigo-100 rounded-full w-8 h-8 flex items-center justify-center">
                        <svg className="w-5 h-5 text-indigo-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-5">
                    {store.products.map((product, index) => (
                      <div key={index} className="flex flex-col items-center group">
                        <div className="bg-gray-50 rounded-lg overflow-hidden w-full aspect-square relative">
                          <img src={product.image} alt="Product" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-indigo-700 bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        </div>
                        <span className="text-sm font-medium mt-2 text-gray-800">{product.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 text-center">
                    <button className="text-indigo-700 hover:text-indigo-900 text-sm font-medium flex items-center mx-auto transition-all duration-200">
                      View all products
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  // Persist cart and wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("MainProductPage", JSON.stringify(cartItems));
  }, [cartItems]);



  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    if (activeCategory) {
      result = result.filter((product) => product.category === activeCategory);
    }

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    if (sortOption === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, activeCategory, sortOption]);

  // Add to cart
  const addToCart = useCallback(
    (product) => {
      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        setCartItems(
          cartItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems([...cartItems, { ...product, quantity: 1 }]);
      }
    },
    [cartItems]
  );


  // Toggle wishlist
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };


  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Render stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <span key={i} className="star-filled">
            ★
          </span>
        );
      } else if (i - 0.5 <= rating) {
        stars.push(
          <span key={i} className="star-filled">
            ✯
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="star-empty">
            ★
          </span>
        );
      }
    }
    return stars;
  };



  // Floating Cart Component
  const FloatingCart = () => (
    <div className="fixed bottom-8 right-8 z-50 animate-fade-in-up">
      <button
        className="bg-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:bg-indigo-800 transition-all duration-300 relative group"
        onClick={() => {/* Add cart panel toggle logic */ }}
      >
        🛒
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center animate-bounce">
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        )}
        <span className="absolute -bottom-12 right-0 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
          View Cart
        </span>
      </button>
    </div>
  );

  // Custom Categories Slider Logic
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === 'next' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <FloatingCart />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="mt-8 mb-16 bg-gradient-to-r from-indigo-700 to-purple-600 rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-center p-8 md:p-12">
            <div className="md:w-1/2 mb-8 md:mb-0 text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Summer Tech Sale
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Up to 40% off on selected premium audio equipment. Limited time offer!
              </p>
              <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-lg">
                Shop Now
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949"
                alt="Headphones"
                className="w-full max-w-md object-contain "
              />
            </div>
          </div>
        </section>

        <section className="mb-16 relative group"
          onMouseEnter={() => setShowSliderControls(true)}
          onMouseLeave={() => setShowSliderControls(false)}>
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-l-4 border-indigo-700 pl-4">
            Popular Categories
          </h2>
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex-shrink-0 w-80"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-full ${activeCategory === category.id
                    ? 'ring-2 ring-indigo-700 bg-indigo-50'
                    : ''
                    }`}>
                    <div className="relative h-48 overflow-hidden rounded-t-xl">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {category.name}
                        {activeCategory === category.id && (
                          <span className="ml-2 text-indigo-700">• Active</span>
                        )}
                      </h3>
                      <p className="text-gray-500 text-sm">{category.count} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Slider Controls */}
            {showSliderControls && (
              <>
                <button
                  onClick={() => scrollSlider('prev')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors -translate-x-1/2"
                >
                  ←
                </button>
                <button
                  onClick={() => scrollSlider('next')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors translate-x-1/2"
                >
                  →
                </button>
              </>
            )}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <span className="text-gray-500">
                Showing {currentProducts.length} of {filteredProducts.length} products
              </span>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200 transition-colors"
                >
                  Clear Filter ({categories.find(c => c.id === activeCategory)?.name})
                  <span className="ml-2">×</span>
                </button>
              )}
            </div>
            <div className="text-gray-500">
              Showing {currentProducts.length} of {filteredProducts.length} products
            </div>
            <select
              className="w-full sm:w-48 bg-white border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-700 focus:border-transparent"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rating</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 relative">
                <button
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'
                    } hover:text-red-500 transition-colors`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  {wishlist.includes(product.id) ? '❤' : '♡'}
                </button>

                <div className="h-64 bg-gray-50 flex items-center justify-center p-6 relative">
                  {product.stock < 5 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Only {product.stock} left!
                    </div>
                  )}
                  <img src={product.image} alt={product.name} className="h-48 object-contain" />
                </div>

                <div className="p-6">
                  <div className="text-indigo-700 text-sm font-semibold uppercase mb-2">
                    {product.brand}
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-gray-500 text-sm ml-2">({product.reviewCount})</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</div>
                    <button
                      className="bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors duration-300 shadow-sm"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <button
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => paginate(currentPage - 1)}
              >
                ◀
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${currentPage === i + 1
                    ? 'bg-indigo-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={() => paginate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => paginate(currentPage + 1)}
              >
                ▶
              </button>
            </div>
          )}
        </section>

        {/* Products for You Section */}
        <section className="mb-16">

          <BestSellingStores />

        </section>

      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }
        .animate-bounce {
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

// Add remaining helper functions (renderStars, addToCart, etc.) from previous versions

export default MainProductPage;