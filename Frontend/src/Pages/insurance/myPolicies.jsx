import { useState } from 'react';
import { 
  Filter, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Plus, 
  Download,
  Search,
  Calendar,
  Shield,
  Users,
  AlertCircle,
  Tag
} from 'lucide-react';

export default function InsuranceDashboardContent() {
  const [activeTab, setActiveTab] = useState('policies');
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const policies = [
    {
      id: 1,
      type: 'Health Insurance',
      plan: 'Premium Family Plan',
      policyNumber: 'HL-2023-78945',
      status: 'Active',
      startDate: '01/15/2025',
      endDate: '01/14/2026',
      premium: '$350.00',
      paymentFrequency: 'Monthly',
      members: ['John Doe (Primary)', 'Jane Doe', 'Alex Doe'],
      coverageDetails: [
        { name: 'Annual Deductible', value: '$1,500' },
        { name: 'Out-of-pocket Maximum', value: '$5,000' },
        { name: 'Primary Care Visit', value: '$25 copay' },
        { name: 'Specialist Visit', value: '$50 copay' },
        { name: 'Emergency Room', value: '$250 copay' },
      ]
    },
    {
      id: 2,
      type: 'Dental Insurance',
      plan: 'Complete Dental Care',
      policyNumber: 'DL-2023-54321',
      status: 'Active',
      startDate: '01/15/2025',
      endDate: '01/14/2026',
      premium: '$75.00',
      paymentFrequency: 'Monthly',
      members: ['John Doe (Primary)', 'Jane Doe', 'Alex Doe'],
      coverageDetails: [
        { name: 'Annual Maximum', value: '$2,000' },
        { name: 'Preventive Care', value: 'Covered 100%' },
        { name: 'Basic Services', value: 'Covered 80%' },
        { name: 'Major Services', value: 'Covered 50%' },
        { name: 'Orthodontia', value: 'Covered 50% (up to $1,500)' },
      ]
    },
    {
      id: 3,
      type: 'Vision Insurance',
      plan: 'Clear Vision Plus',
      policyNumber: 'VI-2023-12345',
      status: 'Active',
      startDate: '01/15/2025',
      endDate: '01/14/2026',
      premium: '$25.00',
      paymentFrequency: 'Monthly',
      members: ['John Doe (Primary)', 'Jane Doe', 'Alex Doe'],
      coverageDetails: [
        { name: 'Eye Exam', value: '$10 copay' },
        { name: 'Frames', value: '$150 allowance' },
        { name: 'Lenses', value: 'Covered 100%' },
        { name: 'Contact Lenses', value: '$150 allowance' },
        { name: 'LASIK', value: '15% discount' },
      ]
    }
  ];

  const claims = [
    {
      id: 101,
      policyNumber: 'HL-2023-78945',
      type: 'Health',
      service: 'Annual Physical',
      provider: 'Dr. Smith Medical Center',
      date: '03/15/2025',
      amount: '$450.00',
      status: 'Approved',
      reimbursement: '$405.00',
      paymentDate: '03/28/2025'
    },
    {
      id: 102,
      policyNumber: 'DL-2023-54321',
      type: 'Dental',
      service: 'Routine Cleaning',
      provider: 'Bright Smile Dental',
      date: '02/12/2025',
      amount: '$120.00',
      status: 'Processing',
      reimbursement: 'Pending',
      paymentDate: 'Pending'
    },
    {
      id: 103,
      policyNumber: 'HL-2023-78945',
      type: 'Health',
      service: 'Urgent Care Visit',
      provider: 'Quick Care Clinic',
      date: '04/02/2025',
      amount: '$225.00',
      status: 'Submitted',
      reimbursement: 'Pending',
      paymentDate: 'Pending'
    }
  ];

  const togglePolicyExpansion = (id) => {
    if (expandedPolicy === id) {
      setExpandedPolicy(null);
    } else {
      setExpandedPolicy(id);
    }
  };

  const filteredPolicies = policies.filter(policy => 
    policy.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClaims = claims.filter(claim => 
    claim.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    claim.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon based on policy type
  const getPolicyIcon = (type) => {
    if (type.includes('Health')) return <Shield className="text-[#ED6A5A]" size={24} />;
    if (type.includes('Dental')) return <Tag className="text-green-500" size={24} />;
    if (type.includes('Vision')) return <AlertCircle className="text-purple-500" size={24} />;
    return <Shield className="text-gray-500" size={24} />;
  };

  return (
    <div className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      {/* Search Bar */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search policies or claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A] focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex space-x-2 bg-white rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'policies'
                ? 'bg-[#ED6A5A] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            My Policies
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'claims'
                ? 'bg-[#ED6A5A] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Claims History
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {activeTab === 'policies' ? (
          <div>
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-4 rounded-xl shadow-sm">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[#ED6A5A] text-white mr-4">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-[#071E22]">Your Coverage Summary</h3>
                  <p className="text-sm text-[#071E22]">You have {filteredPolicies.length} active insurance policies covering {policies[0].members.length} family members.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Active Policies</h2>
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] transition-all duration-200">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPolicies.map((policy) => (
                <div 
                  key={policy.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => togglePolicyExpansion(policy.id)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {getPolicyIcon(policy.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center">
                              <h3 className="text-lg font-semibold text-gray-900">{policy.plan}</h3>
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {policy.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{policy.type} • Policy #{policy.policyNumber}</p>
                          </div>
                          <div className="flex items-center">
                            <div className="text-right mr-4">
                              <p className="text-lg font-bold text-[#071E22]">{policy.premium}</p>
                              <p className="text-xs text-gray-500">{policy.paymentFrequency}</p>
                            </div>
                            <button 
                              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                expandedPolicy === policy.id ? 'bg-blue-100 text-[#071E22]' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                            >
                              {expandedPolicy === policy.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {expandedPolicy === policy.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-4">
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <div className="mb-6">
                            <h4 className="flex items-center text-sm font-medium text-gray-500 mb-3">
                              <Calendar size={16} className="mr-2 text-[#ED6A5A]" />
                              Policy Timeline
                            </h4>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-gray-500">Start Date</p>
                                  <p className="font-medium">{policy.startDate}</p>
                                </div>
                                <div className="flex-1 mx-4 h-1 bg-blue-100 rounded-full">
                                  <div className="h-1 bg-[#ED6A5A] rounded-full w-1/3"></div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-gray-500">End Date</p>
                                  <p className="font-medium">{policy.endDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="flex items-center text-sm font-medium text-gray-500 mb-3">
                              <Users size={16} className="mr-2 text-[#ED6A5A]" />
                              Covered Members
                            </h4>
                            <div className="bg-white rounded-lg p-3 shadow-sm">
                              <ul className="space-y-2">
                                {policy.members.map((member, index) => (
                                  <li key={index} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-gray-50">
                                    <span className="text-sm text-gray-700">{member}</span>
                                    {index === 0 && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-[#071E22]">
                                        Primary
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="flex items-center text-sm font-medium text-gray-500 mb-3">
                            <Shield size={16} className="mr-2 text-[#ED6A5A]" />
                            Coverage Details
                          </h4>
                          <div className="bg-white rounded-lg p-3 shadow-sm">
                            <ul className="divide-y divide-gray-100">
                              {policy.coverageDetails.map((detail, index) => (
                                <li key={index} className="py-2 px-1 flex justify-between items-center">
                                  <span className="text-sm text-gray-600">{detail.name}</span>
                                  <span className="text-sm font-medium text-gray-900 bg-blue-50 px-2 py-1 rounded">{detail.value}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex flex-wrap gap-3">
                          <button className="inline-flex items-center px-4 py-2 border border-[#ED6A5A] rounded-lg text-sm font-medium text-[#071E22] bg-white hover:bg-blue-50 transition-colors duration-200">
                            <FileText size={16} className="mr-2" />
                            View Policy Document
                          </button>
                          <button className="inline-flex items-center px-4 py-2 border border-[#ED6A5A] rounded-lg text-sm font-medium text-[#071E22] bg-white hover:bg-blue-50 transition-colors duration-200">
                            <Download size={16} className="mr-2" />
                            Download ID Cards
                          </button>
                          <button className="inline-flex items-center px-4 py-2 bg-[#ED6A5A] border border-transparent rounded-lg text-sm font-medium text-white hover:bg-[#071E22] transition-colors duration-200">
                            <Plus size={16} className="mr-2" />
                            File a New Claim
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Claims History</h2>
              <button className="inline-flex items-center px-4 py-2 bg-[#ED6A5A] border border-transparent rounded-lg text-sm font-medium text-white hover:bg-[#071E22] transition-colors duration-200">
                <Plus size={16} className="mr-2" />
                File New Claim
              </button>
            </div>

            {/* Claims Cards (more modern than a table) */}
            <div className="space-y-4">
              {filteredClaims.map((claim) => (
                <div key={claim.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className={`w-2 h-10 rounded-sm mr-3 ${
                          claim.status === 'Approved' ? 'bg-green-500' : 
                          claim.status === 'Processing' ? 'bg-yellow-500' : 
                          'bg-[#ED6A5A]'
                        }`}></div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{claim.service}</h3>
                          <p className="text-sm text-gray-500">{claim.provider}</p>
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${claim.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                            claim.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-blue-100 text-[#071E22]'}`}>
                          {claim.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-2">
                      <div>
                        <p className="text-xs text-gray-500">Date of Service</p>
                        <p className="text-sm font-medium">{claim.date}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Claim Amount</p>
                        <p className="text-sm font-medium">{claim.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reimbursement</p>
                        <p className="text-sm font-medium">{claim.reimbursement}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-xs text-gray-500">Policy #{claim.policyNumber}</p>
                      <button className="text-sm text-[#071E22] hover:text-[#071E22] font-medium">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}