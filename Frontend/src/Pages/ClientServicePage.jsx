import React, { useEffect } from "react";
import { useServiceStore } from "../../Store/servicesStore";
import { useParams } from "react-router-dom";


function LoadingSkeleton() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero skeleton */}
            <div className="relative h-[85vh] bg-gray-300 animate-pulse" />

            {/* About section skeleton */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
                    <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4" />
                        <div className="h-40 bg-gray-200 animate-pulse rounded" />
                        <div className="h-12 bg-gray-200 animate-pulse rounded w-40" />
                    </div>
                </div>
            </div>

            {/* Pricing section skeleton */}
            <div className="py-24 bg-indigo-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 bg-gray-200 animate-pulse rounded w-1/2 mx-auto mb-16" />
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Features section skeleton */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
                    <div className="h-96 bg-gray-200 animate-pulse rounded-2xl" />
                    <div className="space-y-4">
                        <div className="h-10 bg-gray-200 animate-pulse rounded w-3/4" />
                        <div className="h-40 bg-gray-200 animate-pulse rounded" />
                        <div className="h-12 bg-gray-200 animate-pulse rounded w-40" />
                    </div>
                </div>
            </div>

            {/* CTA section skeleton */}
            <div className="py-24 bg-indigo-900">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="h-16 bg-indigo-800 animate-pulse rounded w-2/3 mx-auto mb-8" />
                    <div className="h-12 bg-indigo-800 animate-pulse rounded w-1/2 mx-auto" />
                </div>
            </div>
        </div>
    );
}



function UserViewPage() {
    const { id } = useParams();

    const getPageData = useServiceStore(state => state.getPageData);
    const servicePage = useServiceStore(state => state.servicePage);
    const isLoading = !servicePage || Object.keys(servicePage).length === 0;



    useEffect(() => {
        getPageData(id);
    }, [id]);



    if (isLoading) return <LoadingSkeleton />;
    const data = servicePage;


    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden">
            {/* Hero Section */}
            {data.header && (
                <section className="relative h-[100vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={data.header.image.url}
                            alt="Background"
                            className="w-full h-full object-cover transform scale-105"
                        />
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900"
                            style={{ opacity: data.header.gradientOpacity }}
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.4)_100%)]" />
                    </div>

                    <div className="relative max-w-7xl px-4 sm:px-6 text-center space-y-10 py-8">
                        <div className="space-y-8">
                            <h1
                                className="text-5xl sm:text-6xl md:text-7xl font-bold px-2 leading-tight tracking-tight -mt-20"
                                style={{ color: data.header.textColor }}
                            >
                                {data.header.text}
                            </h1>
                            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto px-2 font-light">
                                {data.header.description}
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-5 px-2 pt-4">
                            <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg font-semibold">
                                Get Started
                            </button>
                        </div>
                    </div>

                    {/* Abstract shapes */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-24 text-white">
                            <path fill="currentColor" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
                            <path fill="currentColor" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
                            <path fill="currentColor" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
                        </svg>
                    </div>
                </section>
            )}

            {/* Floating Stats Section (Static or data-driven if available) */}
            {data.stats ? (
                <section className="relative z-10 -mt-16 mb-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {data.stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-4xl font-bold text-indigo-600">{stat.number}</h3>
                                            <p className="text-gray-600 mt-2">{stat.text}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ) : (
                // Default stats if data.stats is not provided
                <section className="relative z-10 -mt-16 mb-16">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { number: "98%", text: "Customer satisfaction" },
                                { number: "24/7", text: "Expert support" },
                                { number: "10k+", text: "Active businesses" }
                            ].map((stat, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-8 transform hover:-translate-y-2 transition-all duration-300">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-4xl font-bold text-indigo-600">{stat.number}</h3>
                                            <p className="text-gray-600 mt-2">{stat.text}</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About Us Section */}
            {data.about && (
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full opacity-50 -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-50 translate-y-1/2 -translate-x-1/3 blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="space-y-8 order-2 md:order-1">
                            <div className="inline-block mb-3">
                                <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                    About Us
                                </span>
                            </div>
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    {data.about.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {data.about.content}
                                </p>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
                                    Learn More
                                </button>
                            </div>
                        </div>
                        <div className="relative group order-1 md:order-2">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                            <img
                                src={data.about.image.url}
                                alt="About Us"
                                className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full -z-10"></div>
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-100 rounded-full -z-10"></div>
                        </div>
                    </div>
                </section>
            )}

            {/* How It Works Section */}
            {data.howItWorks && (
                <section className="py-24 bg-gradient-to-b from-white to-indigo-50">
                    <div className="max-w-7xl mx-auto px-6 space-y-16">
                        <div className="text-center space-y-6">
                            <div className="inline-block mb-3">
                                <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                    {data.howItWorks.tag || "Our Process"}
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                {data.howItWorks.title || "How It Works"}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                                {data.howItWorks.description || "Follow these simple steps to transform your business."}
                            </p>
                        </div>

                        <div className="relative">
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-indigo-200 -translate-y-1/2 transform"></div>

                            <div className="grid md:grid-cols-3 gap-12 items-start relative z-10">
                                {data.howItWorks.steps.map((step, index) => (
                                    <div key={index} className="relative flex flex-col items-center text-center group">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl mb-8 shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                                            <span className="text-white font-bold">{index + 1}</span>
                                        </div>
                                        <div className="space-y-6 bg-white p-8 rounded-2xl w-full border border-gray-100 transition-all duration-300 hover:shadow-xl group-hover:-translate-y-2">
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed">
                                                {step.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Features Section */}
            {data.features && (
                <section className="py-24 bg-indigo-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full opacity-50 -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-200 rounded-full opacity-50 translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            <img
                                src={data.features.image.url}
                                alt="Features"
                                className="rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 w-full"
                            />
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-100 rounded-full -z-10"></div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-purple-100 rounded-full -z-10"></div>
                        </div>
                        <div className="space-y-8">
                            <div className="inline-block mb-3">
                                <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                    Features
                                </span>
                            </div>
                            <div className="space-y-8">
                                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                    {data.features.title}
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                                    {data.features.content}
                                </p>
                                <ul className="space-y-6">
                                    {data.features.features.map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                                                <svg
                                                    className="w-6 h-6 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                            <span className="text-xl text-gray-800 font-medium">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4 pt-4">
                                <button className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-4 rounded-full hover:shadow-lg transition-all duration-300 font-medium">
                                    View All Features
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            {data.pricing && (
                <section className="py-24 bg-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100 rounded-full opacity-50 -translate-y-1/3 -translate-x-1/3 blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-100 rounded-full opacity-50 translate-y-1/3 translate-x-1/3 blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-6 space-y-16 relative z-10">
                        <div className="text-center space-y-6">
                            <div className="inline-block mb-3">
                                <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                                    Pricing Plans
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                                {data.pricing.title || "Our Pricing Plans"}
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                {data.pricing.subtitle || "Choose the plan that suits your business needs."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {(() => {
                                // Clone the pricing cards array so we can modify it without mutating original data
                                const cards = data.pricing.cards.slice();
                                // Check if no card is highlighted, then highlight the middle card.
                                if (!cards.some((card) => card.highlighted)) {
                                    const midIndex = Math.floor(cards.length / 2);
                                    cards[midIndex] = { ...cards[midIndex], highlighted: true };
                                }
                                return cards.map((card, cardIndex) => (
                                    <div
                                        key={cardIndex}
                                        className={`relative bg-white rounded-3xl ${card.highlighted ? "shadow-2xl ring-4 ring-indigo-500/20" : "shadow-xl"
                                            } p-8 transition-all hover:shadow-2xl group`}
                                    >
                                        {card.highlighted && (
                                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                <span className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium shadow-lg">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h3 className={`text-2xl font-bold ${card.highlighted ? "text-indigo-700" : "text-gray-900"}`}>
                                                    {card.title}
                                                </h3>
                                                <div className="flex items-end">
                                                    <p className={`text-5xl font-extrabold ${card.highlighted ? "text-indigo-700" : "text-gray-900"}`}>
                                                        {card.price.split('/')[0]}
                                                    </p>
                                                    <span className="text-gray-500 ml-1 mb-1">/mo</span>
                                                </div>
                                                <p className="text-gray-600 pb-4">{card.description}</p>
                                                <div className={`w-full h-px ${card.highlighted ? "bg-indigo-100" : "bg-gray-100"}`}></div>
                                            </div>
                                            <button
                                                className={`w-full py-4 rounded-full text-center font-medium transition-all ${card.highlighted
                                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg hover:shadow-xl"
                                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                                    }`}
                                            >
                                                Select {card.title}
                                            </button>

                                            <ul className="space-y-4">
                                                {card.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-start space-x-3">
                                                        <svg
                                                            className={`w-6 h-6 mt-0.5 flex-shrink-0 ${card.highlighted ? "text-indigo-500" : "text-indigo-400"}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        <span className="text-gray-600">{feature.text || feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </div>
                </section>
            )}

            {/* Call to Action Section */}

            <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                <div className="max-w-5xl mx-auto px-6 text-center space-y-12 relative z-10">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            "Ready to Transform Your Business?"
                        </h2>
                        <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                            "Join thousands of companies that are already growing with our platform."
                        </p>
                    </div>
                    <div className="pt-4">
                        <button className="px-10 py-5 bg-white text-indigo-900 rounded-full text-xl font-bold shadow-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                            "Get Started Today"
                        </button>
                    </div>
                </div>

                {/* Abstract shapes */}
                <div className="absolute -top-24 left-0 w-72 h-72 bg-purple-700/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 right-0 w-72 h-72 bg-indigo-700/20 rounded-full blur-3xl"></div>
            </section>

        </div>

    );
}

export default UserViewPage;