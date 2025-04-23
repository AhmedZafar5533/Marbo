import { useState } from 'react';
import { ChevronDown, Calendar, ArrowLeft, CheckCircle, AlertCircle, User, Phone, CreditCard, Heart, Shield } from 'lucide-react';

export default function AppointmentForm() {
  // Form sections data
  const formSections = {
    Identity: {
      fields: ['firstName', 'middleName', 'lastName', 'idNumber', 'maritalStatus', 'placeOfBirth', 'dateOfBirth', 'gender'],
      title: 'Identity',
      component: IdentitySection,
      icon: User,
      number: '01'
    },
    'Contact Information': {
      fields: ['email', 'phone', 'address', 'city', 'country', 'postalCode'],
      title: 'Contact Information',
      component: ContactSection,
      icon: Phone,
      number: '02'
    },
    'Health History': {
      fields: ['allergies', 'medications', 'pastConditions', 'surgeries', 'familyHistory'],
      title: 'Health History',
      component: HealthHistorySection,
      icon: Heart,
      number: '03'
    },
    'Payment Details': {
      fields: ['paymentMethod', 'cardNumber', 'cardHolder', 'expiration', 'cvv'],
      title: 'Payment Details',
      component: PaymentSection,
      icon: CreditCard,
      number: '04'
    },
    'Insurance': {
      fields: ['insuranceProvider', 'memberID', 'groupNumber', 'policyHolder'],
      title: 'Insurance',
      component: InsuranceSection,
      icon: Shield,
      number: '05'
    },
    'Appointment Details': {
      fields: ['complaints', 'department', 'doctor', 'schedule'],
      title: 'Appointment Details',
      component: AppointmentDetailsSection,
      icon: Calendar,
      number: '06'
    }
  };

  const [formData, setFormData] = useState({
    // Identity
    firstName: 'Larrason',
    middleName: 'Greyson',
    lastName: 'Gloriadiana',
    idNumber: '21291929129',
    maritalStatus: 'Single',
    placeOfBirth: 'Indonesia',
    dateOfBirth: '02/12/2000',
    gender: 'Female',
    
    // Contact Information
    email: 'larrason@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Ave',
    city: 'Jakarta',
    country: 'Indonesia',
    postalCode: '12345',
    
    // Health History
    allergies: 'None',
    medications: 'Vitamin D',
    pastConditions: 'None',
    surgeries: 'None',
    familyHistory: 'Heart disease',
    
    // Payment Details
    paymentMethod: 'Credit Card',
    cardNumber: '',
    cardHolder: '',
    expiration: '',
    cvv: '',
    
    // Insurance
    insuranceProvider: 'HealthFirst',
    memberID: 'HF-123456789',
    groupNumber: 'GRP-001',
    policyHolder: 'Self',
    
    // Appointment Details
    complaints: 'Burning sensation in upper abdominal region, occasional acid reflux, especially after eating spicy foods.',
    department: '',
    doctor: '',
    schedule: ''
  });

  const [activeSection, setActiveSection] = useState('Identity');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focused, setFocused] = useState('');
  const [formProgress, setFormProgress] = useState(20);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update progress when fields are filled
    calculateProgress();
  };

  const calculateProgress = () => {
    const totalFields = Object.values(formSections).reduce((acc, section) => acc + section.fields.length, 0);
    const filledFields = Object.entries(formData).filter(([key, value]) => value !== '').length;
    const newProgress = Math.floor((filledFields / totalFields) * 100);
    setFormProgress(newProgress);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const sections = Object.keys(formSections).map(name => {
    const { icon } = formSections[name];
    return { name, icon };
  });

  // Get the current section component
  const CurrentSectionComponent = formSections[activeSection].component;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg max-w-5xl mx-auto my-5 p-8 overflow-hidden">
      <div className="flex items-center mb-6">
        <button 
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-300 bg-white p-2 rounded-lg shadow-sm"
          onMouseEnter={() => setHoveredButton('back')} 
          onMouseLeave={() => setHoveredButton(null)}
        >
          <ArrowLeft 
            size={18} 
            className={`mr-1 ${hoveredButton === 'back' ? 'transform -translate-x-1 transition-transform duration-300' : 'transition-transform duration-300'}`} 
          />
          <span>Back</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Add New Appointment</h1>
          <p className="text-gray-500 mt-2">
            Complete all information accordingly and wait for department's confirmation.
          </p>
        </div>
        {formSubmitted && (
          <div className="flex items-center bg-green-100 text-green-700 py-2 px-4 rounded-lg animate-fade-in-right">
            <CheckCircle size={20} className="mr-2" />
            <span>Appointment submitted successfully!</span>
          </div>
        )}
      </div>
      
      <div className="h-1 w-full bg-gray-100 mb-8 rounded-full overflow-hidden">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500" 
          style={{ width: `${formProgress}%` }}
        ></div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-4 gap-8">
          {/* Left sidebar navigation */}
          <div className="col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <nav>
                <ul className="space-y-1">
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <li key={section.name}>
                        <button
                          type="button"
                          onClick={() => setActiveSection(section.name)}
                          className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 ${
                            activeSection === section.name
                              ? 'bg-blue-50 text-blue-600 font-medium shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Icon size={18} className={`mr-3 ${activeSection === section.name ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span>{section.name}</span>
                          {activeSection === section.name && (
                            <div className="ml-auto bg-blue-600 h-6 w-1 rounded-full"></div>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
            
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl shadow-sm border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-600">Contact our support team for assistance with your appointment.</p>
              <button 
                type="button"
                className="mt-3 text-sm bg-white text-blue-600 hover:bg-blue-50 transition-colors duration-300 py-2 px-4 rounded-lg shadow-sm border border-blue-100"
              >
                Contact Support
              </button>
            </div>
          </div>

          {/* Main form area */}
          <div className="col-span-3 bg-white rounded-xl shadow-sm p-6">
            {/* Dynamic section rendering */}
            <CurrentSectionComponent 
              formData={formData} 
              handleChange={handleChange} 
              focused={focused}
              setFocused={setFocused}
              sectionInfo={formSections[activeSection]}
            />

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button 
                type="button"
                onClick={() => {
                  const sectionKeys = Object.keys(formSections);
                  const currentIndex = sectionKeys.indexOf(activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(sectionKeys[currentIndex - 1]);
                  }
                }}
                disabled={activeSection === Object.keys(formSections)[0]}
                className={`border border-gray-200 ${activeSection === Object.keys(formSections)[0] ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 hover:bg-gray-50'} bg-white text-gray-600 font-medium py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center`}
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </button>
              
              {activeSection === Object.keys(formSections)[Object.keys(formSections).length - 1] ? (
                <button 
                  type="submit" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center"
                  onMouseEnter={() => setHoveredButton('submit')} 
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span>Submit Appointment</span>
                  <CheckCircle 
                    size={18} 
                    className={`ml-2 ${hoveredButton === 'submit' ? 'opacity-100 transform translate-x-1' : 'opacity-0'} transition-all duration-300`} 
                  />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={() => {
                    const sectionKeys = Object.keys(formSections);
                    const currentIndex = sectionKeys.indexOf(activeSection);
                    if (currentIndex < sectionKeys.length - 1) {
                      setActiveSection(sectionKeys[currentIndex + 1]);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg flex items-center"
                >
                  <span>Next Section</span>
                  <ChevronDown size={16} className="ml-2 transform rotate-270" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Identity Section Component
function IdentitySection({ formData, handleChange, focused, setFocused, sectionInfo }) {
  return (
    <div>
      {/* Patient Name Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
          Patient Name
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">First name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onFocus={() => setFocused('firstName')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'firstName' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Middle name</label>
            <input
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              onFocus={() => setFocused('middleName')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'middleName' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Last name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onFocus={() => setFocused('lastName')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'lastName' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="mb-4">
        <h2 className="text-xl font-medium mb-4 flex items-center">
          <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">+</span>
          Basic Information
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1 flex items-center">
              ID / Passport Number
              <span className="text-red-500 ml-1">*</span>
              <div className="relative group ml-1">
                <AlertCircle size={14} className="text-gray-400" />
                <div className="absolute left-full ml-2 w-48 bg-gray-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  This ID will be used for verification purposes
                </div>
              </div>
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
              onFocus={() => setFocused('idNumber')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'idNumber' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Marital Status</label>
            <input
              type="text"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              onFocus={() => setFocused('maritalStatus')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'maritalStatus' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Place of Birth<span className="text-red-500">*</span>
            </label>
            <div className={`relative ${focused === 'placeOfBirth' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
              <select
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                required
                onFocus={() => setFocused('placeOfBirth')}
                onBlur={() => setFocused('')}
                className={`w-full border ${focused === 'placeOfBirth' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
              >
                <option value="Indonesia">Indonesia</option>
                <option value="Malaysia">Malaysia</option>
                <option value="Singapore">Singapore</option>
                <option value="Thailand">Thailand</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'placeOfBirth' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Date of Birth<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                placeholder="DD/MM/YYYY"
                onFocus={() => setFocused('dateOfBirth')}
                onBlur={() => setFocused('')}
                className={`w-full border ${focused === 'dateOfBirth' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
              />
              <Calendar className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'dateOfBirth' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Gender<span className="text-red-500">*</span>
            </label>
            <div className={`relative ${focused === 'gender' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                onFocus={() => setFocused('gender')}
                onBlur={() => setFocused('')}
                className={`w-full border ${focused === 'gender' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'gender' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Information Section Component
function ContactSection({ formData, handleChange, focused, setFocused, sectionInfo }) {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
        Contact Information
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'email' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Phone Number<span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            onFocus={() => setFocused('phone')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'phone' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">
          Street Address<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          onFocus={() => setFocused('address')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'address' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-500 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            onFocus={() => setFocused('city')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'city' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Country</label>
          <div className={`relative ${focused === 'country' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              onFocus={() => setFocused('country')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'country' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
            >
              <option value="Indonesia">Indonesia</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="Thailand">Thailand</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'country' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            onFocus={() => setFocused('postalCode')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'postalCode' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
      </div>
    </div>
  );
}

// Health History Section Component
function HealthHistorySection({ formData, handleChange, focused, setFocused, sectionInfo }) {
  return (
    <div>
      <h2 className="text-xl font-medium mb-4 flex items-center">
        <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
        Health History
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Allergies</label>
        <input
          type="text"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          placeholder="List any allergies, or write 'None'"
          onFocus={() => setFocused('allergies')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'allergies' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Current Medications</label>
        <input
          type="text"
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          placeholder="List any medications you're currently taking"
          onFocus={() => setFocused('medications')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'medications' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Past Medical Conditions</label>
        <textarea
          name="pastConditions"
          value={formData.pastConditions}
          onChange={handleChange}
          rows="3"
          placeholder="List any past medical conditions"
          onFocus={() => setFocused('pastConditions')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'pastConditions' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm text-gray-500 mb-1">Previous Surgeries</label>
        <textarea
          name="surgeries"
          value={formData.surgeries}
          onChange={handleChange}
          rows="2"
          placeholder="List any previous surgeries with approximate dates"
          onFocus={() => setFocused('surgeries')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'surgeries' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-500 mb-1">Family Medical History</label>
        <textarea
        name="familyHistory"
        value={formData.familyHistory}
        onChange={handleChange}
        rows="2"
        placeholder="List any significant family medical history"
        onFocus={() => setFocused('familyHistory')}
        onBlur={() => setFocused('')}
        className={`w-full border ${focused === 'familyHistory' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
      />
    </div>
  </div>
);
}

// Payment Section Component
function PaymentSection({ formData, handleChange, focused, setFocused, sectionInfo }) {
return (
  <div>
    <h2 className="text-xl font-medium mb-4 flex items-center">
      <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
      Payment Details
    </h2>
    
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">Payment Method</label>
      <div className={`relative ${focused === 'paymentMethod' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          onFocus={() => setFocused('paymentMethod')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'paymentMethod' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
        >
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cash">Cash</option>
          <option value="Insurance">Insurance</option>
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'paymentMethod' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
      </div>
    </div>
    
    {formData.paymentMethod === 'Credit Card' || formData.paymentMethod === 'Debit Card' ? (
      <>
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="XXXX XXXX XXXX XXXX"
            onFocus={() => setFocused('cardNumber')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'cardNumber' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm text-gray-500 mb-1">Card Holder Name</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="Name as it appears on card"
            onFocus={() => setFocused('cardHolder')}
            onBlur={() => setFocused('')}
            className={`w-full border ${focused === 'cardHolder' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Expiration Date (MM/YY)</label>
            <input
              type="text"
              name="expiration"
              value={formData.expiration}
              onChange={handleChange}
              placeholder="MM/YY"
              onFocus={() => setFocused('expiration')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'expiration' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="XXX"
              onFocus={() => setFocused('cvv')}
              onBlur={() => setFocused('')}
              className={`w-full border ${focused === 'cvv' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
            />
          </div>
        </div>
      </>
    ) : (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <p className="text-gray-600">Additional payment details will be collected at the time of your appointment.</p>
      </div>
    )}
  </div>
);
}

// Insurance Section Component
function InsuranceSection({ formData, handleChange, focused, setFocused, sectionInfo }) {
return (
  <div>
    <h2 className="text-xl font-medium mb-4 flex items-center">
      <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
      Insurance Information
    </h2>
    
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">Insurance Provider</label>
      <input
        type="text"
        name="insuranceProvider"
        value={formData.insuranceProvider}
        onChange={handleChange}
        onFocus={() => setFocused('insuranceProvider')}
        onBlur={() => setFocused('')}
        className={`w-full border ${focused === 'insuranceProvider' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
      />
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm text-gray-500 mb-1">Member ID</label>
        <input
          type="text"
          name="memberID"
          value={formData.memberID}
          onChange={handleChange}
          onFocus={() => setFocused('memberID')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'memberID' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-500 mb-1">Group Number</label>
        <input
          type="text"
          name="groupNumber"
          value={formData.groupNumber}
          onChange={handleChange}
          onFocus={() => setFocused('groupNumber')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'groupNumber' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
        />
      </div>
    </div>
    
    <div>
      <label className="block text-sm text-gray-500 mb-1">Policy Holder</label>
      <div className={`relative ${focused === 'policyHolder' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
        <select
          name="policyHolder"
          value={formData.policyHolder}
          onChange={handleChange}
          onFocus={() => setFocused('policyHolder')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'policyHolder' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
        >
          <option value="Self">Self</option>
          <option value="Spouse">Spouse</option>
          <option value="Parent">Parent</option>
          <option value="Other">Other</option>
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'policyHolder' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
      </div>
    </div>
  </div>
);
}

// Appointment Details Section Component
function AppointmentDetailsSection({ formData, handleChange, focused, setFocused, sectionInfo }) {
// Mock data for departments and doctors
const departments = [
  { id: 1, name: "General Medicine" },
  { id: 2, name: "Cardiology" },
  { id: 3, name: "Neurology" },
  { id: 4, name: "Orthopedics" },
  { id: 5, name: "Gastroenterology" },
  { id: 6, name: "Dermatology" }
];

const doctors = {
  "General Medicine": [
    { id: 1, name: "Dr. Sarah Johnson" },
    { id: 2, name: "Dr. Michael Lee" }
  ],
  "Cardiology": [
    { id: 3, name: "Dr. Robert Smith" },
    { id: 4, name: "Dr. Emily Chen" }
  ],
  "Neurology": [
    { id: 5, name: "Dr. David Wilson" },
    { id: 6, name: "Dr. Lisa Brown" }
  ],
  "Orthopedics": [
    { id: 7, name: "Dr. James Taylor" },
    { id: 8, name: "Dr. Patricia Davis" }
  ],
  "Gastroenterology": [
    { id: 9, name: "Dr. Thomas Moore" },
    { id: 10, name: "Dr. Jennifer White" }
  ],
  "Dermatology": [
    { id: 11, name: "Dr. Richard Harris" },
    { id: 12, name: "Dr. Susan Jackson" }
  ]
};

// Mock available schedules
const availableSchedules = [
  "09:00 AM - 10:00 AM",
  "10:30 AM - 11:30 AM",
  "01:00 PM - 02:00 PM",
  "02:30 PM - 03:30 PM",
  "04:00 PM - 05:00 PM"
];

return (
  <div>
    <h2 className="text-xl font-medium mb-4 flex items-center">
      <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">{sectionInfo.number}</span>
      Appointment Details
    </h2>
    
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">
        Main Complaints/Symptoms<span className="text-red-500">*</span>
      </label>
      <textarea
        name="complaints"
        value={formData.complaints}
        onChange={handleChange}
        rows="3"
        required
        placeholder="Describe your symptoms or reason for appointment"
        onFocus={() => setFocused('complaints')}
        onBlur={() => setFocused('')}
        className={`w-full border ${focused === 'complaints' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
      />
    </div>
    
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">
        Department<span className="text-red-500">*</span>
      </label>
      <div className={`relative ${focused === 'department' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          required
          onFocus={() => setFocused('department')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'department' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'department' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
      </div>
    </div>
    
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">
        Doctor<span className="text-red-500">*</span>
      </label>
      <div className={`relative ${focused === 'doctor' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
        <select
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          required
          disabled={!formData.department}
          onFocus={() => setFocused('doctor')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'doctor' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 ${!formData.department ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 hover:bg-gray-100 focus:bg-white'} pr-10`}
        >
          <option value="">Select Doctor</option>
          {formData.department && doctors[formData.department]?.map(doc => (
            <option key={doc.id} value={doc.name}>{doc.name}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'doctor' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
      </div>
    </div>
    
    <div>
      <label className="block text-sm text-gray-500 mb-1">
        Preferred Schedule<span className="text-red-500">*</span>
      </label>
      <div className={`relative ${focused === 'schedule' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
        <select
          name="schedule"
          value={formData.schedule}
          onChange={handleChange}
          required
          disabled={!formData.doctor}
          onFocus={() => setFocused('schedule')}
          onBlur={() => setFocused('')}
          className={`w-full border ${focused === 'schedule' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 ${!formData.doctor ? 'bg-gray-100 text-gray-400' : 'bg-gray-50 hover:bg-gray-100 focus:bg-white'} pr-10`}
        >
          <option value="">Select Time Slot</option>
          {formData.doctor && availableSchedules.map((schedule, index) => (
            <option key={index} value={schedule}>{schedule}</option>
          ))}
        </select>
        <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'schedule' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
      </div>
    </div>
  </div>
);
}