import React, { useState, useEffect } from 'react';
import './detail.css';

const ProductDetailPage = () => {
  // Combined state with product data and UI state
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: null,
    quantity: 1,
    selectedColor: '',
    activeImage: '',
    addedToCart: false
  });

  useEffect(() => {
    // Simulate API fetch with async/await pattern
    const fetchProduct = async () => {
      try {
        // Simulating network request
        const data = await new Promise(resolve => 
          setTimeout(() => resolve(dummyProductData), 500)
        );
        
        setState(prev => ({
          ...prev,
          product: data,
          selectedColor: data.colors[0].id,
          activeImage: data.images.main,
          loading: false
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load product data',
          loading: false
        }));
      }
    };

    fetchProduct();
  }, []);

  // Destructure for easier access
  const { product, loading, error, quantity, selectedColor, activeImage, addedToCart } = state;

  // Helper functions
  const updateState = updates => setState(prev => ({ ...prev, ...updates }));
  
  const formatCurrency = amount => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const renderStarRating = rating => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');
  };

  const handleQuantityChange = change => {
    const newQuantity = Math.max(1, Math.min(product.stockCount, quantity + change));
    updateState({ quantity: newQuantity });
  };

  const handleColorSelect = colorId => {
    updateState({ selectedColor: colorId });
  };

  const handleThumbnailClick = imgSrc => {
    updateState({ activeImage: imgSrc });
  };

  const handleAddToCart = () => {
    const selectedColorName = product.colors.find(c => c.id === selectedColor).name;
    updateState({ addedToCart: true });
    
    // Reset notification after 3 seconds
    setTimeout(() => updateState({ addedToCart: false }), 3000);

    // In a real app, this would call an API or update a cart context
    console.log(`Added ${quantity} ${product.name} in ${selectedColorName} to cart`);
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-page">
      <div className="breadcrumb">
        {product.breadcrumb.map((item, index) => (
          <React.Fragment key={index}>
            <span className={index === product.breadcrumb.length - 1 ? 'current' : ''}>
              {item}
            </span>
            {index < product.breadcrumb.length - 1 && ' > '}
          </React.Fragment>
        ))}
      </div>

      <div className="product-container">
        <div className="product-images">
          <div className="main-image">
            <img src={activeImage} alt={product.name} />
          </div>
          <div className="thumbnail-images">
            <img 
              src={product.images.main} 
              alt="Main view" 
              onClick={() => handleThumbnailClick(product.images.main)}
              className={activeImage === product.images.main ? 'active' : ''}
            />
            {product.images.thumbnails.map((thumbnail, index) => (
              <img 
                key={index} 
                src={thumbnail} 
                alt={`View ${index + 1}`} 
                onClick={() => handleThumbnailClick(thumbnail)}
                className={activeImage === thumbnail ? 'active' : ''}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-subtitle">{product.subtitle}</p>
          
          <div className="product-rating">
            <div className="stars">{renderStarRating(product.rating)}</div>
            <span className="rating-count">({product.reviewCount} reviews)</span>
          </div>

          <div className="product-price">
            <span className="current-price">{formatCurrency(product.price)}</span>
            <span className="installment-price">
              or {formatCurrency(product.installmentPrice)}/month
            </span>
            <p className="price-note">
              with {product.installmentMonths} month financing
            </p>
          </div>

          <div className="color-selector">
            <h3>Choose a Color</h3>
            <div className="color-options">
              {product.colors.map(color => (
                <button 
                  key={color.id}
                  className={`color-option ${selectedColor === color.id ? 'selected' : ''}`}
                  style={{ backgroundColor: color.color }}
                  onClick={() => handleColorSelect(color.id)}
                  aria-label={color.name}
                  title={color.name}
                />
              ))}
            </div>
            <span className="selected-color-name">
              {product.colors.find(c => c.id === selectedColor)?.name}
            </span>
          </div>

          <div className="quantity-selector">
            <button 
              onClick={() => handleQuantityChange(-1)}
              className="quantity-btn"
              disabled={quantity <= 1}
            >
              −
            </button>
            <span className="quantity">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(1)}
              className="quantity-btn"
              disabled={quantity >= product.stockCount}
            >
              +
            </button>
            <span className="stock-status" style={{ color: product.stockCount <= 5 ? 'red' : 'inherit' }}>
              {product.stockCount <= 10 ? `Only ${product.stockCount} left in stock!` : 'In Stock'}
            </span>
          </div>

          {addedToCart && (
            <div className="cart-notification">
              Added to cart successfully!
            </div>
          )}

          <div className="action-buttons">
            <button className="buy-now-btn">Buy Now</button>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>

          <div className="product-features">
            {product.features.map((feature, index) => (
              <div className="feature" key={index}>
                <span className="feature-icon">{feature.icon}</span>
                <div className="feature-content">
                  <span className="feature-text">{feature.title}</span>
                  <span className="feature-detail">{feature.details}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep the dummy data from the original
const dummyProductData = {
  id: 'airpods-max-01',
  name: 'AirPods Max',
  subtitle: 'Wireless Over-Ear Headphones with Active Noise Cancellation',
  price: 549.00,
  installmentMonths: 6,
  installmentPrice: 91.50,
  rating: 4.8,
  reviewCount: 119,
  stockCount: 8,
  colors: [
    { id: 'pink', name: 'Pink', color: '#e8b7b7' },
    { id: 'silver', name: 'Silver', color: '#d9d9d9' },
    { id: 'white', name: 'White', color: '#ffffff' },
    { id: 'blue', name: 'Blue', color: '#839dc0' }
  ],
  images: {
    main: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?q=80&w=1738&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    thumbnails: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-xnqaaTFn5inK4GTlIYCeEpYQq50xk_MeFw&s'
    ]
  },
  breadcrumb: ['Department', 'Audio', 'Headphones', 'Shop Headphones by type', 'AirPods max'],
  features: [
    {
      icon: '✓',
      title: 'Free Delivery',
      details: 'Enter your postal code for Delivery Availability'
    },
    {
      icon: '✓',
      title: 'Return Delivery',
      details: 'Free 30-Day Delivery Returns'
    }
  ]
};

export default ProductDetailPage;