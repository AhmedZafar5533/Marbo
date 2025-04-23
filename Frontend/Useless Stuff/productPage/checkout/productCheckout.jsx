import { useState, useEffect } from "react";
import './checkout.css'

const CheckoutPage = () => {
  // Sample cart data - in real app, this would come from context/redux/API
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'AirPods Max',
      color: 'Pink',
      sku: 'AP-MAX-PNK-2025',
      price: 549.00,
      quantity: 1,
      image: "https://plus.unsplash.com/premium_photo-1668418188837-d40b734ed6d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: 'iPhone 15 Pro',
      color: 'Titanium Blue',
      sku: 'IP-15P-BLU-2025',
      price: 999.00,
      quantity: 1,
      image: "/api/placeholder/80/80"
    }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@gmail.com',
    address: '2119 Park Dr, Richmond, Virginia 23224',
    zipCode: '23224',
    phone: '+1 804-359-1787',
    cardHolderName: ''
  });

  // Calculate order summary
  const [summary, setSummary] = useState({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  // Update summary when cart changes
  useEffect(() => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping in this example
    const tax = subtotal * 0.06; // 6% tax rate
    const total = subtotal + shipping + tax;

    setSummary({
      subtotal,
      shipping,
      tax,
      total
    });
  }, [cartItems]);

  // Handle quantity changes
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Handle removing items
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Define styles object for the secure icon
  const styles = {
    icon: {
      width: '20px',
      height: '20px',
      marginRight: '5px',
      verticalAlign: 'middle'
    }
  };

  // Determine if card holder field should be shown
  const showCardHolderField = paymentMethod === 'credit' || paymentMethod === 'paypal';

  return (
    <div className="container">
      <div className="flexContainer">
        {/* Left Column - Review Items and Shipping */}
        <div className="column">
          <h2 className="sectionTitle">Cart Items ({cartItems.length})</h2>

          {/* Cart Items */}
          {cartItems.map(item => (
            <div key={item.id} className="productItem">
              <div className="productImageContainer">
                <img src={item.image} alt={item.name} className="productImage" />
                <div className="quantityControl">
                  <button
                    className="quantityButton"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >-</button>
                  <span className="quantityValue">{item.quantity}</span>
                  <button
                    className="quantityButton"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                </div>
              </div>
              <div className="productInfo">
                <h3 className="productName">{item.name}</h3>
                <p className="productVariant">Color: {item.color}</p>
                <div className="productSku">SKU: {item.sku}</div>
                <button
                  className="removeButton"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
              <div className="productPrice">
                ${item.price.toFixed(2)}
                {item.quantity > 1 && (
                  <div className="itemTotal">
                    Total: ${(item.price * item.quantity).toFixed(2)}
                  </div>
                )}
              </div>
            </div>
          ))}

          {cartItems.length === 0 && (
            <div className="emptyCart">
              Your cart is empty. Please add some products to proceed.
            </div>
          )}

          {/* Delivery Information */}
          <div className="deliveryInfoSection">
            <div className="sectionHeader">
              <h3 className="subsectionTitle">Delivery Information</h3>
              <button className="editButton">
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            </div>

            <div className="infoContainer">
              <div className="infoGrid">
                <span className="infoLabel">Name:</span>
                <span className="infoValue">{formData.name}</span>
              </div>
              <div className="infoGrid">
                <span className="infoLabel">Address:</span>
                <span className="infoValue">{formData.address}</span>
              </div>
              <div className="infoGrid">
                <span className="infoLabel">Zip Code:</span>
                <span className="infoValue">{formData.zipCode}</span>
              </div>
              <div className="infoGrid">
                <span className="infoLabel">Phone:</span>
                <span className="infoValue">{formData.phone}</span>
              </div>
              <div className="infoGrid">
                <span className="infoLabel">Email:</span>
                <span className="infoValue">{formData.email}</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="deliveryEstimate">
            <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h5.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
            </svg>
            <span className="deliveryText">Estimated Delivery: Mar 12 - Mar 14</span>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="column">
          <h2 className="sectionTitle">Order Summary</h2>

          {/* Order Details */}
          <div className="orderSummary">
            <div className="summaryRow">
              <span className="summaryLabel">Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} items)</span>
              <span className="summaryValue">${summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="summaryRow">
              <span className="summaryLabel">Shipping</span>
              <span className="summaryValue">${summary.shipping.toFixed(2)}</span>
            </div>
            <div className="summaryRow">
              <span className="summaryLabel">Tax (6%)</span>
              <span className="summaryValue">${summary.tax.toFixed(2)}</span>
            </div>
            <div className="summaryRow summaryDivider">
              <span className="totalLabel">Total</span>
              <span className="totalValue">${summary.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="couponContainer">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="couponInput"
            />
            <button className="couponButton">Apply</button>
          </div>

          {/* Payment Details */}
          <div className="paymentSection">
            <h3 className="subsectionTitle">Payment Method</h3>

            <div className="paymentOptions">
              {['cod', 'credit', 'paypal', 'apple'].map(method => (
                <div
                  key={method}
                  className={`paymentOption ${paymentMethod === method ? 'selectedPayment' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                >
                  <input
                    type="radio"
                    id={method}
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="radio"
                  />
                  <label htmlFor={method} className="paymentLabel">
                    <svg className="methodIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {method === 'cod' && 'Cash on Delivery'}
                    {method === 'credit' && 'Credit Card'}
                    {method === 'paypal' && 'PayPal'}
                    {method === 'apple' && 'Apple Pay'}
                  </label>
                </div>
              ))}
            </div>

            {/* Credit Card Fields (shown conditionally) */}
            {paymentMethod === 'credit' && (
              <div className="cardFields">
                {/* Card Number */}
                <div className="formGroup">
                  <label className="label">
                    Card Number<span className="requiredStar">*</span>
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    className="input"
                    placeholder="**** **** **** ****"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="formRow">
                  <div className="formGroup">
                    <label className="label">
                      Expiry Date<span className="requiredStar">*</span>
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      className="input"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="formGroup">
                    <label className="label">
                      CVV<span className="requiredStar">*</span>
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      className="input"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Card Holder Name - conditionally rendered */}
            {showCardHolderField && (
              <div className="formGroup">
                <label className="label">
                  Card Holder Name<span className="requiredStar">*</span>
                </label>
                <input
                  type="text"
                  name="cardHolderName"
                  className="input"
                  placeholder="John Doe"
                  value={formData.cardHolderName}
                  onChange={handleInputChange}
                />
              </div>
            )}

            {/* Place Order Button */}
            <button
              className={`orderButton ${cartItems.length === 0 ? 'disabledButton' : ''}`}
              disabled={cartItems.length === 0}
            >
              <svg style={{ width: '20px', height: '20px' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Place Order Securely
            </button>

            <div className="secureNote">
              <svg style={styles.icon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#4CAF50">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Checkout - All information is encrypted and secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;