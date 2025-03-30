import React, { useState, useEffect } from 'react';
import { useSubscriptionStore } from '../../Store/subscriptionStore';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../../Store/authStore';
import { useNavigate } from 'react-router-dom';

const SubscriptionPage = () => {
    // State for subscription data
    const [hasSubscription, setHasSubscription] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate()

    const subscriptionTypes = {
        basic: {
            name: "Basic Ads",
            pricing: {
                monthly: 4.99,
                annual: 49.99,
            },
            features: [
                "100 ad impressions daily",
                "Basic analytics dashboard",
                "Limited audience targeting",
            ],
        },
        premium: {
            name: "Premium Ads",
            pricing: {
                monthly: 9.99,
                annual: 99.99,
            },
            features: [
                "Unlimited ad impressions",
                "Advanced targeting options",
                "Priority ad placement",
            ],
        },
        diamond: {
            name: "Diamond Ads",
            pricing: {
                monthly: 29.99,
                annual: 299.99,
            },
            features: [
                "Custom ad campaigns",
                "Multi-channel ad management",
                "Dedicated ad strategist",
            ],
        },
    };

    const { user } = useAuthStore()


    useEffect(() => {
        if (!user.onboardingDone) {
            navigate("/goto/onboarding")
        }
    }, [])

    const { fetchSubscriptions, subscriptionInfo } = useSubscriptionStore();

    // Single useEffect to fetch data and process it
    useEffect(() => {
        // Fetch subscription data
        fetchSubscriptions();
    }, []); // Only run on mount, remove fetchSubscriptions from dependency

    // Process subscription data separately
    useEffect(() => {
        if (subscriptionInfo) {
            // Process the backend data
            try {
                // Format dates
                const startDate = new Date(subscriptionInfo.startDate);
                const endDate = new Date(subscriptionInfo.endDate);
                const createdAt = new Date(subscriptionInfo.createdAt);

                // Extract subscription type and match with frontend data
                const subType = subscriptionInfo.subscriptionType.toLowerCase();
                const features = subscriptionTypes[subType]?.features || [];

                // Create formatted subscription data object
                const formattedData = {
                    plan: subscriptionInfo.subscriptionType,
                    billingCycle: subscriptionInfo.billingCycle,
                    price: subscriptionInfo.price,
                    status: subscriptionInfo.status,
                    nextPayment: endDate.toLocaleDateString(),
                    dateJoined: createdAt.toLocaleDateString(),
                    startDate: startDate.toLocaleDateString(),
                    endDate: endDate.toLocaleDateString(),
                    features: features
                };

                setSubscriptionData(formattedData);
                setHasSubscription(subscriptionInfo.status === 'Active');
            } catch (error) {
                console.error("Error processing subscription data:", error);
                setHasSubscription(false);
            }
        } else {
            setHasSubscription(false);
        }

        setLoading(false);
    }, [subscriptionInfo]); // Only re-run when subscriptionInfo changes

    if (loading) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-800 sm:text-4xl">Subscription Management</h1>
                    <p className="mt-3 text-gray-600">
                        Manage your subscription plan and billing details
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {hasSubscription && subscriptionData ? (
                        <>
                            {/* Active Subscription View */}
                            <div className="border-b border-gray-100">
                                <div className="bg-indigo-700 px-6 py-6 sm:py-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/4">
                                        <div className="h-64 w-64 rounded-full bg-indigo-500 opacity-20"></div>
                                    </div>
                                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                        <div>
                                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-800 text-white mb-2">
                                                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                                                {subscriptionData.status}
                                            </div>
                                            <h2 className="text-2xl font-bold text-white">{subscriptionData.plan}</h2>
                                            <p className="text-indigo-200 mt-1">Billed {subscriptionData.billingCycle}</p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            <span className="text-white text-3xl font-bold">${subscriptionData.price}</span>
                                            <span className="text-indigo-200">/{subscriptionData.billingCycle.toLowerCase()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Subscription Details */}
                            <div className="p-6 sm:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <h3 className="text-gray-500 text-sm font-medium mb-2">Next Payment</h3>
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-800 font-medium">{subscriptionData.nextPayment}</p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <h3 className="text-gray-500 text-sm font-medium mb-2">Member Since</h3>
                                        <div className="flex items-center">
                                            <svg className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-gray-800 font-medium">{subscriptionData.dateJoined}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-6">
                                    <h3 className="font-medium text-gray-800 mb-4">Plan Features</h3>
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                        {subscriptionData.features && subscriptionData.features.map((feature, index) => (
                                            <li key={index} className="flex items-center">
                                                <svg className="h-5 w-5 text-indigo-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                    <button
                                        className="px-6 py-3 bg-white text-indigo-700 font-medium border-2 border-indigo-700 rounded-xl hover:bg-indigo-50 transition duration-200"
                                    >
                                        Cancel Subscription
                                    </button>
                                    <button className="px-6 py-3 bg-indigo-700 text-white font-medium rounded-xl hover:bg-indigo-800 transition duration-200 shadow-md">
                                        Upgrade Plan
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* No Subscription View */}
                            <div className="p-8 sm:p-12 text-center">
                                <div className="mb-6 mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center shadow-md">
                                    <svg className="h-12 w-12 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">No Active Subscription</h2>
                                <p className="mt-4 text-gray-600 max-w-md mx-auto">
                                    It looks like you haven't subscribed to a plan yet. Choose a plan that best suits your business needs and unlock premium features.
                                </p>

                                <div className="mt-10 space-y-8 max-w-md mx-auto">
                                    {Object.keys(subscriptionTypes).map((type) => (
                                        <div key={type} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-2xl font-bold text-gray-800">{subscriptionTypes[type].name}</h3>
                                                <div>
                                                    <span className="text-3xl font-bold text-gray-800">${subscriptionTypes[type].pricing.monthly}</span>
                                                    <span className="text-gray-500 text-lg">/month</span>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                {subscriptionTypes[type].features.map((feature, index) => (
                                                    <li key={index} className="flex items-center">
                                                        <svg className="h-5 w-5 text-indigo-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span className="text-gray-700">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                <button
                                                    className="w-full px-6 py-3 bg-indigo-700 text-white font-medium rounded-xl hover:bg-indigo-800 transition duration-200 shadow-md"
                                                >
                                                    Subscribe Now
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPage;