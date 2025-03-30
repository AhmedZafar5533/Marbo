import React, { useState } from "react";
import "../../styles/Navbar.css"; // Import the CSS file

const Navbar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (item) => {
    setHoveredItem(item);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        {/* Accounts */}
        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("Accounts")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="#" className="nav-link">
            Accounts
          </a>
          {hoveredItem === "Accounts" && (
            <div className="dropdown">
              <a href="/login">Login</a>
              <a href="/signup">Sign Up</a>
            </div>
          )}
        </li>

        {/* Pages */}
        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("Pages")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="#" className="nav-link">
            Pages
          </a>
          {hoveredItem === "Pages" && (
            <div className="pagesDropdown">
              <div className="dropdown-category">
                <h4>Onboarding</h4>
                <a href="/vendor-onboarding">Vendor Onboarding</a>
                <a href="/buyer-registration">Buyer Registration</a>
              </div>
              <div className="dropdown-category">
                <h4>E-Commerce</h4>
                <a href="/product-listing">Product Listing</a>

                <a href="/category-page">Category Page</a>
              </div>
            </div>
          )}
        </li>

        {/* Marbo */}
        <li className="nav-item">
          <a href="/" className="nav-link main">
            Marbo
          </a>
        </li>

        {/* Contact */}
        <li className="nav-item">
          <a href="/contact" className="nav-link">
            Contact
          </a>
        </li>

        <li
          className="nav-item"
          onMouseEnter={() => handleMouseEnter("Support")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="#" className="nav-link">
            Support
          </a>
          {hoveredItem === "Support" && (
            <div className="dropdown">
              <a href="/support">Support/Help Center</a>
              <a href="/about-us">About Us</a>
              <a href="/how-it-works">How It Works</a>
            </div>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
