import { useState } from 'react';
import { ChevronDown, Calendar, ArrowLeft, CheckCircle, AlertCircle, User, Phone, CreditCard, Heart, Shield } from 'lucide-react';

export default function AppointmentForm() {
  const [formData, setFormData] = useState({
    firstName: 'Larrason',
    middleName: 'Greyson',
    lastName: 'Gloriadiana',
    idNumber: '21291929129',
    maritalStatus: 'Single',
    placeOfBirth: 'Indonesia',
    dateOfBirth: '02/12/2000',
    gender: 'Female',
    complaints: 'Burning sensation in upper',
    department: '',
    doctor: '',
    schedule: ''
  });

  const [activeSection, setActiveSection] = useState('Identity');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  const sections = [
    { name: 'Identity', icon: User },
    { name: 'Contact Information', icon: Phone },
    { name: 'Health History', icon: Heart },
    { name: 'Payment Details', icon: CreditCard },
    { name: 'Insurance', icon: Shield }
  ];

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
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full" style={{ width: '20%' }}></div>
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
            {/* Patient Name Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">01</span>
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
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">02</span>
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

            {/* Appointment Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-md mr-2">03</span>
                Appointment Details
              </h2>
              <div className="mb-6">
                <label className="block text-sm text-gray-500 mb-1">
                  Complaints<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="complaints"
                  value={formData.complaints}
                  onChange={handleChange}
                  required
                  rows="4"
                  onFocus={() => setFocused('complaints')}
                  onBlur={() => setFocused('')}
                  className={`w-full border ${focused === 'complaints' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
                ></textarea>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-400">Be specific about your symptoms</span>
                  <span className="text-xs text-gray-400">{formData.complaints.length}/500</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">
                    Assigned Department<span className="text-red-500">*</span>
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
                      <option value="">Select Department in Charge</option>
                      <option value="cardiology">Cardiology</option>
                      <option value="dermatology">Dermatology</option>
                      <option value="gastroenterology">Gastroenterology</option>
                      <option value="neurology">Neurology</option>
                      <option value="orthopedics">Orthopedics</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'department' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Assigned Doctor</label>
                  <div className={`relative ${focused === 'doctor' ? 'ring-2 ring-blue-100 rounded-lg' : ''}`}>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      onFocus={() => setFocused('doctor')}
                      onBlur={() => setFocused('')}
                      className={`w-full border ${focused === 'doctor' ? 'border-blue-500' : 'border-gray-200'} rounded-lg p-3 appearance-none transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white pr-10`}
                    >
                      <option value="">Select Doctor</option>
                      <option value="dr-smith">Dr. Smith</option>
                      <option value="dr-johnson">Dr. Johnson</option>
                      <option value="dr-williams">Dr. Williams</option>
                      <option value="dr-brown">Dr. Brown</option>
                    </select>
                    <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'doctor' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">
                  Schedule<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleChange}
                    required
                    placeholder="Choose Available Schedule"
                    onFocus={() => setFocused('schedule')}
                    onBlur={() => setFocused('')}
                    className={`w-full border ${focused === 'schedule' ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-3 pl-3 pr-10 transition-all duration-300 bg-gray-50 hover:bg-gray-100 focus:bg-white`}
                  />
                  <Calendar className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${focused === 'schedule' ? 'text-blue-500' : 'text-gray-400'} transition-colors duration-300`} size={18} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <div className="flex space-x-4">
                <button 
                  type="button" 
                  className="border border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:bg-gray-50 font-medium py-3 px-6 rounded-lg transition duration-300 ease-in-out flex items-center"
                  onMouseEnter={() => setHoveredButton('cancel')} 
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  Cancel
                </button>
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
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}