import React, { useState, useEffect, useMemo } from 'react';
import './result.css';
import { Search, Star, Zap, Smartphone, Laptop, Tv, Headphones, Gamepad, Home } from 'lucide-react';

const ProductSearchResults = () => {
  const [sortBy, setSortBy] = useState('Best match');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Enhanced sample product data for tech products
  const allProducts = useMemo(() => [
    {
      id: 1,
      name: 'Sony WH-1000XM5',
      category: 'Headphones',
      features: ['Noise Cancelling', 'Wireless', '30h Battery'],
      price: 349.99,
      image: '/images/sony-headphones.jpg',
      special: true,
      rating: 4.8
    },
    {
      id: 2,
      name: 'MacBook Pro M3',
      category: 'Laptops',
      features: ['Apple M3 Chip', '16GB RAM', '512GB SSD'],
      price: 1999.00,
      image: '/images/macbook-pro.jpg',
      special: false,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'Smartphones',
      features: ['256GB Storage', '8K Video', 'AI Features'],
      price: 1199.99,
      image: '/images/samsung-s24.jpg',
      special: true,
      rating: 4.7
    },
    {
      id: 4,
      name: 'LG C3 OLED 65"',
      category: 'TVs',
      features: ['4K', 'OLED', 'Game Optimizer'],
      price: 1496.99,
      image: '/images/lg-c3.jpg',
      special: false,
      rating: 4.8
    },
    {
      id: 5,
      name: 'PlayStation 5 Slim',
      category: 'Gaming',
      features: ['825GB SSD', 'Ray Tracing', '4K Gaming'],
      price: 499.99,
      image: '/images/ps5-slim.jpg',
      special: true,
      rating: 4.9
    },
    {
      id: 6,
      name: 'Bose QuietComfort Ultra',
      category: 'Headphones',
      features: ['Spatial Audio', 'ANC', '24h Battery'],
      price: 429.00,
      image: '/images/bose-qc.jpg',
      special: false,
      rating: 4.7
    },
    {
      id: 7,
      name: 'Dell XPS 15',
      category: 'Laptops',
      features: ['Intel i9', '32GB RAM', '1TB SSD'],
      price: 2199.00,
      image: '/images/dell-xps.jpg',
      special: false,
      rating: 4.6
    },
    {
      id: 8,
      name: 'iPhone 15 Pro',
      category: 'Smartphones',
      features: ['A17 Pro', '256GB Storage', 'Pro Camera'],
      price: 999.00,
      image: '/images/iphone-15.jpg',
      special: false,
      rating: 4.8
    },
    {
      id: 9,
      name: 'Sony A95L OLED 55"',
      category: 'TVs',
      features: ['QD-OLED', '4K 120Hz', 'Google TV'],
      price: 2499.99,
      image: '/images/sony-a95l.jpg',
      special: true,
      rating: 4.9
    },
    {
      id: 10,
      name: 'Xbox Series X',
      category: 'Gaming',
      features: ['1TB SSD', '4K Gaming', 'Game Pass'],
      price: 499.99,
      image: '/images/xbox-x.jpg',
      special: false,
      rating: 4.7
    },
    {
      id: 11,
      name: 'Echo Show 10',
      category: 'Home Devices',
      features: ['10.1" Screen', 'Alexa', 'Motion Tracking'],
      price: 249.99,
      image: '/images/echo-show.jpg',
      special: false,
      rating: 4.5
    },
    {
      id: 12,
      name: 'Sonos Era 300',
      category: 'Home Devices',
      features: ['Spatial Audio', 'Voice Control', 'Multi-room'],
      price: 449.00,
      image: '/images/sonos-era.jpg',
      special: true,
      rating: 4.6
    }
  ], []);

  // Filter states
  const [filters, setFilters] = useState({
    productType: ['Headphones'],
    priceRange: ['$200-$500'],
    priceMax: 2500
  });

  // Toggle favorites
  const toggleFavorite = (id) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle filter function
  const toggleFilter = (category, value) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter(item => item !== value);
      } else {
        newFilters[category] = [...newFilters[category], value];
      }
      return newFilters;
    });
  };

  // Update price filter
  const handlePriceChange = (e) => {
    setFilters(prev => ({
      ...prev,
      priceMax: parseInt(e.target.value)
    }));
  };

  // Apply filters and search
  useEffect(() => {
    let results = [...allProducts];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.productType.length > 0) {
      results = results.filter(product =>
        filters.productType.includes(product.category)
      );
    }

    // Apply price range filter
    if (filters.priceRange.length > 0) {
      results = results.filter(product => {
        if (filters.priceRange.includes('Under $200') && product.price < 200) {
          return true;
        }
        if (filters.priceRange.includes('$200-$500') && product.price >= 200 && product.price <= 500) {
          return true;
        }
        if (filters.priceRange.includes('$500-$1000') && product.price > 500 && product.price <= 1000) {
          return true;
        }
        if (filters.priceRange.includes('Over $1000') && product.price > 1000) {
          return true;
        }
        return false;
      });
    }

    // Apply price filter
    results = results.filter(product => product.price <= filters.priceMax);

    // Apply sorting
    if (sortBy === 'Price: low to high') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: high to low') {
      results.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Rating: high to low') {
      results.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(results);
  }, [searchQuery, filters, sortBy, allProducts]);

  // Get icon by category
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Headphones': return <Headphones size={16} />;
      case 'Laptops': return <Laptop size={16} />;
      case 'Smartphones': return <Smartphone size={16} />;
      case 'TVs': return <Tv size={16} />;
      case 'Gaming': return <Gamepad size={16} />;
      case 'Home Devices': return <Home size={16} />;
      default: return <Zap size={16} />;
    }
  };

  return (
    <div className="product-search-container">
      {/* Header with rating and auth */}


      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search for electronics by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>


      {/* Main content area */}
      <div className="main-content">
        {/* Filter sidebar */}
        <div className="filter-sidebar">
          <h3>Filter by</h3>

          <div className="filter-section">
            <h4>Product type</h4>
            <div className="filter-option">
              <input
                type="checkbox"
                id="headphones"
                checked={filters.productType.includes('Headphones')}
                onChange={() => toggleFilter('productType', 'Headphones')}
              />
              <label htmlFor="headphones">Headphones <span className="count">{allProducts.filter(p => p.category === 'Headphones').length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="laptops"
                checked={filters.productType.includes('Laptops')}
                onChange={() => toggleFilter('productType', 'Laptops')}
              />
              <label htmlFor="laptops">Laptops <span className="count">{allProducts.filter(p => p.category === 'Laptops').length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="smartphones"
                checked={filters.productType.includes('Smartphones')}
                onChange={() => toggleFilter('productType', 'Smartphones')}
              />
              <label htmlFor="smartphones">Smartphones <span className="count">{allProducts.filter(p => p.category === 'Smartphones').length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="tvs"
                checked={filters.productType.includes('TVs')}
                onChange={() => toggleFilter('productType', 'TVs')}
              />
              <label htmlFor="tvs">TVs <span className="count">{allProducts.filter(p => p.category === 'TVs').length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="gaming"
                checked={filters.productType.includes('Gaming')}
                onChange={() => toggleFilter('productType', 'Gaming')}
              />
              <label htmlFor="gaming">Gaming <span className="count">{allProducts.filter(p => p.category === 'Gaming').length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="home-devices"
                checked={filters.productType.includes('Home Devices')}
                onChange={() => toggleFilter('productType', 'Home Devices')}
              />
              <label htmlFor="home-devices">Home Devices <span className="count">{allProducts.filter(p => p.category === 'Home Devices').length}</span></label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="filter-option">
              <input
                type="checkbox"
                id="under-200"
                checked={filters.priceRange.includes('Under $200')}
                onChange={() => toggleFilter('priceRange', 'Under $200')}
              />
              <label htmlFor="under-200">Under $200 <span className="count">{allProducts.filter(p => p.price < 200).length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="200-500"
                checked={filters.priceRange.includes('$200-$500')}
                onChange={() => toggleFilter('priceRange', '$200-$500')}
              />
              <label htmlFor="200-500">$200-$500 <span className="count">{allProducts.filter(p => p.price >= 200 && p.price <= 500).length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="500-1000"
                checked={filters.priceRange.includes('$500-$1000')}
                onChange={() => toggleFilter('priceRange', '$500-$1000')}
              />
              <label htmlFor="500-1000">$500-$1000 <span className="count">{allProducts.filter(p => p.price > 500 && p.price <= 1000).length}</span></label>
            </div>
            <div className="filter-option">
              <input
                type="checkbox"
                id="over-1000"
                checked={filters.priceRange.includes('Over $1000')}
                onChange={() => toggleFilter('priceRange', 'Over $1000')}
              />
              <label htmlFor="over-1000">Over $1000 <span className="count">{allProducts.filter(p => p.price > 1000).length}</span></label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Max price</h4>
            <div className="price-slider">
              <input
                type="range"
                min="0"
                max="3000"
                value={filters.priceMax}
                onChange={handlePriceChange}
              />
              <div className="price-range">
                <span>max. ${filters.priceMax}.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="results-container">
          <div className="results-header">
            <div className="results-count">{filteredProducts.length} results</div>
            <div className="sort-options">
              <span>Sort by</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option>Best match</option>
                <option>Price: low to high</option>
                <option>Price: high to low</option>
                <option>Rating: high to low</option>
              </select>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <button
                    className={`favorite-button ${favorites.includes(product.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Star
                      size={20}
                      className={favorites.includes(product.id) ? 'filled' : ''}
                    />
                  </button>
                </div>
                <div className="product-details">
                  <div className="product-header">
                    <div className="product-category">{product.category}</div>
                    {product.special && <div className="special-tag">SUMMER SALE</div>}
                  </div>
                  <div className="product-name">{product.name}</div>
                  <div className="product-rating">
                    <div className="stars-mini">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <span key={i} className="filled-star-mini">★</span>
                      ))}
                      {product.rating % 1 >= 0.5 && <span className="half-star-mini">★</span>}
                    </div>
                    <span className="rating-value">{product.rating.toFixed(1)}</span>
                  </div>
                  <div className="product-features">
                    <h5>Key Features</h5>
                    <div className="features-list">
                      {product.features.map((feature, index) => (
                        <div className="feature" key={index}>
                          {index === 0 ? getCategoryIcon(product.category) : <Zap className="feature-icon" size={16} />}
                          <span className="feature-text">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="product-price-section">
                    <div className="price-display">
                      <div className="price">${product.price.toFixed(2)}</div>
                      {product.special && <div className="original-price">${(product.price * 1.2).toFixed(2)}</div>}
                    </div>
                    <button className="buy-button">Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <h3>No products match your current filters</h3>
              <p>Try adjusting your filters or search query to see more results</p>
              <button
                className="reset-filters"
                onClick={() => {
                  setFilters({
                    productType: [],
                    priceRange: [],
                    priceMax: 2500
                  });
                  setSearchQuery('');
                }}
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSearchResults;