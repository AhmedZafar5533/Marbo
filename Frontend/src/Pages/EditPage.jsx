import React, { useReducer, useEffect } from "react";
import { useServiceStore } from "../../Store/servicesStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

// Define initial state
const initialState = {
    header: {
        text: "Transform Your Business with Digital Excellence",
        description:
            "Empower your organization with cutting-edge digital solutions...",
        image: "https://via.placeholder.com/1920x800",
        gradientOpacity: 0.8,
        textColor: "#ffffff",
        editing: false,
        original: null,
    },
    about: {
        title: "About Our Digital Solutions",
        content:
            "We specialize in creating transformative digital experiences...",
        image: "https://via.placeholder.com/600x400",
        editing: false,
        original: null,
    },
    features: {
        title: "Powerful Features for Modern Businesses",
        content: "Discover how our comprehensive suite of tools...",
        features: [
            { text: "Cloud-based Infrastructure" },
            { text: "Real-time Analytics" },
            { text: "AI-powered Insights" },
            { text: "Secure API Integrations" },
        ],
        image: "https://via.placeholder.com/600x400",
        editing: false,
        original: null,
    },
    howItWorks: {
        title: "How We Drive Your Digital Success",
        description: "A simple three-step process to transform your business",
        steps: [
            {
                title: "Discovery & Planning",
                content:
                    "We analyze your business needs and create a customized digital roadmap",
            },
            {
                title: "Discovery ",
                content:
                    "We analyze your business needs and create a customized digital roadmap",
            },
            {
                title: "Discovery & Planning",
                content:
                    "We analyze your business needs and create a customized digital roadmap",
            },


        ],
        editing: false,
        original: null,
    },
    pricing: {
        cards: [
            {
                title: "Starter Plan",
                price: "$299/mo",
                description: "Perfect for startups and small businesses",
                features: [
                    { text: "Up to 10 users" },
                    { text: "Basic analytics dashboard" },
                    { text: "Email support" },
                ],
            },
            {
                title: "Starter Plan",
                price: "$299/mo",
                description: "Perfect for startups and small businesses",
                features: [
                    { text: "Up to 10 users" },
                    { text: "Basic analytics dashboard" },
                    { text: "Email support" },
                ],
            },
            {
                title: "Starter Plan",
                price: "$299/mo",
                description: "Perfect for startups and small businesses",
                features: [
                    { text: "Up to 10 users" },
                    { text: "Basic analytics dashboard" },
                    { text: "Email support" },
                ],
            },
            // other pricing cards
        ],
        editing: false,
        original: null,
    },
};

// Define reducer function
function pageReducer(state, action) {
    switch (action.type) {
        case "LOAD_PAGE_DATA":
            const { pageData } = action.payload;
            return {
                ...state,
                header: {
                    ...state.header,
                    text: pageData.header?.text || state.header.text,
                    description:
                        pageData.header?.description ||
                        state.header.description,
                    image: pageData.header?.image?.url || state.header.image,
                    gradientOpacity:
                        pageData.header?.gradientOpacity ||
                        state.header.gradientOpacity,
                    textColor:
                        pageData.header?.textColor || state.header.textColor,
                },
                about: {
                    ...state.about,
                    title: pageData.about?.title || state.about.title,
                    content: pageData.about?.content || state.about.content,
                    image: pageData.about?.image?.url || state.about.image,
                },
                features: {
                    ...state.features,
                    title: pageData.features?.title || state.features.title,
                    content:
                        pageData.features?.content || state.features.content,
                    features:
                        pageData.features?.features || state.features.features,
                    image:
                        pageData.features?.image?.url || state.features.image,
                },
                howItWorks: {
                    ...state.howItWorks,
                    title: pageData.howItWorks?.title || state.howItWorks.title,
                    description:
                        pageData.howItWorks?.description ||
                        state.howItWorks.description,
                    steps: pageData.howItWorks?.steps || state.howItWorks.steps,
                },
                pricing: {
                    ...state.pricing,
                    cards: pageData.pricing?.cards || state.pricing.cards,
                },
            };

        case "SET_EDITING_SECTION":
            const { section, isEditing } = action.payload;
            return {
                ...state,
                [section]: {
                    ...state[section],
                    editing: isEditing,
                    original: isEditing
                        ? { ...state[section] }
                        : state[section].original,
                },
            };

        case "UPDATE_SECTION":
            const { sectionName, updates } = action.payload;
            return {
                ...state,
                [sectionName]: {
                    ...state[sectionName],
                    ...updates,
                },
            };

        case "CANCEL_EDITING":
            const { sectionToCancel } = action.payload;
            return {
                ...state,
                [sectionToCancel]: {
                    ...state[sectionToCancel].original,
                    editing: false,
                    original: null,
                },
            };

        // Additional cases for specific updates...
        default:
            return state;
    }
}

function EditablePage() {
    const [state, dispatch] = useReducer(pageReducer, initialState);
    const { id } = useParams();
    const { user } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        if (user.onboardingDone == 'no') {
            navigate("/goto/onboarding");
        }
        if (user.onboardingDone === 'pending')
            navigate("/vendor/wait/review");
    }, [user, navigate]);

    const {
        getPageData,
        loading,
        saveHeaderData,
        isInitialized,
        sendAboutUsData,
        sendFeaturesData,
        sendHowItWorksData,
        sendPricingData,
        initializeServicePage,
        pageIsInitialized,
        servicePage: pageData = null,
    } = useServiceStore();
    // Combine initialization effects
    useEffect(() => {
        // Only run initialization logic once
        const initPage = async () => {
            if (!pageIsInitialized) {
                await initializeServicePage(user._id);
            }

            if (!isInitialized && pageIsInitialized) {
                await getPageData(user._id);
            }
        };

        initPage();
    }, [
        pageIsInitialized,
        isInitialized,
        initializeServicePage,
        getPageData,
        id,
    ]);

    // Update local state when page data is loaded
    useEffect(() => {
        if (pageData) {
            dispatch({ type: "LOAD_PAGE_DATA", payload: { pageData } });
        }
    }, [pageData]);

    // Helper function for identifying image type
    const identifyImageType = (imageSource) => {
        if (imageSource && imageSource.startsWith("data:image")) {
            return { type: "base64Image", value: imageSource };
        } else {
            return { type: "imageUrl", value: imageSource };
        }
    };

    // Header section
    const handleSaveHeader = async () => {
        const { header } = state;
        const imageData = identifyImageType(header.image);

        const headerData = {
            text: header.text,
            description: header.description,
            [imageData.type]: imageData.value,
            gradientOpacity: header.gradientOpacity,
            textColor: header.textColor,
        };

        await saveHeaderData(headerData, user._id);
        dispatch({
            type: "SET_EDITING_SECTION",
            payload: { section: "header", isEditing: false },
        });
    };

    // About section
    const handleSaveAbout = async () => {
        const { about } = state;
        const imageData = identifyImageType(about.image);

        const aboutData = {
            title: about.title,
            content: about.content,
            [imageData.type]: imageData.value,
        };

        await sendAboutUsData(aboutData, user._id);
        dispatch({
            type: "SET_EDITING_SECTION",
            payload: { section: "about", isEditing: false },
        });
    };

    // Features section
    const handleSaveFeatures = async () => {
        const { features } = state;
        const imageData = identifyImageType(features.image);

        const featuresData = {
            title: features.title,
            content: features.content,
            [imageData.type]: imageData.value,
            features: features.features.map((f) => f.text),
        };

        await sendFeaturesData(featuresData, user._id);
        dispatch({
            type: "SET_EDITING_SECTION",
            payload: { section: "features", isEditing: false },
        });
    };

    // How It Works section
    const handleSaveHowItWorks = async () => {
        const { howItWorks } = state;

        const howItWorksData = {
            title: howItWorks.title,
            description: howItWorks.description,
            steps: howItWorks.steps,
        };

        await sendHowItWorksData(howItWorksData, user._id);
        dispatch({
            type: "SET_EDITING_SECTION",
            payload: { section: "howItWorks", isEditing: false },
        });
    };

    // Pricing section
    const handleSavePricing = async () => {
        const { pricing } = state;

        const pricingData = pricing.cards.map((card) => ({
            title: card.title,
            price: card.price,
            description: card.description,
            features: card.features.map((f) => f.text),
        }));

        await sendPricingData(pricingData, user._id);
        dispatch({
            type: "SET_EDITING_SECTION",
            payload: { section: "pricing", isEditing: false },
        });
    };

    // ... similar handlers for other sections

    // Handle image upload
    const handleImageUpload = (event, section, imageField) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({
                    type: "UPDATE_SECTION",
                    payload: {
                        sectionName: section,
                        updates: { [imageField]: reader.result },
                    },
                });
            };
            reader.readAsDataURL(file);
        }
    };

    // Cancel handlers for all sections

    // Header section
    const handleCancelHeader = () => {
        dispatch({
            type: "CANCEL_EDITING",
            payload: { sectionToCancel: "header" },
        });
    };

    // About section
    const handleCancelAbout = () => {
        dispatch({
            type: "CANCEL_EDITING",
            payload: { sectionToCancel: "about" },
        });
    };

    // Features section
    const handleCancelFeatures = () => {
        dispatch({
            type: "CANCEL_EDITING",
            payload: { sectionToCancel: "features" },
        });
    };

    // How It Works section
    const handleCancelHowItWorks = () => {
        dispatch({
            type: "CANCEL_EDITING",
            payload: { sectionToCancel: "howItWorks" },
        });
    };

    // Pricing section
    const handleCancelPricing = () => {
        dispatch({
            type: "CANCEL_EDITING",
            payload: { sectionToCancel: "pricing" },
        });
    };
    // Update handlers for individual fields

    // Update header field
    const updateHeaderField = (field, value) => {
        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "header",
                updates: { [field]: value },
            },
        });
    };

    // Update about field
    const updateAboutField = (field, value) => {
        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "about",
                updates: { [field]: value },
            },
        });
    };

    // Update feature item
    const updateFeatureItem = (index, value) => {
        const newFeatures = [...state.features.features];
        newFeatures[index] = { text: value };

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "features",
                updates: { features: newFeatures },
            },
        });
    };

    // Update how it works step
    const updateHowItWorksStep = (index, field, value) => {
        const newSteps = [...state.howItWorks.steps];
        newSteps[index] = { ...newSteps[index], [field]: value };

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "howItWorks",
                updates: { steps: newSteps },
            },
        });
    };

    // Update pricing card
    const updatePricingCard = (index, field, value) => {
        const newCards = [...state.pricing.cards];
        newCards[index] = { ...newCards[index], [field]: value };

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "pricing",
                updates: { cards: newCards },
            },
        });
    };

    // Update pricing card feature
    const updatePricingCardFeature = (cardIndex, featureIndex, value) => {
        const newCards = [...state.pricing.cards];
        newCards[cardIndex] = {
            ...newCards[cardIndex],
            features: [...newCards[cardIndex].features],
        };
        newCards[cardIndex].features[featureIndex] = { text: value };

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "pricing",
                updates: { cards: newCards },
            },
        });
    };

    // Delete pricing card feature
    const deletePricingCardFeature = (cardIndex, featureIndex) => {
        const newCards = [...state.pricing.cards];
        newCards[cardIndex] = {
            ...newCards[cardIndex],
            features: [...newCards[cardIndex].features],
        };
        newCards[cardIndex].features.splice(featureIndex, 1);

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "pricing",
                updates: { cards: newCards },
            },
        });
    };

    // Add pricing card feature
    const addPricingCardFeature = (cardIndex) => {
        const newCards = [...state.pricing.cards];
        newCards[cardIndex] = {
            ...newCards[cardIndex],
            features: [
                ...newCards[cardIndex].features,
                { text: "New feature" },
            ],
        };

        dispatch({
            type: "UPDATE_SECTION",
            payload: {
                sectionName: "pricing",
                updates: { cards: newCards },
            },
        });
    };

    if (loading) return <LoadingSpinner />;

    // Render component with state from reducer
    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            {/* Hero Section */}
            <section className={`relative ${state.header.editing ? "h-[100vh]" : "h-[90vh] md:h-[90vh]"} flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 overflow-hidden">
                    <img
                        src={state.header.image}
                        alt="Background"
                        className="w-full h-full object-cover transform scale-105"
                    />
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900"
                        style={{ opacity: state.header.gradientOpacity }}
                    />
                </div>

                <div className="relative max-w-7xl px-4 sm:px-6 text-center space-y-10 py-8">
                    <div className="space-y-8">
                        {state.header.editing ? (
                            <input
                                value={state.header.text}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "header",
                                            updates: { text: e.target.value }
                                        }
                                    })
                                }
                                className="text-4xl sm:text-5xl md:text-6xl font-bold bg-transparent border-b-2 border-white/50 text-center focus:outline-none w-full max-w-[95%] mx-auto leading-tight tracking-tight"
                                style={{ color: state.header.textColor }}
                            />
                        ) : (
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold px-2 leading-tight tracking-tight -mt-20"
                                style={{ color: state.header.textColor }}>
                                {state.header.text}
                            </h1>
                        )}

                        {state.header.editing ? (
                            <textarea
                                value={state.header.description}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "header",
                                            updates: { description: e.target.value }
                                        }
                                    })
                                }
                                className="text-lg sm:text-xl md:text-xl text-white/90 bg-transparent border-b-2 border-white/50 text-center focus:outline-none w-full font-light"
                                rows="2"
                                maxLength={150}
                            />
                        ) : (
                            <p className="text-lg sm:text-xl md:text-xl text-white/90 max-w-2xl mx-auto px-2 font-light">
                                {state.header.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-5 px-2 pt-4">
                        {state.header.editing ? (
                            <>
                                <button onClick={handleSaveHeader} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                                    Save Header
                                </button>
                                <button onClick={handleCancelHeader} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button onClick={() => dispatch({ type: "SET_EDITING_SECTION", payload: { section: "header", isEditing: true } })}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                                Edit Header
                            </button>
                        )}
                    </div>

                    {state.header.editing && (
                        <div className="mt-8 space-y-6 px-2">
                            {/* Image upload and URL inputs */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "header", "image")}
                                className="w-[95%] sm:w-4/5 md:w-1/2 mx-auto p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                            />
                            <input
                                type="text"
                                value={state.header.image}
                                onChange={(e) =>
                                    dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "header",
                                            updates: { image: e.target.value }
                                        }
                                    })
                                }
                                className="w-[95%] sm:w-4/5 md:w-1/2 mx-auto p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                                placeholder="Or enter image URL"
                            />

                            {/* Color picker for text */}
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <div className="flex items-center gap-2">
                                    <label htmlFor="textColorPicker" className="text-white font-medium">
                                        Heading Color:
                                    </label>
                                    <input
                                        id="textColorPicker"
                                        type="color"
                                        value={state.header.textColor || "#ffffff"}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "UPDATE_SECTION",
                                                payload: {
                                                    sectionName: "header",
                                                    updates: { textColor: e.target.value }
                                                }
                                            })
                                        }
                                        className="w-10 h-10 rounded cursor-pointer border-2 border-white/50"
                                    />
                                </div>

                                {/* Gradient opacity slider */}
                                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                                    <label htmlFor="gradientOpacity" className="text-white font-medium">
                                        Overlay Opacity:
                                    </label>
                                    <input
                                        id="gradientOpacity"
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={state.header.gradientOpacity || 0.5}
                                        onChange={(e) =>
                                            dispatch({
                                                type: "UPDATE_SECTION",
                                                payload: {
                                                    sectionName: "header",
                                                    updates: { gradientOpacity: parseFloat(e.target.value) }
                                                }
                                            })
                                        }
                                        className="w-32 md:w-40 h-2 rounded-lg appearance-none bg-white/30 cursor-pointer"
                                    />
                                    <span className="text-white text-sm font-light">
                                        {state.header.gradientOpacity ? (state.header.gradientOpacity * 100).toFixed(0) : "50"}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        {state.about.editing ? (
                            <>
                                <input
                                    value={state.about.title}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_SECTION",
                                            payload: {
                                                sectionName: "about",
                                                updates: { title: e.target.value }
                                            }
                                        })
                                    }
                                    className="text-4xl md:text-5xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none w-full"
                                />
                                <textarea
                                    value={state.about.content}
                                    onChange={(e) =>
                                        dispatch({
                                            type: "UPDATE_SECTION",
                                            payload: {
                                                sectionName: "about",
                                                updates: { content: e.target.value }
                                            }
                                        })
                                    }
                                    className="text-lg text-gray-600 w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </>
                        ) : (
                            <>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    {state.about.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {state.about.content}
                                </p>
                            </>
                        )}

                        <div className="flex gap-4 pt-4">
                            {state.about.editing ? (
                                <>
                                    <button onClick={handleSaveAbout} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full">
                                        Save Changes
                                    </button>
                                    <button onClick={handleCancelAbout} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => dispatch({ type: "SET_EDITING_SECTION", payload: { section: "about", isEditing: true } })}
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full">
                                    Edit Section
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="relative group">
                        {state.about.editing && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, "about", "image")}
                                className="absolute bottom-4 right-4 p-2 bg-white/80 rounded-lg"
                            />
                        )}
                        <img
                            src={state.about.image}
                            alt="About Us"
                            className="rounded-2xl shadow-2xl w-full"
                        />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-indigo-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="space-y-8">
                        <div className="inline-block mb-3">
                            <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                Features
                            </span>
                        </div>

                        {state.features.editing ? (
                            <div className="space-y-6">
                                <input
                                    value={state.features.title}
                                    onChange={(e) => dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "features",
                                            updates: { title: e.target.value }
                                        }
                                    })}
                                    className="text-4xl md:text-5xl font-bold text-gray-900 border-b-2 border-indigo-500 focus:outline-none w-full"
                                />
                                <textarea
                                    value={state.features.content}
                                    onChange={(e) => dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "features",
                                            updates: { content: e.target.value }
                                        }
                                    })}
                                    className="text-lg text-gray-600 w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Features List</h3>
                                    <ul className="space-y-3">
                                        {state.features.features.map((feature, index) => (
                                            <li key={index} className="flex items-center space-x-3">
                                                <input
                                                    value={feature.text}
                                                    onChange={(e) => updateFeatureItem(index, e.target.value)}
                                                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const newFeatures = [...state.features.features];
                                                        newFeatures.splice(index, 1);
                                                        dispatch({
                                                            type: "UPDATE_SECTION",
                                                            payload: {
                                                                sectionName: "features",
                                                                updates: { features: newFeatures }
                                                            }
                                                        });
                                                    }}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => {
                                            const newFeatures = [...state.features.features, { text: "New Feature" }];
                                            dispatch({
                                                type: "UPDATE_SECTION",
                                                payload: {
                                                    sectionName: "features",
                                                    updates: { features: newFeatures }
                                                }
                                            });
                                        }}
                                        className="w-full text-indigo-900 hover:text-indigo-800 font-medium"
                                    >
                                        + Add Feature
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    {state.features.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {state.features.content}
                                </p>
                                <ul className="space-y-6">
                                    {state.features.features.map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="text-xl text-gray-800 font-medium">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <div className="flex gap-4 pt-4">
                            {state.features.editing ? (
                                <>
                                    <button onClick={handleSaveFeatures} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full">
                                        Save Changes
                                    </button>
                                    <button onClick={handleCancelFeatures} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full">
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => dispatch(
                                        { type: "SET_EDITING_SECTION", payload: { section: "features", isEditing: true } })}
                                    className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full"
                                >
                                    Edit Features
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="relative group">
                        {state.features.editing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, "features", "image")}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <span className="text-white text-lg font-medium">Click to upload new image</span>
                            </div>
                        )}
                        <img
                            src={state.features.image}
                            alt="Features"
                            className="rounded-2xl shadow-2xl w-full"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-24 bg-gradient-to-b from-white to-indigo-50">
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center space-y-6">
                        {state.howItWorks.editing ? (
                            <div className="space-y-6">
                                <input
                                    value={state.howItWorks.title}
                                    onChange={(e) => dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "howItWorks",
                                            updates: { title: e.target.value }
                                        }
                                    })}
                                    className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent border-b-2 border-indigo-300 focus:outline-none w-full max-w-2xl mx-auto text-center pb-2"
                                />
                                <textarea
                                    value={state.howItWorks.description}
                                    onChange={(e) => dispatch({
                                        type: "UPDATE_SECTION",
                                        payload: {
                                            sectionName: "howItWorks",
                                            updates: { description: e.target.value }
                                        }
                                    })}
                                    className="text-lg text-gray-600 w-full max-w-2xl mx-auto p-4 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-indigo-300 text-center leading-relaxed"
                                    rows="2"
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {state.howItWorks.title}
                                </h2>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                    {state.howItWorks.description}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 items-start">
                        {state.howItWorks.steps.map((step, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100">
                                {state.howItWorks.editing ? (
                                    <>
                                        <input
                                            value={step.title}
                                            onChange={(e) => updateHowItWorksStep(index, "title", e.target.value)}
                                            className="text-2xl font-bold bg-transparent border-b-2 border-gray-200 focus:border-indigo-600 focus:outline-none w-full pb-2 mb-4"
                                        />
                                        <textarea
                                            value={step.content}
                                            onChange={(e) => updateHowItWorksStep(index, "content", e.target.value)}
                                            className="text-gray-600 w-full p-4 border-2 border-dashed rounded-xl focus:ring-2 focus:ring-indigo-300 bg-white/50 leading-relaxed"
                                            rows="3"
                                        />
                                    </>
                                ) : (
                                    <>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{step.content}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-4">
                        {state.howItWorks.editing ? (
                            <>
                                <button onClick={handleSaveHowItWorks} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full">
                                    Save Changes
                                </button>
                                <button onClick={handleCancelHowItWorks} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full">
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => dispatch({ type: "SET_EDITING_SECTION", payload: { section: "howItWorks", isEditing: true } })}
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full"
                            >
                                Edit Process
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-16">
                    <div className="text-center space-y-6">
                        {state.pricing.editing && (
                            <div className="flex justify-center gap-4">
                                <button onClick={handleSavePricing} className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-full">
                                    Save Pricing
                                </button>
                                <button onClick={handleCancelPricing} className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-full">
                                    Cancel
                                </button>
                            </div>
                        )}
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Transparent Pricing
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {state.pricing.cards.map((card, cardIndex) => (
                            <div key={cardIndex} className="bg-white rounded-3xl shadow-xl p-8">
                                <div className="space-y-8">
                                    {state.pricing.editing ? (
                                        <>
                                            <input
                                                value={card.title}
                                                onChange={(e) => updatePricingCard(cardIndex, "title", e.target.value)}
                                                className="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 w-full"
                                            />
                                            <input
                                                value={card.price}
                                                onChange={(e) => updatePricingCard(cardIndex, "price", e.target.value)}
                                                className="text-5xl font-extrabold text-gray-900 border-b-2 border-indigo-500 w-full"
                                            />
                                            <textarea
                                                value={card.description}
                                                onChange={(e) => updatePricingCard(cardIndex, "description", e.target.value)}
                                                className="text-gray-600 w-full p-3 border rounded-lg"
                                                rows="2"
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-2xl font-bold text-gray-900">{card.title}</h3>
                                            <p className="text-5xl font-extrabold text-gray-900">{card.price}</p>
                                            <p className="text-gray-600 pb-4">{card.description}</p>
                                        </>
                                    )}

                                    <ul className="space-y-4">
                                        {card.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start space-x-3">
                                                {state.pricing.editing ? (
                                                    <>
                                                        <input
                                                            value={feature.text}
                                                            onChange={(e) => updatePricingCardFeature(cardIndex, featureIndex, e.target.value)}
                                                            className="flex-1 p-2 border rounded"
                                                        />
                                                        <button
                                                            onClick={() => deletePricingCardFeature(cardIndex, featureIndex)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-6 h-6 mt-0.5 text-indigo-500" fill="currentColor">
                                                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                                        </svg>
                                                        <span className="text-gray-600">{feature.text}</span>
                                                    </>
                                                )}
                                            </li>
                                        ))}
                                    </ul>

                                    {state.pricing.editing && (
                                        <button
                                            onClick={() => addPricingCardFeature(cardIndex)}
                                            className="w-full text-indigo-900 hover:text-indigo-800 font-medium py-2 border-2 border-dashed rounded-lg"
                                        >
                                            + Add Feature
                                        </button>
                                    )}

                                    <button className="w-full py-4 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200">
                                        Select {card.title}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {!state.pricing.editing && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => dispatch({ type: "SET_EDITING_SECTION", payload: { section: "pricing", isEditing: true } })}
                                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full"
                            >
                                Edit Pricing
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
                <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        Ready to Transform Your Business?
                    </h2>
                    <button className="px-10 py-5 bg-white text-indigo-900 rounded-full text-xl font-bold shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                        Get Started Now
                    </button>
                </div>
            </section>
        </div>
    );
}

export default EditablePage;
