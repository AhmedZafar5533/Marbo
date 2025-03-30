import React from 'react';
import { Link } from 'react-router-dom';
import styles from './header.module.css'; // Import CSS Module

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link to="/">Marbo Global</Link>
      </div>
      <nav className={styles.navMenu}>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/how-it-works">How It Works</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>
      <div className={styles.ctaButtons}>
        <Link to="/vendor-onboarding" className={styles.btnVendor}>I'm a Vendor</Link>
        <Link to="/buyer-registration" className={styles.btnBuyer}>I'm a Buyer</Link>
      </div>
    </header>
  );
};

export default Header;