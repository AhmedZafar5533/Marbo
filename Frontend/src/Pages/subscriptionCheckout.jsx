
import React, { useEffect, useState } from "react";
import { CheckCircle, CreditCard, Shield, ArrowRight } from "lucide-react";
import { useSubscriptionStore } from "../../Store/subscriptionStore";
import LoadingSpinner from "../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";

const SubscriptionCheckout = () => {
    const [loading, setLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const { sendSubscriptionRequest, sentSubscriptionInfo, subscirptionSuccess } = useSubscriptionStore()
    const naviagate = useNavigate()

    const currentDate = new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    useEffect(() => {
        if (subscirptionSuccess) {
            naviagate("/")
        }
    }, [subscirptionSuccess])

    useEffect(() => {
        if (sentSubscriptionInfo) {
            setSubscription(sentSubscriptionInfo);
        }
    }, [sentSubscriptionInfo]);

    const handleCheckout = async () => {
        setLoading(true);
        // Simulate processing
        await sendSubscriptionRequest(subscription)
        setLoading(false);

    };





    return (
        <>
            {!subscription ?
                (<div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <p className="text-gray-500">No subscription information available.</p>
                </div>) :
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-amber-50 to-white px-4 py-10">
                    {/* Subtle background elements */}
                    <div className="absolute top-20 right-1/4 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

                    <div className="relative max-w-4xl w-full">
                        {/* Main card with horizontal layout */}
                        <div className="relative bg-white shadow-xl rounded-2xl overflow-hidden border border-red-100 flex flex-col md:flex-row">
                            {/* Left Section - Plan Details */}
                            <div className="w-full md:w-2/5 bg-gradient-to-br from-red-500 to-red-600 p-6 relative">
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-400 rounded-full opacity-20"></div>

                                <div className="relative z-10">
                                    <h2 className="text-white text-2xl font-bold">Basic Subscription</h2>
                                    <div className="flex items-baseline mt-3 mb-5">
                                        <span className="text-3xl font-bold text-white">${subscription.price.toFixed(2)}</span>
                                        <span className="text-red-100 ml-1">/{subscription.billing.toLowerCase()}</span>
                                    </div>

                                    <div className="space-y-2">
                                        {subscription.features.map((feature, index) => (
                                            <div key={index} className="flex items-center text-white">
                                                <CheckCircle className="h-4 w-4 text-red-200 mr-2 flex-shrink-0" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-center bg-red-600 bg-opacity-30 rounded-lg p-2">
                                        <Shield className="h-4 w-4 text-red-100 mr-2" />
                                        <span className="text-xs text-red-100">30-day money back guarantee</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Section - Checkout */}
                            <div className="w-full md:w-3/5 p-6">
                                <h3 className="text-gray-800 font-bold text-lg mb-4">Complete Your Order</h3>

                                {/* Order Summary */}
                                <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
                                    <h4 className="text-gray-600 font-medium text-sm mb-3">Order Summary</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex justify-between text-gray-600 col-span-2">
                                            <span>Subscription Type</span>
                                            <span className="font-medium">{subscription.type}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 col-span-2">
                                            <span>Billing Cycle</span>
                                            <span className="font-medium">{subscription.billing}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600 col-span-2">
                                            <span>Today's Date</span>
                                            <span>{currentDate}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-800 font-medium pt-2 border-t border-gray-200 mt-1 col-span-2">
                                            <span>Total Due Today</span>
                                            <span className="text-red-500">${subscription.price.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Preview */}
                                <div className="flex items-center bg-gray-50 rounded-lg p-3 mb-5 border border-gray-100">
                                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                                    <span className="text-sm text-gray-600">Secure payment processing</span>
                                </div>

                                {/* Checkout button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                    ) : (
                                        <>
                                            <span>Complete Checkout</span>
                                            <ArrowRight className="h-5 w-5 ml-2" />
                                        </>
                                    )}
                                </button>

                                <p className="text-center text-xs text-gray-400 mt-3">
                                    By completing your purchase you agree to our Terms of Service
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
    );
};

export default SubscriptionCheckout;