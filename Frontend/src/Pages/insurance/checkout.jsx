import { useState } from "react";
import { 
  CreditCard, Calendar, Lock, Shield, CheckCircle, 
  ChevronDown, ChevronUp, User, Mail, Phone, Home, 
  AlertCircle, Check, ArrowRight, ArrowLeft, Info
} from "lucide-react";

export default function InsuranceCheckout() {
  const [activeStep, setActiveStep] = useState(1);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");
  const [formHover, setFormHover] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [addons, setAddons] = useState({ identity: false, roadside: false });
  
  const togglePlanDetails = () => {
    setShowPlanDetails(!showPlanDetails);
  };
  
  const handleStepClick = (step) => {
    setActiveStep(step);
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handleAddonToggle = (addon) => {
    setAddons({...addons, [addon]: !addons[addon]});
  };
  
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#EC5F4F] to-pink-700 py-8 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 800 800">
                <path d="M800 0H0V800H800V0ZM658.6 650.3L561.3 483.8L450.2 599.7L329.8 385.6L226.3 600.3L141.7 450.8L58.7 598.2" stroke="white" strokeWidth="115" fill="none" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Complete Your Insurance Purchase</h1>
            <p className="text-indigo-100 mt-2 text-lg">Secure your future in minutes</p>
          </div>
          
          {/* Progress Indicator */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex justify-between max-w-2xl mx-auto">
              <div 
                className={`flex flex-col items-center ${activeStep >= 1 ? 'text-[#EC5F4F]' : 'text-gray-400'} cursor-pointer transition-colors duration-300 relative`}
                onClick={() => handleStepClick(1)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activeStep >= 1 ? 'bg-[#EC5F4F] text-white' : 'bg-gray-100'} transition-colors duration-300`}>
                  <User className="h-6 w-6" strokeWidth={activeStep >= 1 ? 2 : 1.5} />
                </div>
                <span className={`text-sm font-medium ${activeStep >= 1 ? 'text-[#EC5F4F]' : 'text-gray-500'}`}>Personal Info</span>
                {activeStep > 1 && <Check className="absolute -top-1 -right-1 h-5 w-5 text-white bg-green-500 rounded-full p-1" />}
              </div>
              
              <div className="w-full flex items-center justify-center px-4">
                <div className={`h-1 w-full ${activeStep >= 2 ? 'bg-[#EC5F4F]' : 'bg-gray-200'} transition-colors duration-300`}></div>
              </div>
              
              <div 
                className={`flex flex-col items-center ${activeStep >= 2 ? 'text-[#EC5F4F]' : 'text-gray-400'} cursor-pointer transition-colors duration-300 relative`}
                onClick={() => handleStepClick(2)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activeStep >= 2 ? 'bg-[#EC5F4F] text-white' : 'bg-gray-100'} transition-colors duration-300`}>
                  <Shield className="h-6 w-6" strokeWidth={activeStep >= 2 ? 2 : 1.5} />
                </div>
                <span className={`text-sm font-medium ${activeStep >= 2 ? 'text-[#EC5F4F]' : 'text-gray-500'}`}>Coverage</span>
                {activeStep > 2 && <Check className="absolute -top-1 -right-1 h-5 w-5 text-white bg-green-500 rounded-full p-1" />}
              </div>
              
              <div className="w-full flex items-center justify-center px-4">
                <div className={`h-1 w-full ${activeStep >= 3 ? 'bg-[#EC5F4F]' : 'bg-gray-200'} transition-colors duration-300`}></div>
              </div>
              
              <div 
                className={`flex flex-col items-center ${activeStep >= 3 ? 'text-[#EC5F4F]' : 'text-gray-400'} cursor-pointer transition-colors duration-300 relative`}
                onClick={() => handleStepClick(3)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${activeStep >= 3 ? 'bg-[#EC5F4F] text-white' : 'bg-gray-100'} transition-colors duration-300`}>
                  <CreditCard className="h-6 w-6" strokeWidth={activeStep >= 3 ? 2 : 1.5} />
                </div>
                <span className={`text-sm font-medium ${activeStep >= 3 ? 'text-[#EC5F4F]' : 'text-gray-500'}`}>Payment</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 px-8 py-8 lg:border-r border-gray-100">
              {activeStep === 1 && (
                <div className="space-y-8 max-w-xl mx-auto">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                    <p className="text-gray-500">Let's start with your basic details</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="text"
                          className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                          placeholder="John"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input 
                          type="text"
                          className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="email"
                        className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="tel"
                        className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <input 
                        type="text"
                        className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                        placeholder="123 Main St"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input 
                        type="text"
                        className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <select className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm">
                        <option>Select State</option>
                        <option>New York</option>
                        <option>California</option>
                        <option>Texas</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                      <input 
                        type="text"
                        className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                        placeholder="10001"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#EC5F4F] px-6 py-3 text-base font-medium text-white shadow-md hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-[#EC5F4F] focus:ring-offset-2 transition-all duration-200 w-full md:w-auto"
                      onClick={() => handleStepClick(2)}
                    >
                      <span>Continue to Coverage</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="space-y-8 max-w-xl mx-auto">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Coverage Details</h2>
                    <p className="text-gray-500">Select the coverage that fits your needs</p>
                  </div>
                  
                  <div className="bg-pink-50 rounded-xl p-5 border border-indigo-100">
                    <div className="flex items-start">
                      <Shield className="h-6 w-6 text-[#EC5F4F] mt-1" />
                      <div className="ml-3">
                        <h3 className="text-lg font-medium text-gray-900">Premium Protection Plan</h3>
                        <p className="text-gray-600">Comprehensive coverage with $1M liability protection</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Select Your Deductible</label>
                    <div className="space-y-3">
                      <div 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedPlan === 'standard' ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                        onClick={() => handlePlanChange('standard')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPlan === 'standard' ? 'border-[6px] border-[#EC5F4F]' : 'border-2 border-gray-300'}`}></div>
                            <div className="ml-3">
                              <span className="block font-medium text-gray-900">Standard Deductible</span>
                              <span className="block text-sm text-gray-500">$500 deductible</span>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">$150/month</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedPlan === 'low' ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                        onClick={() => handlePlanChange('low')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPlan === 'low' ? 'border-[6px] border-[#EC5F4F]' : 'border-2 border-gray-300'}`}></div>
                            <div className="ml-3">
                              <span className="block font-medium text-gray-900">Low Deductible</span>
                              <span className="block text-sm text-gray-500">$250 deductible</span>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">$175/month</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${selectedPlan === 'high' ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                        onClick={() => handlePlanChange('high')}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedPlan === 'high' ? 'border-[6px] border-[#EC5F4F]' : 'border-2 border-gray-300'}`}></div>
                            <div className="ml-3">
                              <span className="block font-medium text-gray-900">High Deductible</span>
                              <span className="block text-sm text-gray-500">$1000 deductible</span>
                            </div>
                          </div>
                          <span className="font-medium text-gray-900">$125/month</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Optional Add-ons</label>
                    
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${addons.identity ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                      onClick={() => handleAddonToggle('identity')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${addons.identity ? 'bg-[#EC5F4F] border-2 border-[#EC5F4F]' : 'border-2 border-gray-300'}`}>
                            {addons.identity && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="ml-3">
                            <span className="block font-medium text-gray-900">Identity Theft Protection</span>
                            <span className="block text-sm text-gray-500">Credit monitoring and recovery assistance</span>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">$10/month</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${addons.roadside ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                      onClick={() => handleAddonToggle('roadside')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${addons.roadside ? 'bg-[#EC5F4F] border-2 border-[#EC5F4F]' : 'border-2 border-gray-300'}`}>
                            {addons.roadside && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <div className="ml-3">
                            <span className="block font-medium text-gray-900">Emergency Roadside Assistance</span>
                            <span className="block text-sm text-gray-500">24/7 assistance for vehicle emergencies</span>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900">$8/month</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex space-x-4">
                    <button 
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC5F4F] focus:ring-offset-2 transition-all duration-200"
                      onClick={() => handleStepClick(1)}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      <span>Back</span>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#EC5F4F] px-6 py-3 text-base font-medium text-white shadow-md hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-[#EC5F4F] focus:ring-offset-2 transition-all duration-200 flex-1"
                      onClick={() => handleStepClick(3)}
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
              
              {activeStep === 3 && (
                <div className="space-y-8 max-w-xl mx-auto">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
                    <p className="text-gray-500">Choose your preferred payment method</p>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                      <div 
                        className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'credit' ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                        onClick={() => handlePaymentMethodChange('credit')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${paymentMethod === 'credit' ? 'border-[6px] border-[#EC5F4F]' : 'border-2 border-gray-300'}`}></div>
                          <CreditCard className="ml-3 h-5 w-5 text-gray-500" />
                          <span className="ml-2 font-medium text-gray-900">Credit Card</span>
                        </div>
                      </div>
                      <div 
                        className={`flex-1 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${paymentMethod === 'bank' ? 'border-pink-200 bg-pink-50' : 'border-gray-200 hover:border-indigo-200'}`}
                        onClick={() => handlePaymentMethodChange('bank')}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${paymentMethod === 'bank' ? 'border-[6px] border-[#EC5F4F]' : 'border-2 border-gray-300'}`}></div>
                          <Lock className="ml-3 h-5 w-5 text-gray-500" />
                          <span className="ml-2 font-medium text-gray-900">Bank Transfer</span>
                        </div>
                      </div>
                    </div>
                    
                    {paymentMethod === 'credit' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Card Number</label>
                          <div className="relative rounded-lg shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input 
                              type="text"
                              className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                              placeholder="1234 5678 9012 3456"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Expiration Date</label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                              <input 
                                type="text"
                                className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                                placeholder="MM/YY"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">CVV</label>
                            <div className="relative rounded-lg shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input 
                                type="text"
                                className="block w-full rounded-lg border-gray-200 border py-3 pl-10 pr-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Cardholder Name</label>
                          <input 
                            type="text"
                            className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === 'bank' && (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                          <input 
                            type="text"
                            className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                          <input 
                            type="text"
                            className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                            placeholder="123456789"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Account Number</label>
                          <input 
                            type="text"
                            className="block w-full rounded-lg border-gray-200 border py-3 px-3 focus:border-[#EC5F4F] focus:ring-[#EC5F4F] sm:text-sm shadow-sm"
                            placeholder="987654321"
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start pt-4">
                      <div className="flex h-5 items-center text-pink-500">
                        <input 
                          id="terms" 
                          name="terms" 
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#EC5F4F] focus:ring-[#EC5F4F]" 
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          I agree to the <a href="#" className="text-[#EC5F4F] hover:text-[#EC5F4F]">Terms & Conditions</a> and <a href="#" className="text-[#EC5F4F] hover:text-[#EC5F4F]">Privacy Policy</a>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 flex space-x-4">
                    <button 
                      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#EC5F4F] focus:ring-offset-2 transition-all duration-200"
                      onClick={() => handleStepClick(2)}
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      <span>Back</span>
                    </button>
                    <button 
                      className="inline-flex items-center justify-center rounded-lg border border-transparent bg-[#EC5F4F] px-6 py-3 text-base font-medium text-white shadow-md hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-[#EC5F4F] focus:ring-offset-2 transition-all duration-200 flex-1"
                    >
                      <span>Complete Purchase</span>
                      <CheckCircle className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="bg-gray-50 py-8 px-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
                </div>
                
                <div className="border-t border-b border-gray-200 py-4">
                  <div className="flex justify-between items-center cursor-pointer" onClick={togglePlanDetails}>
                    <div className="font-medium text-gray-900">Plan Details</div>
                    {showPlanDetails ? 
                      <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    }
                  </div>
                  
                  {showPlanDetails && (
                    <div className="mt-4 space-y-3 animate-fadeIn">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Premium Protection Plan</span>
                        <span className="text-gray-900 font-medium">$1,800/year</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Billing</span>
                        <span className="text-gray-900 font-medium">Monthly</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coverage Start</span>
                        <span className="text-gray-900 font-medium">05/01/2025</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coverage End</span>
                        <span className="text-gray-900 font-medium">05/01/2026</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Premium</span>
                    <span className="text-gray-900 font-medium">$150.00/month</span>
                  </div>
                  
                  {addons.identity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Identity Theft Protection</span>
                      <span className="text-gray-900 font-medium">$10.00/month</span>
                    </div>
                  )}
                  
                  {addons.roadside && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Roadside Assistance</span>
                      <span className="text-gray-900 font-medium">$8.00/month</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Discounts</span>
                    <span className="text-green-600 font-medium">-$15.00/month</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">
                      ${(150 + (addons.identity ? 10 : 0) + (addons.roadside ? 8 : 0) - 15).toFixed(2)}/month
                    </span>
                  </div>
                </div>
                
                <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                  <div className="flex">
                    <Shield className="h-6 w-6 text-green-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-green-800">Protected Purchase</h4>
                      <p className="text-xs text-green-700 mt-1">Your information is encrypted and securely stored</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex">
                    <Info className="h-6 w-6 text-blue-600" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Need Help?</h4>
                      <p className="text-xs text-blue-700 mt-1">Contact our support team at 1-800-123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}