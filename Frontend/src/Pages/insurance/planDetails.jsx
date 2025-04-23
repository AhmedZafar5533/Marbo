import { useState, useEffect } from 'react';
import { ChevronLeft, Check, Shield, Star, Heart, AlertCircle, ArrowRight } from 'lucide-react';

export default function PlanDetailsApplication() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    healthInfo: {
      hasPreExistingConditions: '',
      preExistingConditions: '',
      medications: '',
      primaryPhysician: '',
      smoke: '',
    },
    coverageInfo: {
      startDate: '',
      dependents: [],
      agreesToTerms: false,
    }
  });
  const [formErrors, setFormErrors] = useState({
    personalInfo: {},
    healthInfo: {},
    coverageInfo: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Updated modern color scheme
  const colors = {
    primary: '#ED6A5A',       // Warm Coral
    secondary: '#EC5F4F',     // Softer Coral Red
    dark: '#071E22',          // Dark Teal
    accent: '#121212',        // Charcoal Black
    light: '#FFFFFF',         // White
    lightGray: '#F3F4F6',
    gray: '#6B7280',
    success: '#10B981',
    error: '#EF4444'
  };

  const planId = 4;

  useEffect(() => {
    const fetchData = setTimeout(() => {
      const mockPlan = {
        id: 4,
        name: 'Platinum Individual Plan',
        type: 'individual',
        monthlyPremium: 510.25,
        annualPremium: 6123.00,
        coverageLevel: 'premium',
        deductible: 1000,
        description: 'Premium coverage with low deductibles and comprehensive benefits.',
        rating: 4.9,
        features: [
          { name: 'Primary care visits', coverage: 'Covered 100% after $20 copay' },
          { name: 'Specialist visits', coverage: 'Covered 100% after $40 copay' },
          { name: 'Emergency care', coverage: 'Covered 90% after deductible' },
          { name: 'Hospital stays', coverage: 'Covered 90% after deductible' },
          { name: 'Prescription drugs', coverage: 'Covered with $10 generic/$30 brand copay' },
          { name: 'Mental health services', coverage: 'Covered 100% after $20 copay' },
          { name: 'Dental services', coverage: 'Preventive covered 100%, other services 80%' },
          { name: 'Vision services', coverage: 'Annual exam covered, $150 frame allowance' },
          { name: 'Alternative medicine', coverage: 'Covered up to 12 visits per year' },
          { name: 'Wellness programs', coverage: 'Included with premium membership' }
        ],
        faqs: [
          { 
            question: 'What is the out-of-pocket maximum?', 
            answer: `The out-of-pocket maximum for this plan is $4,000 for an individual. This means once you've spent $4,000 on deductibles, copayments, and coinsurance, your health plan will pay 100% of the costs of covered benefits.` 
          },
          { 
            question: 'Are pre-existing conditions covered?', 
            answer: 'Yes, this plan covers pre-existing conditions from the effective date of your coverage, as required by the Affordable Care Act.' 
          },
          { 
            question: 'Can I add dependents to this individual plan?', 
            answer: `This is an individual plan, but we offer family versions of all our plans. You can add dependents during the application process, and we'll adjust your quote accordingly.` 
          },
          { 
            question: 'Is there a waiting period before coverage begins?', 
            answer: 'There is no waiting period. Your coverage begins on the effective date of your policy, which is typically the first day of the month following your application approval.' 
          },
          { 
            question: 'What happens if I need to see a doctor outside of the network?', 
            answer: 'Out-of-network care is covered at a lower rate (typically 60% after a separate out-of-network deductible). For the best coverage, we recommend staying within our extensive provider network.' 
          }
        ],
        networkSize: 'Large nationwide network with 95% of hospitals and 92% of doctors',
        outOfNetworkCoverage: '60% after separate deductible of $2,000',
        outOfPocketMax: 4000,
        icon: 'shield',
        bestFor: 'Individuals seeking premium healthcare with minimal out-of-pocket costs'
      };
      
      setPlan(mockPlan);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fetchData);
  }, [planId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
    
    if (formErrors[section]?.[field]) {
      setFormErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: undefined
        }
      }));
    }
  };

  const addDependent = () => {
    setFormData(prevData => ({
      ...prevData,
      coverageInfo: {
        ...prevData.coverageInfo,
        dependents: [
          ...prevData.coverageInfo.dependents,
          { firstName: '', lastName: '', relationship: '', dateOfBirth: '' }
        ]
      }
    }));
  };

  const removeDependent = (index) => {
    setFormData(prevData => ({
      ...prevData,
      coverageInfo: {
        ...prevData.coverageInfo,
        dependents: prevData.coverageInfo.dependents.filter((_, i) => i !== index)
      }
    }));
  };

  const updateDependent = (index, field, value) => {
    setFormData(prevData => {
      const updatedDependents = [...prevData.coverageInfo.dependents];
      updatedDependents[index] = {
        ...updatedDependents[index],
        [field]: value
      };
      
      return {
        ...prevData,
        coverageInfo: {
          ...prevData.coverageInfo,
          dependents: updatedDependents
        }
      };
    });
  };

  const validateStep = (step) => {
    const errors = {
      personalInfo: {},
      healthInfo: {},
      coverageInfo: {}
    };
    
    if (step === 1) {
      const { firstName, lastName, dateOfBirth, email, phone } = formData.personalInfo;
      if (!firstName) errors.personalInfo.firstName = 'First name is required';
      if (!lastName) errors.personalInfo.lastName = 'Last name is required';
      if (!dateOfBirth) errors.personalInfo.dateOfBirth = 'Date of birth is required';
      if (!email) {
        errors.personalInfo.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.personalInfo.email = 'Email is invalid';
      }
      if (!phone) errors.personalInfo.phone = 'Phone number is required';
    }
    
    if (step === 2) {
      const { hasPreExistingConditions, smoke } = formData.healthInfo;
      if (!hasPreExistingConditions) errors.healthInfo.hasPreExistingConditions = 'Please answer this question';
      if (!smoke) errors.healthInfo.smoke = 'Please answer this question';
    }
    
    if (step === 3) {
      const { startDate, agreesToTerms } = formData.coverageInfo;
      if (!startDate) errors.coverageInfo.startDate = 'Start date is required';
      if (!agreesToTerms) errors.coverageInfo.agreesToTerms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.values(errors).every(section => Object.keys(section).length === 0);
  };

  const goToNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(formStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    setFormStep(formStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(formStep)) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        window.scrollTo(0, 0);
      }, 2000);
    }
  };

  const renderIcon = (iconName) => {
    switch(iconName) {
      case 'star':
        return <Star className="w-8 h-8 text-yellow-500" />;
      case 'shield':
        return <Shield className="w-8 h-8 text-[#ED6A5A]" />;
      case 'heart':
        return <Heart className="w-8 h-8 text-red-500" />;
      default:
        return <Star className="w-8 h-8 text-yellow-500" />;
    }
  };

  const renderPersonalInfoForm = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
            <input
              type="text"
              id="firstName"
              className={`mt-1 block w-full border ${formErrors.personalInfo?.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.personalInfo?.firstName ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
              value={formData.personalInfo.firstName}
              onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            />
            {formErrors.personalInfo?.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.personalInfo.firstName}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
            <input
              type="text"
              id="lastName"
              className={`mt-1 block w-full border ${formErrors.personalInfo?.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.personalInfo?.lastName ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
              value={formData.personalInfo.lastName}
              onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            />
            {formErrors.personalInfo?.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.personalInfo.lastName}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            className={`mt-1 block w-full border ${formErrors.personalInfo?.dateOfBirth ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.personalInfo?.dateOfBirth ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
          />
          {formErrors.personalInfo?.dateOfBirth && <p className="mt-1 text-sm text-red-600">{formErrors.personalInfo.dateOfBirth}</p>}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
          <input
            type="email"
            id="email"
            className={`mt-1 block w-full border ${formErrors.personalInfo?.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.personalInfo?.email ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
          />
          {formErrors.personalInfo?.email && <p className="mt-1 text-sm text-red-600">{formErrors.personalInfo.email}</p>}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            className={`mt-1 block w-full border ${formErrors.personalInfo?.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.personalInfo?.phone ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
          />
          {formErrors.personalInfo?.phone && <p className="mt-1 text-sm text-red-600">{formErrors.personalInfo.phone}</p>}
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            id="address"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
            value={formData.personalInfo.address}
            onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              id="city"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
              value={formData.personalInfo.city}
              onChange={(e) => handleInputChange('personalInfo', 'city', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              id="state"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
              value={formData.personalInfo.state}
              onChange={(e) => handleInputChange('personalInfo', 'state', e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
              value={formData.personalInfo.zipCode}
              onChange={(e) => handleInputChange('personalInfo', 'zipCode', e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderHealthInfoForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <p className="block text-sm font-medium text-gray-700">Do you have any pre-existing medical conditions? *</p>
          <div className="mt-2 space-x-4 flex items-center">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-[#ED6A5A] focus:ring-[#ED6A5A] border-gray-300 transition-colors duration-200"
                name="hasPreExistingConditions"
                value="yes"
                checked={formData.healthInfo.hasPreExistingConditions === 'yes'}
                onChange={(e) => handleInputChange('healthInfo', 'hasPreExistingConditions', e.target.value)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-[#ED6A5A] focus:ring-[#ED6A5A] border-gray-300 transition-colors duration-200"
                name="hasPreExistingConditions"
                value="no"
                checked={formData.healthInfo.hasPreExistingConditions === 'no'}
                onChange={(e) => handleInputChange('healthInfo', 'hasPreExistingConditions', e.target.value)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {formErrors.healthInfo?.hasPreExistingConditions && (
            <p className="mt-1 text-sm text-red-600">{formErrors.healthInfo.hasPreExistingConditions}</p>
          )}
        </div>
        
        {formData.healthInfo.hasPreExistingConditions === 'yes' && (
          <div className="animate-fadeIn">
            <label htmlFor="preExistingConditions" className="block text-sm font-medium text-gray-700">
              Please list your pre-existing conditions
            </label>
            <textarea
              id="preExistingConditions"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
              value={formData.healthInfo.preExistingConditions}
              onChange={(e) => handleInputChange('healthInfo', 'preExistingConditions', e.target.value)}
              style={{ transition: 'all 0.3s ease' }}
            ></textarea>
          </div>
        )}
        
        <div>
          <label htmlFor="medications" className="block text-sm font-medium text-gray-700">
            Current medications (if any)
          </label>
          <textarea
            id="medications"
            rows="3"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
            value={formData.healthInfo.medications}
            onChange={(e) => handleInputChange('healthInfo', 'medications', e.target.value)}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="primaryPhysician" className="block text-sm font-medium text-gray-700">
            Primary physician name and contact information (if any)
          </label>
          <input
            type="text"
            id="primaryPhysician"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
            value={formData.healthInfo.primaryPhysician}
            onChange={(e) => handleInputChange('healthInfo', 'primaryPhysician', e.target.value)}
          />
        </div>
        
        <div>
          <p className="block text-sm font-medium text-gray-700">Do you smoke tobacco products? *</p>
          <div className="mt-2 space-x-4 flex items-center">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-[#ED6A5A] focus:ring-[#ED6A5A] border-gray-300 transition-colors duration-200"
                name="smoke"
                value="yes"
                checked={formData.healthInfo.smoke === 'yes'}
                onChange={(e) => handleInputChange('healthInfo', 'smoke', e.target.value)}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="h-4 w-4 text-[#ED6A5A] focus:ring-[#ED6A5A] border-gray-300 transition-colors duration-200"
                name="smoke"
                value="no"
                checked={formData.healthInfo.smoke === 'no'}
                onChange={(e) => handleInputChange('healthInfo', 'smoke', e.target.value)}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {formErrors.healthInfo?.smoke && (
            <p className="mt-1 text-sm text-red-600">{formErrors.healthInfo.smoke}</p>
          )}
        </div>
      </div>
    );
  };

  const renderCoverageInfoForm = () => {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
            When would you like your coverage to start? *
          </label>
          <input
            type="date"
            id="startDate"
            className={`mt-1 block w-full border ${formErrors.coverageInfo?.startDate ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${formErrors.coverageInfo?.startDate ? 'red' : 'blue'}-500 transition-colors duration-200 sm:text-sm`}
            value={formData.coverageInfo.startDate}
            onChange={(e) => handleInputChange('coverageInfo', 'startDate', e.target.value)}
          />
          {formErrors.coverageInfo?.startDate && <p className="mt-1 text-sm text-red-600">{formErrors.coverageInfo.startDate}</p>}
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Dependents (Optional)</h3>
            <button
              type="button"
              onClick={addDependent}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-[#ED6A5A] hover:bg-[#ED6A5A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200"
            >
              Add Dependent
            </button>
          </div>
          
          {formData.coverageInfo.dependents.length > 0 ? (
            <div className="space-y-4">
              {formData.coverageInfo.dependents.map((dependent, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 transition-all duration-300 hover:shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base font-medium">Dependent #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeDependent(index)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
                        value={dependent.firstName}
                        onChange={(e) => updateDependent(index, 'firstName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
                        value={dependent.lastName}
                        onChange={(e) => updateDependent(index, 'lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Relationship</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
                        value={dependent.relationship}
                        onChange={(e) => updateDependent(index, 'relationship', e.target.value)}
                      >
                        <option value="">Select</option>
                        <option value="spouse">Spouse</option>
                        <option value="child">Child</option>
                        <option value="parent">Parent</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                      <input
                        type="date"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-colors duration-200 sm:text-sm"
                        value={dependent.dateOfBirth}
                        onChange={(e) => updateDependent(index, 'dateOfBirth', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No dependents added</p>
          )}
        </div>
        
        <div>
          <div className={`relative flex items-start ${formErrors.coverageInfo?.agreesToTerms ? 'border-red-500 border p-2 rounded' : ''}`}>
            <div className="flex items-center h-5">
              <input
                id="agreesToTerms"
                type="checkbox"
                className="focus:ring-[#ED6A5A] h-4 w-4 text-[#ED6A5A] border-gray-300 rounded transition-colors duration-200"
                checked={formData.coverageInfo.agreesToTerms}
                onChange={(e) => handleInputChange('coverageInfo', 'agreesToTerms', e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreesToTerms" className="font-medium text-gray-700">
                I agree to the terms and conditions *
              </label>
              <p className="text-gray-500">
                By checking this box, you agree to our Terms of Service, Privacy Policy, and consent to the collection and use of your health information as described in our Notice of Privacy Practices.
              </p>
            </div>
          </div>
          {formErrors.coverageInfo?.agreesToTerms && <p className="mt-1 text-sm text-red-600">{formErrors.coverageInfo.agreesToTerms}</p>}
        </div>
      </div>
    );
  };

  const renderPlanDetails = () => {
    if (!plan) return null;
    
    return (
      <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center">
            {renderIcon(plan.icon)}
            <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
              <p className="text-gray-600">{plan.type} plan</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">${plan.monthlyPremium.toFixed(2)}</span>
              <span className="ml-1 text-gray-600">/month</span>
            </div>
            <p className="text-gray-500 text-sm">${plan.annualPremium.toFixed(2)} annually</p>
          </div>
          
          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(plan.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill={i < Math.floor(plan.rating) ? 'currentColor' : 'none'} 
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600">{plan.rating} out of 5</span>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'details' ? 'text-[#ED6A5A] border-b-2 border-[#ED6A5A]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('details')}
            >
              Plan Details
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'coverage' ? 'text-[#ED6A5A] border-b-2 border-[#ED6A5A]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('coverage')}
            >
              Coverage
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${activeTab === 'faq' ? 'text-[#ED6A5A] border-b-2 border-[#ED6A5A]' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => handleTabChange('faq')}
            >
              FAQ
            </button>
          </div>
          
          <div className="mt-6">
            {activeTab === 'details' && (
              <div className="space-y-4">
                <p className="text-gray-700">{plan.description}</p>
                
                <div>
                  <h3 className="font-medium text-gray-900">Best For</h3>
                  <p className="mt-1 text-gray-700">{plan.bestFor}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Deductible</h3>
                  <p className="mt-1 text-gray-700">${plan.deductible}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Out-of-Pocket Maximum</h3>
                  <p className="mt-1 text-gray-700">${plan.outOfPocketMax}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Network</h3>
                  <p className="mt-1 text-gray-700">{plan.networkSize}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Out-of-Network Coverage</h3>
                  <p className="mt-1 text-gray-700">{plan.outOfNetworkCoverage}</p>
                </div>
              </div>
            )}
            
            {activeTab === 'coverage' && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900">Coverage Details</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coverage</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {plan.features.map((feature, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {feature.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {feature.coverage}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h3 className="font-medium text-gray-900">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {plan.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                      <h4 className="text-base font-medium text-gray-900">{faq.question}</h4>
                      <p className="mt-2 text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return renderPersonalInfoForm();
      case 2:
        return renderHealthInfoForm();
      case 3:
        return renderCoverageInfoForm();
      default:
        return null;
    }
  };

  const renderSuccessMessage = () => {
    return (
      <div className="text-center p-8 max-w-md mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="mt-2 text-gray-600">
          Thank you for applying for the {plan.name}. We have received your application and will process it within 24-48 hours.
        </p>
        <p className="mt-4 text-gray-600">
          You will receive a confirmation email at {formData.personalInfo.email} with additional information about your application.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => window.location.href = '/dashboard'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ED6A5A] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED6A5A]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Plans
          </button>
        </div>
        
        {isSubmitted ? (
          renderSuccessMessage()
        ) : (
          <div className="space-y-8">
            {renderPlanDetails()}
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="pb-5 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Application Form{formStep > 1 ? ` - Step ${formStep} of 3` : ''}
                </h3>
                {formStep > 1 && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-[#ED6A5A] h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                          style={{ width: `${(formStep - 1) * 50}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <form onSubmit={handleSubmit}>
                  {renderFormStep()}
                  
                  <div className="mt-8 flex items-center justify-between">
                    {formStep > 1 && (
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
                      >
                        <ChevronLeft className="h-5 w-5 mr-1" />
                        Previous
                      </button>
                    )}
                    
                    {formStep < 3 ? (
                      <button
                        type="button"
                        onClick={goToNextStep}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ED6A5A] hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] ml-auto"
                      >
                        Next
                        <ArrowRight className="h-5 w-5 ml-1" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ml-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          'Submit Application'
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Have questions about this plan or need help with your application? 
                    <a href="/contact" className="font-medium underline ml-1">Contact our support team</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}