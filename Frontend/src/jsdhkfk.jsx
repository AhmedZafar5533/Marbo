import React, { useEffect, useRef, useState } from "react";

import { Link } from "react-router-dom";


import Testimonials from "../components/sections/testimonicals";
import FeaturedCategories from "../components/sections/categories";
import HowItWorks from "../components/sections/howitworks";
import PricingSection from "../components/sections/pricing";
import Footer from "../components/layout/footer";
import HeroSection from "../components/sections/hero";
import CategoriesAndServices from "../components/sections/categories";

const Home = () => {
    return (
        <>
           
            <div className="home">

                {/* Hero Section */}
                <HeroSection />

                {/* About Section */}

                {/* <section className="about-section">
                    <div className="aboutContainer">
                        <div className="content">
                            <h2 className="head">
                                <span className="highlights">Revolutionize </span> <br /> with
                                Marbo Market.
                            </h2>

                            <div className="features">
                                <div className="feature">
                                    <h3>Expert Solutions</h3>
                                    <p>
                                        Our platform connects businesses with top industry
                                        professionals to bring your ideas to life.
                                    </p>
                                </div>

                                <div className="feature">
                                    <h3>Seamless Collaboration</h3>
                                    <p>
                                        Work efficiently with real-time updates, smooth
                                        communication, and a user-friendly interface.
                                    </p>
                                </div>

                                <div className="feature">
                                    <h3>Reliable & Secure</h3>
                                    <p>
                                        We prioritize security and trust, ensuring a safe and
                                        transparent experience for every project.
                                    </p>
                                </div>

                                <div className="feature">
                                    <h3>Endless Opportunities</h3>
                                    <p>
                                        From startups to enterprises, we empower organizations to
                                        scale and innovate effortlessly.
                                    </p>
                                </div>
                            </div>

                            <p className="cta">
                                <a href="#">Get Started Now →</a>
                            </p>
                        </div>
                    </div>
                </section> */}

                {/* Testimonials */}
                <Testimonials />

                {/* Featured Categories */}

                <CategoriesAndServices />

                {/* How It Works */}
                <HowItWorks />

                {/* Subscription Tiers */}
                <>
                    <div className="background"></div>
                    <PricingSection />
                </>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default Home;
