

const ProgressSteps = ({ currentStep, totalSteps }) => {
    return (
        <div className="p-6">
            <div className="flex items-center justify-between relative">

                <div className="absolute top-5 left-0 right-0 h-2 bg-gray-200">

                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    ></div>
                </div>

                {/* Step circles */}
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                ${currentStep === step
                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl'
                                    : currentStep > step
                                        ? 'border-green-500 bg-green-500 text-white shadow-lg'
                                        : 'border-gray-300 bg-white text-gray-500'
                                }`}
                        >
                            {currentStep > step ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : (
                                <span className="text-sm font-semibold">{step}</span>
                            )}
                        </div>
                        <span className={`text-xs mt-2 font-semibold ${currentStep === step ? 'text-indigo-600' : 'text-gray-500'}`}>
                            {step === 1 && 'Business'}
                            {step === 2 && 'Contact'}
                            {step === 3 && 'Owner'}
                            {step === 4 && 'Contact Person'}
                            {step === 5 && 'Address'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressSteps;