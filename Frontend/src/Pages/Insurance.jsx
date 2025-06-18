import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    ChevronRight,
    Star,
    Shield,
    Heart,
    ArrowRight,
    CheckCircle,
    Sparkles,
} from "lucide-react";

export default function PlansMarketplace() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        planType: "all",
        priceRange: "all",
        coverage: "all",
    });
    const [sortBy, setSortBy] = useState("rating"); // Default sort by rating

    useEffect(() => {
        // Simulate API fetch with a delay
        setTimeout(() => {
            const mockPlans = [
                {
                    id: 1,
                    name: "Gold Family Plan",
                    type: "family",
                    monthlyPremium: 450.0,
                    coverageLevel: "comprehensive",
                    deductible: 1500,
                    description:
                        "Comprehensive coverage for families with children, including dental and vision.",
                    rating: 4.8,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                        "Dental",
                        "Vision",
                    ],
                    bestFor: "Families needing comprehensive coverage",
                    icon: "shield",
                },
                {
                    id: 2,
                    name: "Silver Individual Plan",
                    type: "individual",
                    monthlyPremium: 225.5,
                    coverageLevel: "standard",
                    deductible: 2500,
                    description:
                        "Balanced coverage for individuals with affordable monthly premiums.",
                    rating: 4.2,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                    ],
                    bestFor: "Individual professionals seeking balanced coverage",
                    icon: "star",
                },
                {
                    id: 3,
                    name: "Bronze Family Plan",
                    type: "family",
                    monthlyPremium: 320.75,
                    coverageLevel: "basic",
                    deductible: 3500,
                    description:
                        "Essential coverage for families at an affordable price point.",
                    rating: 4.0,
                    features: [
                        "Primary care",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                    ],
                    bestFor: "Budget-conscious families",
                    icon: "heart",
                },
                {
                    id: 4,
                    name: "Platinum Individual Plan",
                    type: "individual",
                    monthlyPremium: 510.25,
                    coverageLevel: "premium",
                    deductible: 1000,
                    description:
                        "Premium coverage with low deductibles and comprehensive benefits.",
                    rating: 4.9,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                        "Dental",
                        "Vision",
                        "Alternative medicine",
                        "Wellness programs",
                    ],
                    bestFor:
                        "Individuals seeking premium healthcare with minimal out-of-pocket costs",
                    icon: "shield",
                },
                {
                    id: 5,
                    name: "Gold Individual Plan",
                    type: "individual",
                    monthlyPremium: 380.0,
                    coverageLevel: "comprehensive",
                    deductible: 1800,
                    description:
                        "Comprehensive coverage for individuals with a good balance of premiums and benefits.",
                    rating: 4.5,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                        "Dental",
                    ],
                    bestFor:
                        "Individuals wanting comprehensive coverage with reasonable premiums",
                    icon: "star",
                },
                {
                    id: 6,
                    name: "Silver Family Plan",
                    type: "family",
                    monthlyPremium: 410.5,
                    coverageLevel: "standard",
                    deductible: 2000,
                    description:
                        "Family coverage with a good balance of benefits and cost.",
                    rating: 4.3,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                    ],
                    bestFor: "Families looking for value-oriented coverage",
                    icon: "heart",
                },
                {
                    id: 7,
                    name: "Bronze Individual Plan",
                    type: "individual",
                    monthlyPremium: 175.25,
                    coverageLevel: "basic",
                    deductible: 4000,
                    description:
                        "Basic coverage for healthy individuals looking for protection against major medical events.",
                    rating: 3.8,
                    features: [
                        "Primary care",
                        "Emergency care",
                        "Hospital stays",
                        "Basic prescription drugs",
                    ],
                    bestFor: "Young, healthy individuals wanting basic protection",
                    icon: "shield",
                },
                {
                    id: 8,
                    name: "Platinum Family Plan",
                    type: "family",
                    monthlyPremium: 620.0,
                    coverageLevel: "premium",
                    deductible: 800,
                    description:
                        "Top-tier family coverage with comprehensive benefits and minimal out-of-pocket expenses.",
                    rating: 5.0,
                    features: [
                        "Primary care",
                        "Specialists",
                        "Emergency care",
                        "Hospital stays",
                        "Prescription drugs",
                        "Mental health",
                        "Dental",
                        "Vision",
                        "Alternative medicine",
                        "Wellness programs",
                        "Global coverage",
                    ],
                    bestFor: "Families wanting the best possible healthcare coverage",
                    icon: "star",
                },
            ];
            setPlans(mockPlans);
            setLoading(false);
        }, 1000);
    }, []);

    const handleFilterChange = (filterType, value) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [filterType]: value,
        }));
    };

    const handleSortChange = (sortType) => {
        setSortBy(sortType);
    };

    const renderIcon = (iconName) => {
        switch (iconName) {
            case "star":
                return <Star className="w-6 h-6 text-white" />;
            case "shield":
                return <Shield className="w-6 h-6 text-white" />;
            case "heart":
                return <Heart className="w-6 h-6 text-white" />;
            default:
                return <Star className="w-6 h-6 text-white" />;
        }
    };

    const getCoverageColor = (level) => {
        switch (level) {
            case "basic":
                return "bg-yellow-100 text-yellow-600";
            case "standard":
                return "bg-blue-100 text-blue-600";
            case "comprehensive":
                return "bg-green-100 text-green-600";
            case "premium":
                return "bg-purple-100 text-purple-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getIconBackground = (icon) => {
        switch (icon) {
            case "star":
                return "bg-amber-600";
            case "shield":
                return "bg-blue-600";
            case "heart":
                return "bg-red-600";
            default:
                return "bg-gray-600";
        }
    };

    const filteredPlans = plans.filter((plan) => {
        // Search term filter
        const matchesSearch =
            plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Plan type filter
        const matchesPlanType =
            filters.planType === "all" || plan.type === filters.planType;

        // Price range filter
        let matchesPriceRange = true;
        if (filters.priceRange === "under-200") {
            matchesPriceRange = plan.monthlyPremium < 200;
        } else if (filters.priceRange === "200-400") {
            matchesPriceRange =
                plan.monthlyPremium >= 200 && plan.monthlyPremium <= 400;
        } else if (filters.priceRange === "over-400") {
            matchesPriceRange = plan.monthlyPremium > 400;
        }

        // Coverage level filter
        const matchesCoverage =
            filters.coverage === "all" || plan.coverageLevel === filters.coverage;

        return (
            matchesSearch && matchesPlanType && matchesPriceRange && matchesCoverage
        );
    }).sort((a, b) => {
        // Sort by price or rating
        if (sortBy === "price") {
            return a.monthlyPremium - b.monthlyPremium;
        } else {
            return b.rating - a.rating; // Higher rating first
        }
    });

    const resetFilters = () => {
        setSearchTerm("");
        setFilters({
            planType: "all",
            priceRange: "all",
            coverage: "all",
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50">


            {/* Main content with diagonal pattern in background */}
            <main className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                {/* Decorative diagonal element */}
                <div className="absolute top-0 left-0 right-0 bottom-0 -z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-500 bg-opacity-5 -rotate-3 transform origin-top-left"></div>
                    <div className="absolute top-1/3 left-0 right-0 bottom-0 bg-amber-200 bg-opacity-10 rotate-6 transform origin-top-right"></div>
                </div>

                {/* Filters Section */}
                <div className="mb-10 bg-white bg-opacity-40 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white border-opacity-30 transform transition-all duration-300 hover:shadow-xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Find Your Plan
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div>
                            <label
                                htmlFor="planType"
                                className="block text-sm font-medium text-gray-600 mb-2"
                            >
                                Plan Type
                            </label>
                            <div className="relative">
                                <select
                                    id="planType"
                                    className="block w-full px-4 py-3 border border-amber-300 border-opacity-50 rounded-xl shadow-sm focus:ring-red-600 focus:border-red-600 bg-white text-gray-600 appearance-none transition-colors duration-200"
                                    value={filters.planType}
                                    onChange={(e) =>
                                        handleFilterChange("planType", e.target.value)
                                    }
                                    aria-label="Select plan type"
                                >
                                    <option value="all">All Types</option>
                                    <option value="individual">Individual</option>
                                    <option value="family">Family</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronRight className="h-4 w-4 transform rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="priceRange"
                                className="block text-sm font-medium text-gray-600 mb-2"
                            >
                                Price Range
                            </label>
                            <div className="relative">
                                <select
                                    id="priceRange"
                                    className="block w-full px-4 py-3 border border-amber-300 border-opacity-50 rounded-xl shadow-sm focus:ring-red-600 focus:border-red-600 bg-white text-gray-600 appearance-none transition-colors duration-200"
                                    value={filters.priceRange}
                                    onChange={(e) =>
                                        handleFilterChange("priceRange", e.target.value)
                                    }
                                    aria-label="Select price range"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="under-200">Under $200/month</option>
                                    <option value="200-400">$200 - $400/month</option>
                                    <option value="over-400">Over $400/month</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronRight className="h-4 w-4 transform rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="coverage"
                                className="block text-sm font-medium text-gray-600 mb-2"
                            >
                                Coverage Level
                            </label>
                            <div className="relative">
                                <select
                                    id="coverage"
                                    className="block w-full px-4 py-3 border border-amber-300 border-opacity-50 rounded-xl shadow-sm focus:ring-red-600 focus:border-red-600 bg-white text-gray-600 appearance-none transition-colors duration-200"
                                    value={filters.coverage}
                                    onChange={(e) =>
                                        handleFilterChange("coverage", e.target.value)
                                    }
                                    aria-label="Select coverage level"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="basic">Basic</option>
                                    <option value="standard">Standard</option>
                                    <option value="comprehensive">Comprehensive</option>
                                    <option value="premium">Premium</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                                    <ChevronRight className="h-4 w-4 transform rotate-90" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-end">
                            <button
                                className="px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-xl shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full transition-all duration-200 transform hover:scale-105 active:bg-red-800"
                                onClick={resetFilters}
                                aria-label="Reset filters"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                {!loading && (
                    <div className="mb-8 flex justify-between items-center">
                        <p className="text-sm font-medium text-gray-600">
                            {filteredPlans.length}{" "}
                            {filteredPlans.length === 1 ? "plan" : "plans"} found
                        </p>
                        <div className="text-sm text-gray-600 font-medium">
                            Sort by:{" "}
                            <button
                                className={`hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-1 ${sortBy === "price" ? "text-red-600 font-semibold" : "text-red-500"
                                    }`}
                                onClick={() => handleSortChange("price")}
                                aria-label="Sort by price"
                                aria-pressed={sortBy === "price"}
                            >
                                Price
                            </button>{" "}
                            |{" "}
                            <button
                                className={`hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 rounded px-1 ${sortBy === "rating" ? "text-red-600 font-semibold" : "text-red-500"
                                    }`}
                                onClick={() => handleSortChange("rating")}
                                aria-label="Sort by rating"
                                aria-pressed={sortBy === "rating"}
                            >
                                Rating
                            </button>
                        </div>
                    </div>
                )}

                {/* Plans grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="relative">
                            <div className="w-12 h-12 border-4 border-t-red-500 border-red-50 rounded-full animate-spin"></div>
                            <div className="mt-4 text-center text-gray-500">
                                Loading plans...
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {filteredPlans.length === 0 ? (
                            <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                                <Search className="w-8 h-8 text-red-500 mx-auto mb-4" />
                                <p className="text-xl font-medium text-gray-800 mb-2">
                                    No plans found
                                </p>
                                <p className="text-gray-500 text-sm mb-4">
                                    Try adjusting your filters or search term.
                                </p>
                                <button
                                    className="px-6 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    onClick={resetFilters}
                                    aria-label="Clear filters"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {filteredPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 relative"
                                    >
                                        {/* Premium tag */}
                                        {plan.coverageLevel === "premium" && (
                                            <div className="absolute top-3 right-0 bg-purple-500 text-white text-xs px-3 py-1 rounded-l-md">
                                                PREMIUM
                                            </div>
                                        )}

                                        <div className="p-6">
                                            {/* Header with subtle gradient background */}
                                            <div className="relative -mx-6 -mt-6 p-5 mb-6 bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b border-gray-100">
                                                {/* Top row with icon and rating */}
                                                <div className="flex justify-between items-center mb-3">
                                                    <div
                                                        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-sm ${getIconBackground(
                                                            plan.icon
                                                        )}`}
                                                    >
                                                        {renderIcon(plan.icon)}
                                                    </div>
                                                    <div className="flex items-center px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                                                        <Star className="w-4 h-4 text-amber-400" />
                                                        <span className="ml-1 text-sm font-medium text-gray-700">
                                                            {plan.rating}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Plan name and badge */}
                                                <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                    {plan.name}
                                                </h3>
                                                <div className="flex items-center">
                                                    <span
                                                        className={`text-xs font-medium px-3 py-1 rounded-full ${getCoverageColor(
                                                            plan.coverageLevel
                                                        )}`}
                                                    >
                                                        {plan.coverageLevel.charAt(0).toUpperCase() +
                                                            plan.coverageLevel.slice(1)}
                                                    </span>
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {plan.bestFor}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Pricing section with soft highlight */}
                                            <div className="bg-white -mx-2 px-4 py-4 rounded-lg mb-5">
                                                <div className="flex items-baseline justify-between">
                                                    <div>
                                                        <span className="text-3xl font-bold text-gray-800">
                                                            ${plan.monthlyPremium.toFixed(2)}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            /month
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                                                        <Shield className="w-3 h-3 text-red-500 mr-1" />
                                                        <span className="text-xs font-medium text-gray-700">
                                                            ${plan.deductible} deductible
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Features with improved visuals */}
                                            <div className="mb-6">
                                                <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-medium">
                                                    Key benefits
                                                </p>
                                                <div className="space-y-2">
                                                    {plan.features.slice(0, 3).map((feature, index) => (
                                                        <div key={index} className="flex items-start">
                                                            <div className="flex-shrink-0 mt-1">
                                                                <CheckCircle className="w-4 h-4 text-red-500" />
                                                            </div>
                                                            <span className="ml-2 text-sm text-gray-600">
                                                                {feature}
                                                            </span>
                                                        </div>
                                                    ))}
                                                    {plan.features.length > 3 && (
                                                        <div className="text-center mt-2">
                                                            <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-full">
                                                                +{plan.features.length - 3} more features
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* CTA Button with enhanced design */}
                                            <a
                                                href={`/plan-details/${plan.id}`}
                                                className="flex items-center justify-center w-full px-5 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                aria-label={`View details for ${plan.name}`}
                                            >
                                                View Plan Details
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-[#071E22] text-white mt-12">
                <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">HealthPlus</h3>
                            <p className="text-sm text-gray-300">
                                Helping you find the perfect health insurance coverage for your
                                needs.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded"
                                    >
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded"
                                    >
                                        How It Works
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded"
                                    >
                                        Insurance FAQ
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-red-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 rounded"
                                    >
                                        Contact Support
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Subscribe</h3>
                            <p className="text-sm text-gray-300 mb-2">
                                Get updates on new plans and promotions
                            </p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 flex-1"
                                    aria-label="Email address"
                                />
                                <button
                                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-r-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                    aria-label="Subscribe"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-800 text-sm text-gray-400 text-center">
                        © 2025 HealthPlus. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}