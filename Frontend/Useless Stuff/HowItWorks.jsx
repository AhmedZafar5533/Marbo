import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HowItWorksPage = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [cardStack, setCardStack] = useState([0]);
    const navigate = useNavigate();
    const steps = [
        {
            title: "Submit Business Details",
            description: "Provide your company information, business credentials, and service offerings. This helps us tailor your experience on our platform.",
            icon: "📋",
            color: "from-blue-500 to-indigo-600"
        },
        {
            title: "Verification Process",
            description: "Our expert team reviews your credentials for quality assurance. We'll contact you within 2 business days with verification results.",
            icon: "🔍",
            color: "from-indigo-500 to-purple-600"
        },
        {
            title: "Receive Confirmation",
            description: "Look for your approval notification via email with important instructions for the next phase of your onboarding journey.",
            icon: "✉️",
            color: "from-purple-500 to-pink-600"
        },
        {
            title: "Launch Your Business",
            description: "Register your products or services and start selling immediately. Your business is now officially part of our trusted vendor network.",
            icon: "🚀",
            color: "from-pink-500 to-rose-600"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            const nextStep = currentStep + 1;
            setCurrentStep(nextStep);
            setCardStack([...cardStack, nextStep]);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            const newStack = [...cardStack];
            newStack.pop();
            setCardStack(newStack);
            setCurrentStep(newStack[newStack.length - 1]);
        }
    };

    const handleSkip = () => {
        alert("Closing the How It Works guide");
        setCurrentStep(0);
        setCardStack([0]);
    };

    const handleBeginOnboarding = () => {
        navigate("/onboarding");
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="w-full max-w-4xl mt-24">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold  bg-clip-text bg-gradient-to-r text-indigo-700 mb-3">
                        Become a Trusted Vendor
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Join our network of premium vendors in four simple steps
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 md:mb-16 relative">
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-between mt-2">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className={`flex flex-col items-center transition-all duration-500 ease-in-out transform ${index === currentStep ? "scale-110" : index < currentStep ? "opacity-100" : "opacity-50"
                                    }`}
                                style={{ width: `${100 / steps.length}%` }}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2 shadow-md transition-all ${index < currentStep
                                        ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white"
                                        : index === currentStep
                                            ? "bg-gradient-to-r from-indigo-500 to-indigo-700 text-white ring-4 ring-blue-200 scale-125"
                                            : "bg-white text-gray-400 border border-gray-300"
                                        }`}
                                >
                                    {index + 1}
                                </div>
                                <p className={`text-xs md:text-sm font-semibold text-center transition-all duration-300 ${index === currentStep ? "text-indigo-700" : index < currentStep ? "text-indigo-600" : "text-gray-500"
                                    }`}>
                                    {step.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card Stack */}
                <div className="relative min-h-[400px] mb-16 md:mb-12">
                    {cardStack.map((stepIndex, index) => (
                        <div
                            key={stepIndex}
                            className={`absolute top-0 left-0 right-0 bg-white rounded-xl shadow-xl p-6 md:p-8 transition-all duration-500 ease-in-out ${index === cardStack.length - 1 ? "z-10" : "z-0"
                                }`}
                            style={{
                                transform: `translateY(${(index - (cardStack.length - 1)) * 14}px) scale(${1 - (cardStack.length - 1 - index) * 0.05
                                    })`,
                                opacity: index === cardStack.length - 1 ? 1 : 0.7,
                            }}
                        >
                            <div className="flex flex-col h-full">
                                <div className="flex items-center mb-6">
                                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${steps[stepIndex].color} flex items-center justify-center text-3xl text-white mr-5 shadow-lg`}>
                                        {steps[stepIndex].icon}
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
                                        Step {stepIndex + 1}: {steps[stepIndex].title}
                                    </h2>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-5 my-4 border-l-4 border-indigo-500">
                                    <p className="text-gray-700 text-lg">{steps[stepIndex].description}</p>
                                </div>

                                <div className="flex justify-between mt-auto pt-6">
                                    {stepIndex === 0 ? (
                                        <>
                                            <button
                                                onClick={handleSkip}
                                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
                                            >
                                                <span className="mr-2">Skip</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all flex items-center font-medium"
                                            >
                                                <span className="mr-2">Next</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : stepIndex === steps.length - 1 ? (
                                        <>
                                            <button
                                                onClick={handleBack}
                                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Back</span>
                                            </button>
                                            <button
                                                onClick={handleBeginOnboarding}
                                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 shadow-md transition-all flex items-center font-medium"
                                            >
                                                <span className="mr-2">Begin Onboarding</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleBack}
                                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Back</span>
                                            </button>
                                            <button
                                                onClick={handleNext}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md transition-all flex items-center font-medium"
                                            >
                                                <span className="mr-2">Next</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center text-gray-500 text-sm pb-4 md:pb-0">
                    <p>Questions about the onboarding process? <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">Contact our vendor support team</a></p>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;