// src/components/VendorOnboarding/VendorOnboardingForm.jsx
import BusinessInformation from '../components/OnboardingForms/BusinessInfo';
import BusinessContact from '../components/OnboardingForms/BusinessContact';
import OwnerInformation from '../components/OnboardingForms/OwnerInfo';
import ContactPerson from '../components/OnboardingForms/ContactPerson';
import BusinessAddress from '../components/OnboardingForms/BusinessAddress';
import ProgressSteps from '../components/OnboardingForms/ProgressSteps';
import { useEffect, useState } from 'react';
import { useVendorStore } from '../../Store/vendorStore';

const VendorOnboardingForm = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const totalSteps = 5;

    const { initializeOnboarding, isInitialized } = useVendorStore();

    useEffect(() => {
        if (!isInitialized)
            initializeOnboarding();
    }, [initializeOnboarding, isInitialized]);


    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
            window.scrollTo({ top: 200, behavior: 'smooth' });


        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            window.scrollTo({ top: 200, behavior: 'smooth' });
        }
    };


    const getStepTitle = (step) => {
        switch (step) {
            case 1: return 'Business Information';
            case 2: return 'Business Contact';
            case 3: return 'Owner Information';
            case 4: return 'Contact Person';
            case 5: return 'Business Address';
            default: return '';
        }
    };

    const renderForm = () => {
        switch (currentStep) {
            case 1:
                return <BusinessInformation
                    nextStep={nextStep} currentStep={currentStep} totalSteps={totalSteps} />;
            case 2:
                return <BusinessContact nextStep={nextStep} prevStep={prevStep}
                    currentStep={currentStep} totalSteps={totalSteps} />;
            case 3:
                return <OwnerInformation nextStep={nextStep} prevStep={prevStep}
                    currentStep={currentStep} totalSteps={totalSteps} />;
            case 4:
                return <ContactPerson nextStep={nextStep} prevStep={prevStep}
                    currentStep={currentStep} totalSteps={totalSteps} />;
            case 5:
                return <BusinessAddress prevStep={prevStep}
                    currentStep={currentStep} totalSteps={totalSteps} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-10">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center mb-4">
                        <svg className="w-15 h-15 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M10 4a6 6 0 100 12 6 6 0 000-12zm0 10a4 4 0 100-8 4 4 0 000 8z"
                                clipRule="evenodd"
                            />
                            <path
                                fillRule="evenodd"
                                d="M10 6a4 4 0 100 8 4 4 0 000-8zm0 6a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <h1 className="ml-2  text-4xl font-extrabold text-indigo-800">VendorConnect</h1>
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Welcome to Vendor Onboarding</h2>
                        <p className="mt-2 text-xl text-gray-600">
                            Complete the essential steps to register your business.
                        </p>
                    </div>
                </div>


                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mt-5">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10 px-10 text-white text-center">
                        <h1 className="text-3xl font-bold">Vendor Onboarding Portal</h1>
                        <p className="mt-3 text-lg">
                            Follow the steps to register your business and start selling.
                        </p>
                    </div>
                    <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-10">
                <div className="flex flex-col lg:flex-row bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="lg:w-1/2">
                        <div className="py-8 px-10 bg-indigo-50 border-b border-indigo-100">
                            <h2 className="text-2xl font-bold text-indigo-800">
                                Step {currentStep}: {getStepTitle(currentStep)}
                            </h2>
                            <p className="mt-2 text-gray-600">
                                {currentStep === 1 && 'Provide your business details'}
                                {currentStep === 2 && 'Enter your business contact information'}
                                {currentStep === 3 && 'Enter owner details and upload photos'}
                                {currentStep === 4 && 'Provide your primary contact person details'}
                                {currentStep === 5 && 'Enter your business address'}
                            </p>
                        </div>
                        {/* <form
                            onSubmit={currentStep === totalSteps ? handleSubmit : nextStep}
                            className="p-10 space-y-8"
                        > */}
                        {renderForm()}

                        {/* </form> */}
                    </div>
                    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 justify-center items-center">
                        <div className="p-12 text-center">
                            <div className="mx-auto max-w-md">
                                <svg
                                    className="w-full h-auto text-white opacity-90"
                                    viewBox="0 0 800 600"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    {/* SVG paths here */}
                                    <path d="M650 125C650 153.71 626.71 177 598 177C569.29 177 546 153.71 546 125C546 96.29 569.29 73 598 73C626.71 73 650 96.29 650 125Z" fill="currentColor" fillOpacity="0.3" />
                                    <path d="M168 459C168 487.71 144.71 511 116 511C87.29 511 64 487.71 64 459C64 430.29 87.29 407 116 407C144.71 407 168 430.29 168 459Z" fill="currentColor" fillOpacity="0.3" />
                                    <rect x="203" y="112" width="393" height="276" rx="10" fill="currentColor" fillOpacity="0.1" />
                                    <rect x="238" y="160" width="323" height="25" rx="5" fill="currentColor" fillOpacity="0.3" />
                                    <rect x="238" y="205" width="323" height="25" rx="5" fill="currentColor" fillOpacity="0.3" />
                                    <rect x="238" y="250" width="323" height="25" rx="5" fill="currentColor" fillOpacity="0.3" />
                                    <rect x="238" y="295" width="150" height="25" rx="5" fill="currentColor" fillOpacity="0.3" />
                                    <rect x="320" y="350" width="160" height="38" rx="8" fill="currentColor" />
                                    <path d="M150 150L200 250L100 250L150 150Z" fill="currentColor" fillOpacity="0.5" />
                                    <path d="M650 450L700 550L600 550L650 450Z" fill="currentColor" fillOpacity="0.5" />
                                    <circle cx="150" cy="150" r="8" fill="currentColor" />
                                    <circle cx="650" cy="450" r="8" fill="currentColor" />
                                </svg>
                                <h2 className="mt-8 text-3xl font-bold text-white">Join Our Trusted Network</h2>
                                <p className="mt-4 text-lg text-indigo-100">
                                    Complete your vendor registration to start collaborating with top businesses worldwide. Our streamlined process makes onboarding simple and secure.
                                </p>
                                <div className="mt-10 grid grid-cols-2 gap-4 text-left">
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-white">Secure Data</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-6 h-6 mr-2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span className="text-white">Fast Approval</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorOnboardingForm;
