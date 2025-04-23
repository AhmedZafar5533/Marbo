import React, { useState, useEffect } from "react";
import { useServiceStore } from "../../Store/servicesStore";
import LoadingSpinner from "../components/LoadingSpinner";

function EditablePage() {
    // Header Section State with Enhanced Customization
    const [headerSection, setHeaderSection] = useState({
        text: "Transform Your Business with Digital Excellence",
        description: "Empower your organization with cutting-edge digital solutions tailored to your unique business needs. Start your transformation journey today.",
        image: "https://via.placeholder.com/1920x800",
        gradientOpacity: 0.8,
        textColor: "#ffffff",
        buttonTextColor: "#4338ca",
        buttonBgColor: "#ffffff",
        secondaryButtonTextColor: "#4338ca",
        secondaryButtonBgColor: "#e0e7ff",
        height: "80vh",
        textAlignment: "center",
        gradientStartColor: "#4338ca",
        gradientEndColor: "#6d28d9",
        buttonText: "Get Started",
        secondaryButtonText: "Learn More",
        descriptionMaxWidth: "2xl",
        editing: false
    });

    // About Us Section State with Enhanced Customization
    const [aboutSection, setAboutSection] = useState({
        title: "About Our Digital Solutions",
        content: "We specialize in creating transformative digital experiences that drive business growth and customer engagement. Our team combines technical expertise with creative vision to deliver cutting-edge solutions.",
        image: "https://via.placeholder.com/600x400",
        imagePosition: "right", // left or right
        backgroundColor: "#ffffff",
        textColor: "#111827",
        buttonTextColor: "#ffffff",
        buttonBgColor: "#4338ca",
        secondaryButtonTextColor: "#4338ca",
        secondaryButtonBgColor: "#e0e7ff",
        buttonText: "Learn More",
        secondaryButtonText: "Contact Us",
        paddingY: "24",
        titleSize: "4xl",
        contentSize: "xl",
        borderRadius: "2xl",
        editing: false
    });

    // Pricing Cards with Enhanced Customization
    const [pricingSection, setPricingSection] = useState({
        title: "Transparent Pricing",
        subtitle: "Choose the perfect plan for your business needs",
        backgroundColor: "#eef2ff",
        textColor: "#111827",
        subtitleColor: "#4b5563",
        buttonText: "Edit Pricing",
        buttonTextColor: "#ffffff",
        buttonBgColor: "#4338ca",
        cardBgColor: "#ffffff",
        highlightedCardIndex: 1, // Index of the featured card (null for none)
        highlightColor: "#4338ca",
        titleSize: "4xl",
        subtitleSize: "xl",
        paddingY: "24",
        layout: "grid", // grid or carousel
        columns: 3, // 1, 2, 3, or 4
        showComparison: false,
        editing: false
    });

    const [pricingCards, setPricingCards] = useState([
        {
            title: "Starter Plan",
            price: "$299/mo",
            description: "Perfect for startups and small businesses",
            priceColor: "#4338ca",
            buttonText: "Get Started",
            buttonTextColor: "#ffffff",
            buttonBgColor: "#4338ca",
            features: [
                { text: "Up to 10 users", included: true },
                { text: "Basic analytics dashboard", included: true },
                { text: "Email support", included: true },
                { text: "API access", included: false }
            ]
        },
        {
            title: "Professional Plan",
            price: "$799/mo",
            description: "Advanced features for growing enterprises",
            priceColor: "#4338ca",
            buttonText: "Get Started",
            buttonTextColor: "#ffffff",
            buttonBgColor: "#4338ca",
            highlighted: true,
            features: [
                { text: "Up to 50 users", included: true },
                { text: "Advanced analytics", included: true },
                { text: "Priority support", included: true },
                { text: "API access", included: true },
                { text: "Custom integrations", included: false }
            ]
        },
        {
            title: "Enterprise Plan",
            price: "Custom",
            description: "Tailored solutions for large organizations",
            priceColor: "#4338ca",
            buttonText: "Contact Sales",
            buttonTextColor: "#ffffff",
            buttonBgColor: "#4338ca",
            features: [
                { text: "Unlimited users", included: true },
                { text: "Custom integrations", included: true },
                { text: "24/7 dedicated support", included: true },
                { text: "Personalized onboarding", included: true },
                { text: "Custom SLA", included: true }
            ]
        }
    ]);

    // Features Section State with Enhanced Customization
    const [featuresSection, setFeaturesSection] = useState({
        title: "Powerful Features for Modern Businesses",
        content: "Discover how our comprehensive suite of tools can revolutionize your operations and customer engagement.",
        features: [
            { text: "Cloud-based Infrastructure", icon: "cloud" },
            { text: "Real-time Analytics", icon: "chart-bar" },
            { text: "AI-powered Insights", icon: "chip" },
            { text: "Secure API Integrations", icon: "lock-closed" }
        ],
        image: "https://via.placeholder.com/600x400",
        imagePosition: "left", // left or right
        backgroundColor: "#ffffff",
        textColor: "#111827",
        buttonTextColor: "#ffffff",
        buttonBgColor: "#4338ca",
        secondaryButtonTextColor: "#4338ca",
        secondaryButtonBgColor: "#e0e7ff",
        iconColor: "#4338ca",
        buttonText: "View All Features",
        secondaryButtonText: "Watch Demo",
        paddingY: "24",
        titleSize: "4xl",
        contentSize: "xl",
        layout: "standard", // standard, grid, or carousel
        borderRadius: "2xl",
        editing: false
    });

    // How It Works Section State with Enhanced Customization
    const [howItWorksSection, setHowItWorksSection] = useState({
        title: "How We Drive Your Digital Success",
        description: "A simple three-step process to transform your business",
        backgroundColor: "#eef2ff",
        textColor: "#111827",
        accentColor: "#4338ca",
        numberColor: "#4338ca",
        stepBgColor: "#ffffff",
        stepTextColor: "#111827",
        titleSize: "5xl",
        descriptionSize: "xl",
        stepTitleSize: "2xl",
        paddingY: "24",
        buttonText: "Customize Section",
        buttonTextColor: "#ffffff",
        buttonBgColor: "gradient", // solid or gradient
        gradientStartColor: "#4338ca",
        gradientEndColor: "#6d28d9",
        layout: "horizontal", // horizontal or vertical
        connectorsVisible: true,
        borderRadius: "2xl",
        steps: [
            {
                title: "Discovery & Planning",
                content: "We analyze your business needs and create a customized digital roadmap",
                icon: "search"
            },
            {
                title: "Implementation & Integration",
                content: "Our experts deploy solutions while ensuring seamless system integration",
                icon: "code-bracket"
            },
            {
                title: "Optimization & Growth",
                content: "Continuous improvement and scaling to ensure long-term success",
                icon: "chart-bar"
            }
        ],
        editing: false
    });

    // Call to Action Section with Enhanced Customization
    const [ctaSection, setCtaSection] = useState({
        title: "Ready to Transform Your Business?",
        description: "Join thousands of satisfied customers who've already revolutionized their operations with our solutions.",
        backgroundColor: "#4338ca",
        textColor: "#ffffff",
        descriptionColor: "#e0e7ff",
        buttonTextColor: "#4338ca",
        buttonBgColor: "#ffffff",
        buttonText: "Get Started",
        secondaryButtonText: "Contact Sales",
        secondaryButtonTextColor: "#ffffff",
        secondaryButtonBgColor: "transparent",
        showSecondaryButton: true,
        backgroundImage: null,
        backgroundOverlay: true,
        overlayOpacity: 0.8,
        paddingY: "24",
        titleSize: "5xl",
        descriptionSize: "2xl",
        layout: "center", // center, left, or split
        showImage: false,
        image: null,
        borderRadius: "none",
        editing: false
    });

    // Testimonials Section with Enhanced Customization
    const [testimonialsSection, setTestimonialsSection] = useState({
        title: "What Our Clients Say",
        description: "Discover why businesses trust our digital solutions",
        backgroundColor: "#ffffff",
        textColor: "#111827",
        accentColor: "#4338ca",
        paddingY: "24",
        layout: "slider", // slider, grid, or masonry
        showRatings: true,
        showCompanyLogos: true,
        titleSize: "4xl",
        descriptionSize: "xl",
        testimonialBgColor: "#f9fafb",
        testimonialTextColor: "#1f2937",
        quoteColor: "#9ca3af",
        borderRadius: "xl",
        editing: false,
        testimonials: [
            {
                name: "Sarah Johnson",
                position: "CTO, TechCorp",
                company: "TechCorp",
                companyLogo: "https://via.placeholder.com/150x50",
                content: "Implementing this solution increased our productivity by 45% within just three months. The team's expertise and support were exceptional throughout the entire process.",
                image: "https://via.placeholder.com/100x100",
                rating: 5
            },
            {
                name: "Michael Chen",
                position: "CEO, GrowthStar",
                company: "GrowthStar",
                companyLogo: "https://via.placeholder.com/150x50",
                content: "The customized solutions delivered precisely what our growing business needed. We've seen a dramatic improvement in customer engagement and operational efficiency.",
                image: "https://via.placeholder.com/100x100",
                rating: 5
            },
            {
                name: "Emily Rodriguez",
                position: "Marketing Director, BrandLeap",
                company: "BrandLeap",
                companyLogo: "https://via.placeholder.com/150x50",
                content: "Their analytics platform has transformed how we approach our marketing strategies. The real-time data and insights have been invaluable to our growth.",
                image: "https://via.placeholder.com/100x100",
                rating: 4
            }
        ]
    });

    // Stats/Metrics Section with Enhanced Customization
    const [statsSection, setStatsSection] = useState({
        title: "Our Impact By The Numbers",
        description: "Measurable results that speak for themselves",
        backgroundColor: "#eef2ff",
        textColor: "#111827",
        accentColor: "#4338ca",
        statColor: "#4338ca",
        statLabelColor: "#6b7280",
        paddingY: "20",
        titleSize: "4xl",
        descriptionSize: "xl",
        statSize: "5xl",
        layout: "grid", // grid or cards
        borderRadius: "xl",
        showDividers: true,
        animateNumbers: true,
        editing: false,
        stats: [
            {
                value: "97%",
                label: "Customer Satisfaction",
                icon: "star"
            },
            {
                value: "45%",
                label: "Average Efficiency Increase",
                icon: "chart-bar"
            },
            {
                value: "10K+",
                label: "Businesses Powered",
                icon: "building-office"
            },
            {
                value: "$2.5M",
                label: "Average Client ROI",
                icon: "currency-dollar"
            }
        ]
    });

    // Page Layout and Global Styling Options
    const [pageSettings, setPageSettings] = useState({
        fontFamily: "Inter, sans-serif",
        primaryColor: "#4338ca",
        secondaryColor: "#6d28d9",
        spacing: "default", // compact, default, spacious
        animations: "subtle", // none, subtle, moderate, dynamic
        containerWidth: "7xl", // sm, md, lg, xl, 2xl, ... 7xl
        cornerStyle: "rounded", // sharp, rounded, pill
        sectionGaps: "8", // spacing between sections (tailwind sizes)
        showPageSettings: false
    });

    const {
        initializePage,
        loading,
        saveHeaderData,
        isInitialized,
        sendAboutUsData,
        sendFeaturesData,
        sendHowItWorksData,
        sendPricingData,
        sendCtaData,
        sendTestimonialsData,
        sendStatsData,
        sendPageSettings,
        servicePage: pageData = null
    } = useServiceStore();

    // Icons collection for the various sections
    const icons = {
        "cloud": (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,4C15.64,4 18.67,6.59 19.35,10.04C21.95,10.22 24,12.36 24,15C24,17.76 21.76,20 19,20H6C2.69,20 0,17.31 0,14C0,10.91 2.34,8.36 5.35,8.04C6.17,5.64 8.77,4 12,4Z" />
            </svg>
        ),
        "chart-bar": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
        "chip": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
        ),
        "lock-closed": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        ),
        "search": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
        "code-bracket": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
        ),
        "star": (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
        ),
        "building-office": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        "currency-dollar": (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    useEffect(() => {
        if (!isInitialized) {
            initializePage();
        } else if (pageData) {
            // Initialize all section data from backend if available
            if (pageData.header) {
                setHeaderSection(prev => ({
                    ...prev,
                    text: pageData.header.text || prev.text,
                    description: pageData.header.description || prev.description,
                    image: pageData.header.image?.url || prev.image,
                    gradientOpacity: pageData.header.gradientOpacity ?? prev.gradientOpacity,
                    textColor: pageData.header.textColor || prev.textColor,
                    buttonTextColor: pageData.header.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.header.buttonBgColor || prev.buttonBgColor,
                    secondaryButtonTextColor: pageData.header.secondaryButtonTextColor || prev.secondaryButtonTextColor,
                    secondaryButtonBgColor: pageData.header.secondaryButtonBgColor || prev.secondaryButtonBgColor,
                    height: pageData.header.height || prev.height,
                    textAlignment: pageData.header.textAlignment || prev.textAlignment,
                    gradientStartColor: pageData.header.gradientStartColor || prev.gradientStartColor,
                    gradientEndColor: pageData.header.gradientEndColor || prev.gradientEndColor,
                    buttonText: pageData.header.buttonText || prev.buttonText,
                    secondaryButtonText: pageData.header.secondaryButtonText || prev.secondaryButtonText,
                    descriptionMaxWidth: pageData.header.descriptionMaxWidth || prev.descriptionMaxWidth
                }));
            }

            if (pageData.about) {
                setAboutSection(prev => ({
                    ...prev,
                    title: pageData.about.title || prev.title,
                    content: pageData.about.content || prev.content,
                    image: pageData.about.image?.url || prev.image,
                    imagePosition: pageData.about.imagePosition || prev.imagePosition,
                    backgroundColor: pageData.about.backgroundColor || prev.backgroundColor,
                    textColor: pageData.about.textColor || prev.textColor,
                    buttonTextColor: pageData.about.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.about.buttonBgColor || prev.buttonBgColor,
                    secondaryButtonTextColor: pageData.about.secondaryButtonTextColor || prev.secondaryButtonTextColor,
                    secondaryButtonBgColor: pageData.about.secondaryButtonBgColor || prev.secondaryButtonBgColor,
                    buttonText: pageData.about.buttonText || prev.buttonText,
                    secondaryButtonText: pageData.about.secondaryButtonText || prev.secondaryButtonText,
                    paddingY: pageData.about.paddingY || prev.paddingY,
                    titleSize: pageData.about.titleSize || prev.titleSize,
                    contentSize: pageData.about.contentSize || prev.contentSize,
                    borderRadius: pageData.about.borderRadius || prev.borderRadius
                }));
            }

            if (pageData.features) {
                setFeaturesSection(prev => ({
                    ...prev,
                    title: pageData.features.title || prev.title,
                    content: pageData.features.content || prev.content,
                    features: pageData.features.features || prev.features,
                    image: pageData.features.image?.url || prev.image,
                    imagePosition: pageData.features.imagePosition || prev.imagePosition,
                    backgroundColor: pageData.features.backgroundColor || prev.backgroundColor,
                    textColor: pageData.features.textColor || prev.textColor,
                    buttonTextColor: pageData.features.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.features.buttonBgColor || prev.buttonBgColor,
                    secondaryButtonTextColor: pageData.features.secondaryButtonTextColor || prev.secondaryButtonTextColor,
                    secondaryButtonBgColor: pageData.features.secondaryButtonBgColor || prev.secondaryButtonBgColor,
                    iconColor: pageData.features.iconColor || prev.iconColor,
                    buttonText: pageData.features.buttonText || prev.buttonText,
                    secondaryButtonText: pageData.features.secondaryButtonText || prev.secondaryButtonText,
                    paddingY: pageData.features.paddingY || prev.paddingY,
                    titleSize: pageData.features.titleSize || prev.titleSize,
                    contentSize: pageData.features.contentSize || prev.contentSize,
                    layout: pageData.features.layout || prev.layout,
                    borderRadius: pageData.features.borderRadius || prev.borderRadius
                }));
            }

            if (pageData.howItWorks) {
                setHowItWorksSection(prev => ({
                    ...prev,
                    title: pageData.howItWorks.title || prev,
                    description: pageData.howItWorks.description || prev.description,
                    backgroundColor: pageData.howItWorks.backgroundColor || prev.backgroundColor,
                    textColor: pageData.howItWorks.textColor || prev.textColor,
                    accentColor: pageData.howItWorks.accentColor || prev.accentColor,
                    numberColor: pageData.howItWorks.numberColor || prev.numberColor,
                    stepBgColor: pageData.howItWorks.stepBgColor || prev.stepBgColor,
                    stepTextColor: pageData.howItWorks.stepTextColor || prev.stepTextColor,
                    steps: pageData.howItWorks.steps || prev.steps,
                    titleSize: pageData.howItWorks.titleSize || prev.titleSize,
                    descriptionSize: pageData.howItWorks.descriptionSize || prev.descriptionSize,
                    stepTitleSize: pageData.howItWorks.stepTitleSize || prev.stepTitleSize,
                    paddingY: pageData.howItWorks.paddingY || prev.paddingY,
                    buttonText: pageData.howItWorks.buttonText || prev.buttonText,
                    buttonTextColor: pageData.howItWorks.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.howItWorks.buttonBgColor || prev.buttonBgColor,
                    gradientStartColor: pageData.howItWorks.gradientStartColor || prev.gradientStartColor,
                    gradientEndColor: pageData.howItWorks.gradientEndColor || prev.gradientEndColor,
                    layout: pageData.howItWorks.layout || prev.layout,
                    connectorsVisible: pageData.howItWorks.connectorsVisible ?? prev.connectorsVisible,
                    borderRadius: pageData.howItWorks.borderRadius || prev.borderRadius
                }));
            }

            if (pageData.pricing) {
                setPricingSection(prev => ({
                    ...prev,
                    title: pageData.pricing.title || prev.title,
                    subtitle: pageData.pricing.subtitle || prev.subtitle,
                    backgroundColor: pageData.pricing.backgroundColor || prev.backgroundColor,
                    textColor: pageData.pricing.textColor || prev.textColor,
                    subtitleColor: pageData.pricing.subtitleColor || prev.subtitleColor,
                    buttonText: pageData.pricing.buttonText || prev.buttonText,
                    buttonTextColor: pageData.pricing.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.pricing.buttonBgColor || prev.buttonBgColor,
                    cardBgColor: pageData.pricing.cardBgColor || prev.cardBgColor,
                    highlightedCardIndex: pageData.pricing.highlightedCardIndex ?? prev.highlightedCardIndex,
                    highlightColor: pageData.pricing.highlightColor || prev.highlightColor,
                    titleSize: pageData.pricing.titleSize || prev.titleSize,
                    subtitleSize: pageData.pricing.subtitleSize || prev.subtitleSize,
                    paddingY: pageData.pricing.paddingY || prev.paddingY,
                    layout: pageData.pricing.layout || prev.layout,
                    columns: pageData.pricing.columns || prev.columns,
                    showComparison: pageData.pricing.showComparison ?? prev.showComparison
                }));

                if (pageData.pricing.cards) {
                    setPricingCards(pageData.pricing.cards);
                }
            }

            if (pageData.cta) {
                setCtaSection(prev => ({
                    ...prev,
                    title: pageData.cta.title || prev.title,
                    description: pageData.cta.description || prev.description,
                    backgroundColor: pageData.cta.backgroundColor || prev.backgroundColor,
                    textColor: pageData.cta.textColor || prev.textColor,
                    descriptionColor: pageData.cta.descriptionColor || prev.descriptionColor,
                    buttonTextColor: pageData.cta.buttonTextColor || prev.buttonTextColor,
                    buttonBgColor: pageData.cta.buttonBgColor || prev.buttonBgColor,
                    buttonText: pageData.cta.buttonText || prev.buttonText,
                    secondaryButtonText: pageData.cta.secondaryButtonText || prev.secondaryButtonText,
                    secondaryButtonTextColor: pageData.cta.secondaryButtonTextColor || prev.secondaryButtonTextColor,
                    secondaryButtonBgColor: pageData.cta.secondaryButtonBgColor || prev.secondaryButtonBgColor,
                    showSecondaryButton: pageData.cta.showSecondaryButton ?? prev.showSecondaryButton,
                    backgroundImage: pageData.cta.backgroundImage?.url || prev.backgroundImage,
                    backgroundOverlay: pageData.cta.backgroundOverlay ?? prev.backgroundOverlay,
                    overlayOpacity: pageData.cta.overlayOpacity || prev.overlayOpacity,
                    paddingY: pageData.cta.paddingY || prev.paddingY,
                    titleSize: pageData.cta.titleSize || prev.titleSize,
                    descriptionSize: pageData.cta.descriptionSize || prev.descriptionSize,
                    layout: pageData.cta.layout || prev.layout,
                    showImage: pageData.cta.showImage ?? prev.showImage,
                    image: pageData.cta.image?.url || prev.image,
                    borderRadius: pageData.cta.borderRadius || prev.borderRadius
                }));
            }

            if (pageData.testimonials) {
                setTestimonialsSection(prev => ({
                    ...prev,
                    title: pageData.testimonials.title || prev.title,
                    description: pageData.testimonials.description || prev.description,
                    backgroundColor: pageData.testimonials.backgroundColor || prev.backgroundColor,
                    textColor: pageData.testimonials.textColor || prev.textColor,
                    accentColor: pageData.testimonials.accentColor || prev.accentColor,
                    paddingY: pageData.testimonials.paddingY || prev.paddingY,
                    layout: pageData.testimonials.layout || prev.layout,
                    showRatings: pageData.testimonials.showRatings ?? prev.showRatings,
                    showCompanyLogos: pageData.testimonials.showCompanyLogos ?? prev.showCompanyLogos,
                    titleSize: pageData.testimonials.titleSize || prev.titleSize,
                    descriptionSize: pageData.testimonials.descriptionSize || prev.descriptionSize,
                    testimonialBgColor: pageData.testimonials.testimonialBgColor || prev.testimonialBgColor,
                    testimonialTextColor: pageData.testimonials.testimonialTextColor || prev.testimonialTextColor,
                    quoteColor: pageData.testimonials.quoteColor || prev.quoteColor,
                    borderRadius: pageData.testimonials.borderRadius || prev.borderRadius,
                    testimonials: pageData.testimonials.testimonials || prev.testimonials
                }));
            }

            if (pageData.stats) {
                setStatsSection(prev => ({
                    ...prev,
                    title: pageData.stats.title || prev.title,
                    description: pageData.stats.description || prev.description,
                    backgroundColor: pageData.stats.backgroundColor || prev.backgroundColor,
                    textColor: pageData.stats.textColor || prev.textColor,
                    accentColor: pageData.stats.accentColor || prev.accentColor,
                    statColor: pageData.stats.statColor || prev.statColor,
                    statLabelColor: pageData.stats.statLabelColor || prev.statLabelColor,
                    paddingY: pageData.stats.paddingY || prev.paddingY,
                    titleSize: pageData.stats.titleSize || prev.titleSize,
                    descriptionSize: pageData.stats.descriptionSize || prev.descriptionSize,
                    statSize: pageData.stats.statSize || prev.statSize,
                    layout: pageData.stats.layout || prev.layout,
                    borderRadius: pageData.stats.borderRadius || prev.borderRadius,
                    showDividers: pageData.stats.showDividers ?? prev.showDividers,
                    animateNumbers: pageData.stats.animateNumbers ?? prev.animateNumbers,
                    stats: pageData.stats.stats || prev.stats
                }));
            }

            if (pageData.pageSettings) {
                setPageSettings(prev => ({
                    ...prev,
                    fontFamily: pageData.pageSettings.fontFamily || prev.fontFamily,
                    primaryColor: pageData.pageSettings.primaryColor || prev.primaryColor,
                    secondaryColor: pageData.pageSettings.secondaryColor || prev.secondaryColor,
                    spacing: pageData.pageSettings.spacing || prev.spacing,
                    animations: pageData.pageSettings.animations || prev.animations,
                    containerWidth: pageData.pageSettings.containerWidth || prev.containerWidth,
                    cornerStyle: pageData.pageSettings.cornerStyle || prev.cornerStyle,
                    sectionGaps: pageData.pageSettings.sectionGaps || prev.sectionGaps
                }));
            }
        }
    }, [isInitialized, pageData, initializePage]);

    // Function to save various section data
    const saveHeaderSection = () => {
        saveHeaderData(headerSection);
        setHeaderSection(prev => ({ ...prev, editing: false }));
    };

    const saveAboutSection = () => {
        sendAboutUsData(aboutSection);
        setAboutSection(prev => ({ ...prev, editing: false }));
    };

    const saveFeaturesSection = () => {
        sendFeaturesData(featuresSection);
        setFeaturesSection(prev => ({ ...prev, editing: false }));
    };

    const saveHowItWorksSection = () => {
        sendHowItWorksData(howItWorksSection);
        setHowItWorksSection(prev => ({ ...prev, editing: false }));
    };

    const savePricingSection = () => {
        sendPricingData({
            ...pricingSection,
            cards: pricingCards
        });
        setPricingSection(prev => ({ ...prev, editing: false }));
    };

    const saveCtaSection = () => {
        sendCtaData(ctaSection);
        setCtaSection(prev => ({ ...prev, editing: false }));
    };

    const saveTestimonialsSection = () => {
        sendTestimonialsData(testimonialsSection);
        setTestimonialsSection(prev => ({ ...prev, editing: false }));
    };

    const saveStatsSection = () => {
        sendStatsData(statsSection);
        setStatsSection(prev => ({ ...prev, editing: false }));
    };

    const savePageSettingsData = () => {
        sendPageSettings(pageSettings);
        setPageSettings(prev => ({ ...prev, showPageSettings: false }));
    };

    if (loading) {
        return <LoadingSpinner text="Loading page editor..." />;
    }

    return (
        <div className={`font-${pageSettings.fontFamily}`} style={{
            "--primary-color": pageSettings.primaryColor,
            "--secondary-color": pageSettings.secondaryColor,
        }}>
            {/* Page Settings Modal */}
            {pageSettings.showPageSettings && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-4">Page Settings</h2>

                        {/* Font Family */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Font Family</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.fontFamily}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                            >
                                <option value="sans">Sans-serif</option>
                                <option value="serif">Serif</option>
                                <option value="mono">Monospace</option>
                            </select>
                        </div>

                        {/* Primary Color */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Primary Color</label>
                            <input
                                type="color"
                                className="w-full h-10 border border-gray-300 rounded"
                                value={pageSettings.primaryColor}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                            />
                        </div>

                        {/* Secondary Color */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Secondary Color</label>
                            <input
                                type="color"
                                className="w-full h-10 border border-gray-300 rounded"
                                value={pageSettings.secondaryColor}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                            />
                        </div>

                        {/* Spacing */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Spacing</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.spacing}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, spacing: e.target.value }))}
                            >
                                <option value="compact">Compact</option>
                                <option value="default">Default</option>
                                <option value="spacious">Spacious</option>
                            </select>
                        </div>

                        {/* Animations */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Animations</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.animations}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, animations: e.target.value }))}
                            >
                                <option value="none">None</option>
                                <option value="subtle">Subtle</option>
                                <option value="moderate">Moderate</option>
                                <option value="dynamic">Dynamic</option>
                            </select>
                        </div>

                        {/* Container Width */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Container Width</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.containerWidth}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, containerWidth: e.target.value }))}
                            >
                                <option value="sm">Small</option>
                                <option value="md">Medium</option>
                                <option value="lg">Large</option>
                                <option value="xl">Extra Large</option>
                                <option value="2xl">2XL</option>
                                <option value="3xl">3XL</option>
                                <option value="4xl">4XL</option>
                                <option value="5xl">5XL</option>
                                <option value="6xl">6XL</option>
                                <option value="7xl">7XL</option>
                            </select>
                        </div>

                        {/* Corner Style */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Corner Style</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.cornerStyle}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, cornerStyle: e.target.value }))}
                            >
                                <option value="sharp">Sharp</option>
                                <option value="rounded">Rounded</option>
                                <option value="pill">Pill</option>
                            </select>
                        </div>

                        {/* Section Gaps */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Section Gaps</label>
                            <select
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                value={pageSettings.sectionGaps}
                                onChange={(e) => setPageSettings(prev => ({ ...prev, sectionGaps: e.target.value }))}
                            >
                                <option value="0">None</option>
                                <option value="4">Small</option>
                                <option value="8">Medium</option>
                                <option value="12">Large</option>
                                <option value="16">Extra Large</option>
                            </select>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded mr-2"
                                onClick={() => setPageSettings(prev => ({ ...prev, showPageSettings: false }))}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={savePageSettingsData}
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Page Control Panel */}
            <div className="fixed bottom-4 right-4 z-40">
                <button
                    className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
                    onClick={() => setPageSettings(prev => ({ ...prev, showPageSettings: true }))}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>

            {/* Main Content */}
            <div className="flex flex-col min-h-screen">
                {/* Header Section */}
                <section
                    className={`relative flex items-center h-${headerSection.height}`}
                    style={{
                        backgroundImage: `url(${headerSection.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {/* Gradient Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to right, ${headerSection.gradientStartColor}, ${headerSection.gradientEndColor})`,
                            opacity: headerSection.gradientOpacity
                        }}
                    ></div>

                    <div className={`container mx-auto px-4 relative text-${headerSection.textAlignment} z-10`}>
                        <div className={`max-w-${headerSection.descriptionMaxWidth} mx-auto`}>
                            <h1
                                className={`text-5xl font-bold mb-6`}
                                style={{ color: headerSection.textColor }}
                            >
                                {headerSection.text}
                            </h1>
                            <p
                                className="text-xl mb-8"
                                style={{ color: headerSection.textColor }}
                            >
                                {headerSection.description}
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    className="px-6 py-3 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: headerSection.buttonBgColor,
                                        color: headerSection.buttonTextColor
                                    }}
                                >
                                    {headerSection.buttonText}
                                </button>
                                <button
                                    className="px-6 py-3 rounded-lg font-medium"
                                    style={{
                                        backgroundColor: headerSection.secondaryButtonBgColor,
                                        color: headerSection.secondaryButtonTextColor
                                    }}
                                >
                                    {headerSection.secondaryButtonText}
                                </button>
                            </div>
                        </div>
                    </div>

                    {headerSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveHeaderSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* About Section */}
                <section
                    className={`py-${aboutSection.paddingY}`}
                    style={{ backgroundColor: aboutSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className={`flex flex-col md:flex-row ${aboutSection.imagePosition === 'right' ? '' : 'md:flex-row-reverse'} items-center gap-8`}>
                            <div className="w-full md:w-1/2">
                                <img
                                    src={aboutSection.image}
                                    alt="About Us"
                                    className={`w-full h-auto rounded-${aboutSection.borderRadius}`}
                                />
                            </div>
                            <div className="w-full md:w-1/2">
                                <h2
                                    className={`text-${aboutSection.titleSize} font-bold mb-6`}
                                    style={{ color: aboutSection.textColor }}
                                >
                                    {aboutSection.title}
                                </h2>
                                <p
                                    className={`text-${aboutSection.contentSize} mb-8`}
                                    style={{ color: aboutSection.textColor }}
                                >
                                    {aboutSection.content}
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        className="px-6 py-3 rounded-lg font-medium"
                                        style={{
                                            backgroundColor: aboutSection.buttonBgColor,
                                            color: aboutSection.buttonTextColor
                                        }}
                                    >
                                        {aboutSection.buttonText}
                                    </button>
                                    <button
                                        className="px-6 py-3 rounded-lg font-medium"
                                        style={{
                                            backgroundColor: aboutSection.secondaryButtonBgColor,
                                            color: aboutSection.secondaryButtonTextColor
                                        }}
                                    >
                                        {aboutSection.secondaryButtonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {aboutSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveAboutSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* Features Section */}
                <section
                    className={`py-${featuresSection.paddingY}`}
                    style={{ backgroundColor: featuresSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className="text-center mb-12">
                            <h2
                                className={`text-${featuresSection.titleSize} font-bold mb-4`}
                                style={{ color: featuresSection.textColor }}
                            >
                                {featuresSection.title}
                            </h2>
                            <p
                                className={`text-${featuresSection.contentSize} max-w-3xl mx-auto`}
                                style={{ color: featuresSection.textColor }}
                            >
                                {featuresSection.content}
                            </p>
                        </div>

                        <div className={`${featuresSection.layout === 'standard' ? 'flex flex-wrap justify-center' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}`}>
                            {featuresSection.features.map((feature, index) => (
                                <div key={index} className="p-6 flex flex-col items-center text-center">
                                    <div
                                        className="w-16 h-16 flex items-center justify-center rounded-full mb-4"
                                        style={{ color: featuresSection.iconColor }}
                                    >
                                        {icons[feature.icon]}
                                    </div>
                                    <h3
                                        className="text-xl font-semibold mb-2"
                                        style={{ color: featuresSection.textColor }}
                                    >
                                        {feature.text}
                                    </h3>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 text-center">
                            <button
                                className="px-6 py-3 rounded-lg font-medium mr-4"
                                style={{
                                    backgroundColor: featuresSection.buttonBgColor,
                                    color: featuresSection.buttonTextColor
                                }}
                            >
                                {featuresSection.buttonText}
                            </button>
                            <button
                                className="px-6 py-3 rounded-lg font-medium"
                                style={{
                                    backgroundColor: featuresSection.secondaryButtonBgColor,
                                    color: featuresSection.secondaryButtonTextColor
                                }}
                            >
                                {featuresSection.secondaryButtonText}
                            </button>
                        </div>
                    </div>

                    {featuresSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveFeaturesSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* How It Works Section */}
                <section
                    className={`py-${howItWorksSection.paddingY}`}
                    style={{ backgroundColor: howItWorksSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className="text-center mb-16">
                            <h2
                                className={`text-${howItWorksSection.titleSize} font-bold mb-4`}
                                style={{ color: howItWorksSection.textColor }}
                            >
                                {howItWorksSection.title}
                            </h2>
                            <p
                                className={`text-${howItWorksSection.descriptionSize} max-w-3xl mx-auto`}
                                style={{ color: howItWorksSection.textColor }}
                            >
                                {howItWorksSection.description}
                            </p>
                        </div>

                        <div className={`${howItWorksSection.layout === 'horizontal' ? 'flex flex-col md:flex-row justify-between' : 'space-y-12'}`}>
                            {howItWorksSection.steps.map((step, index) => (
                                <div key={index} className={`${howItWorksSection.layout === 'horizontal' ? 'w-full md:w-1/3 px-4' : ''} flex flex-col items-center text-center`}>
                                    <div
                                        className="w-16 h-16 flex items-center justify-center rounded-full mb-4 relative"
                                        style={{
                                            backgroundColor: howItWorksSection.stepBgColor,
                                            color: howItWorksSection.numberColor
                                        }}
                                    >
                                        <span className="text-xl font-bold">{index + 1}</span>
                                        {howItWorksSection.connectorsVisible && index < howItWorksSection.steps.length - 1 && (
                                            <div className={`hidden md:block absolute ${howItWorksSection.layout === 'horizontal' ? 'top-1/2 left-full w-full h-0.5' : 'top-full left-1/2 w-0.5 h-12'}`} style={{ backgroundColor: howItWorksSection.accentColor }}></div>
                                        )}
                                    </div>
                                    <h3
                                        className={`text-${howItWorksSection.stepTitleSize} font-semibold mb-2`}
                                        style={{ color: howItWorksSection.stepTextColor }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p style={{ color: howItWorksSection.stepTextColor }}>
                                        {step.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {howItWorksSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveHowItWorksSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* Pricing Section */}
                <section
                    className={`py-${pricingSection.paddingY}`}
                    style={{ backgroundColor: pricingSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className="text-center mb-16">
                            <h2
                                className={`text-${pricingSection.titleSize} font-bold mb-4`}
                                style={{ color: pricingSection.textColor }}
                            >
                                {pricingSection.title}
                            </h2>
                            <p
                                className={`text-${pricingSection.subtitleSize} max-w-3xl mx-auto`}
                                style={{ color: pricingSection.subtitleColor }}
                            >
                                {pricingSection.subtitle}
                            </p>
                        </div>

                        <div className={`${pricingSection.layout === 'grid' ? `grid grid-cols-1 ${pricingSection.columns > 1 ? 'md:grid-cols-' + pricingSection.columns : ''} gap-8` : 'flex overflow-x-auto space-x-6 pb-8'}`}>
                            {pricingCards.map((card, index) => (
                                <div
                                    key={index}
                                    className={`${pricingSection.layout === 'grid' ? 'w-full' : 'min-w-[320px]'} p-8 rounded-xl ${index === pricingSection.highlightedCardIndex ? 'shadow-xl border-t-4' : 'shadow-lg'}`}
                                    style={{
                                        backgroundColor: pricingSection.cardBgColor,
                                        borderColor: index === pricingSection.highlightedCardIndex ? pricingSection.highlightColor : 'transparent'
                                    }}
                                >
                                    <h3
                                        className="text-2xl font-bold mb-2"
                                        style={{ color: pricingSection.textColor }}
                                    >
                                        {card.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">{card.description}</p>
                                    <div
                                        className="text-4xl font-bold mb-6"
                                        style={{ color: card.priceColor }}
                                    >
                                        {card.price}
                                    </div>
                                    <ul className="mb-8 space-y-3">
                                        {card.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-center">
                                                {feature.included ? (
                                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                                <span>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        className="w-full py-3 rounded-lg font-medium"
                                        style={{
                                            backgroundColor: card.buttonBgColor,
                                            color: card.buttonTextColor
                                        }}
                                    >
                                        {card.buttonText}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {pricingSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={savePricingSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* Testimonials Section */}
                <section
                    className={`py-${testimonialsSection.paddingY}`}
                    style={{ backgroundColor: testimonialsSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className="text-center mb-16">
                            <h2
                                className={`text-${testimonialsSection.titleSize} font-bold mb-4`}
                                style={{ color: testimonialsSection.textColor }}
                            >
                                {testimonialsSection.title}
                            </h2>
                            <p
                                className={`text-${testimonialsSection.descriptionSize} max-w-3xl mx-auto`}
                                style={{ color: testimonialsSection.textColor }}
                            >
                                {testimonialsSection.description}
                            </p>
                        </div>

                        <div className={`${testimonialsSection.layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : testimonialsSection.layout === 'masonry' ? 'columns-1 md:columns-3 gap-8' : 'flex overflow-x-auto space-x-6 pb-8'}`}>
                            {testimonialsSection.testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className={`${testimonialsSection.layout === 'slider' ? 'min-w-[320px]' : ''} p-6 rounded-${testimonialsSection.borderRadius} mb-8`}
                                    style={{ backgroundColor: testimonialsSection.testimonialBgColor }}
                                >
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full mr-4"
                                        />
                                        <div>
                                            <h4
                                                className="font-bold"
                                                style={{ color: testimonialsSection.testimonialTextColor }}
                                            >
                                                {testimonial.name}
                                            </h4>
                                            <p className="text-sm text-gray-600">{testimonial.position}</p>
                                        </div>
                                    </div>
                                    {testimonialsSection.showRatings && (
                                        <div className="flex mb-4">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    className="w-5 h-5 mr-1"
                                                    fill={i < testimonial.rating ? testimonialsSection.accentColor : "#e2e8f0"}
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            ))}
                                        </div>
                                    )}
                                    <p
                                        className="relative pl-8"
                                        style={{ color: testimonialsSection.testimonialTextColor }}
                                    >
                                        <svg
                                            className="absolute top-0 left-0 w-6 h-6 transform -translate-y-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            style={{ color: testimonialsSection.quoteColor }}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4" />
                                        </svg>
                                        {testimonial.content}
                                    </p>
                                    {testimonialsSection.showCompanyLogos && testimonial.companyLogo && (
                                        <div className="mt-4 pt-4 border-t">
                                            <img
                                                src={testimonial.companyLogo}
                                                alt={testimonial.company}
                                                className="h-8"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {testimonialsSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveTestimonialsSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* Stats Section */}
                <section
                    className={`py-${statsSection.paddingY}`}
                    style={{ backgroundColor: statsSection.backgroundColor }}
                >
                    <div className={`container mx-auto px-4 max-w-${pageSettings.containerWidth}`}>
                        <div className="text-center mb-16">
                            <h2
                                className={`text-${statsSection.titleSize} font-bold mb-4`}
                                style={{ color: statsSection.textColor }}
                            >
                                {statsSection.title}
                            </h2>
                            <p
                                className={`text-${statsSection.descriptionSize} max-w-3xl mx-auto`}
                                style={{ color: statsSection.textColor }}
                            >
                                {statsSection.description}
                            </p>
                        </div>

                        <div className={`${statsSection.layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-4 gap-y-12' : 'grid grid-cols-1 md:grid-cols-4 gap-8'}`}>
                            {statsSection.stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`${statsSection.layout === 'grid' ? 'flex flex-col items-center text-center' : 'p-8 rounded-xl shadow-lg'}`}
                                    style={{ backgroundColor: statsSection.layout === 'cards' ? statsSection.backgroundColor : 'transparent' }}
                                >
                                    <div
                                        className="flex items-center justify-center w-12 h-12 rounded-full mb-4"
                                        style={{ backgroundColor: statsSection.accentColor, color: '#ffffff' }}
                                    >
                                        {icons[stat.icon]}
                                    </div>
                                    <div
                                        className={`text-${statsSection.statSize} font-bold mb-2`}
                                        style={{ color: statsSection.statColor }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div
                                        className="text-lg"
                                        style={{ color: statsSection.statLabelColor }}
                                    >
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {statsSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveStatsSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>

                {/* CTA Section */}
                <section
                    className={`py-${ctaSection.paddingY} relative overflow-hidden`}
                    style={{
                        backgroundColor: ctaSection.backgroundColor,
                        backgroundImage: ctaSection.backgroundImage ? `url(${ctaSection.backgroundImage})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    {ctaSection.backgroundOverlay && (
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundColor: ctaSection.backgroundColor,
                                opacity: ctaSection.overlayOpacity
                            }}
                        ></div>
                    )}



                    {ctaSection.editing && (
                        <div className="absolute bottom-4 right-4">
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={saveCtaSection}
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default EditablePage;