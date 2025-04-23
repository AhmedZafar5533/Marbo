import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, MoreHorizontal, AlertCircle, CheckCircle, Clock, RefreshCw, Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';

export default function PolicyManagement() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('policyNumber');
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policyNumber: '',
    customerName: '',
    plan: '',
    startDate: '',
    endDate: '',
    status: 'active',
    premium: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Simulate API fetch with a delay
    setTimeout(() => {
      const mockPolicies = [
        {
          id: 1,
          policyNumber: 'POL-2025-001',
          customerName: 'John Smith',
          plan: 'Gold Family Plan',
          startDate: '2025-01-15',
          endDate: '2026-01-14',
          status: 'active',
          premium: 450.00,
          lastUpdated: '2025-03-10'
        },
        {
          id: 2,
          policyNumber: 'POL-2025-002',
          customerName: 'Sarah Johnson',
          plan: 'Silver Individual Plan',
          startDate: '2025-02-01',
          endDate: '2026-01-31',
          status: 'pending-renewal',
          premium: 225.50,
          lastUpdated: '2025-04-15'
        },
        {
          id: 3,
          policyNumber: 'POL-2024-125',
          customerName: 'Miguel Rodriguez',
          plan: 'Bronze Family Plan',
          startDate: '2024-06-10',
          endDate: '2025-06-09',
          status: 'renewal-processing',
          premium: 320.75,
          lastUpdated: '2025-04-05'
        },
        {
          id: 4,
          policyNumber: 'POL-2025-003',
          customerName: 'Emily Chen',
          plan: 'Platinum Individual Plan',
          startDate: '2025-03-01',
          endDate: '2026-02-28',
          status: 'active',
          premium: 510.25,
          lastUpdated: '2025-03-01'
        },
        {
          id: 5,
          policyNumber: 'POL-2024-095',
          customerName: 'David Wilson',
          plan: 'Gold Individual Plan',
          startDate: '2024-12-15',
          endDate: '2025-12-14',
          status: 'expired',
          premium: 380.00,
          lastUpdated: '2025-02-14'
        },
        {
          id: 6,
          policyNumber: 'POL-2024-098',
          customerName: 'Lisa Brown',
          plan: 'Silver Family Plan',
          startDate: '2024-12-20',
          endDate: '2025-12-19',
          status: 'active',
          premium: 410.50,
          lastUpdated: '2025-03-20'
        }
      ];
      setPolicies(mockPolicies);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredPolicies = policies
    .filter(policy => {
      const matchesSearch = policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            policy.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || policy.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>;
      case 'pending-renewal':
        return <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pending Renewal</span>;
      case 'renewal-processing':
        return <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1" /> Processing</span>;
      case 'expired':
        return <span className="flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" /> Expired</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const openPolicyDrawer = (policy) => {
    setSelectedPolicy(policy);
    setIsDrawerOpen(true);
  };

  const closePolicyDrawer = () => {
    setIsDrawerOpen(false);
    // Optional: Add a small delay before removing the policy data to ensure smooth transition
    setTimeout(() => {
      if (!isDrawerOpen) {
        setSelectedPolicy(null);
      }
    }, 300);
  };

  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    // Reset form
    setNewPolicy({
      policyNumber: '',
      customerName: '',
      plan: '',
      startDate: '',
      endDate: '',
      status: 'active',
      premium: '',
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPolicy({
      ...newPolicy,
      [name]: value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const today = new Date().toISOString().split('T')[0];
    
    if (!newPolicy.policyNumber) {
      errors.policyNumber = 'Policy number is required';
    } else if (!/^POL-\d{4}-\d{3}$/.test(newPolicy.policyNumber)) {
      errors.policyNumber = 'Policy number must be in format POL-YYYY-###';
    }
    
    if (!newPolicy.customerName) {
      errors.customerName = 'Customer name is required';
    }
    
    if (!newPolicy.plan) {
      errors.plan = 'Plan is required';
    }
    
    if (!newPolicy.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!newPolicy.endDate) {
      errors.endDate = 'End date is required';
    } else if (newPolicy.startDate && newPolicy.endDate <= newPolicy.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!newPolicy.premium) {
      errors.premium = 'Premium is required';
    } else if (isNaN(parseFloat(newPolicy.premium)) || parseFloat(newPolicy.premium) <= 0) {
      errors.premium = 'Premium must be a positive number';
    }
    
    return errors;
  };

  const handleAddPolicy = () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Create new policy with unique ID and current date as lastUpdated
    const newPolicyData = {
      ...newPolicy,
      id: policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1,
      premium: parseFloat(newPolicy.premium),
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    
    // Add new policy to the list
    setPolicies([...policies, newPolicyData]);
    
    // Close the modal and reset form
    closeAddModal();
    
    // Show success notification (this is just a placeholder - you might want to implement a proper notification system)
    alert(`Policy ${newPolicyData.policyNumber} has been added successfully!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#071E22] to-[#121212] shadow-lg">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Policy Management</h1>
            <button 
              className="px-4 py-2 text-white bg-[#ED6A5A] rounded-md hover:bg-[#EC5F4F] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#ED6A5A] focus:ring-offset-2 flex items-center"
              onClick={openAddModal}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Policy
            </button>
          </div>
        </div>
      </header>

      {/* Main content - always visible */}
      <main className={`flex-1 px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 ${isDrawerOpen ? 'lg:pr-96' : ''} transition-all duration-300`}>
        {/* Filters and search */}
        <div className="flex flex-col mb-6 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search policies..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] transition duration-150 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] transition duration-150 sm:text-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending-renewal">Pending Renewal</option>
                <option value="renewal-processing">Renewal Processing</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {filteredPolicies.length} {filteredPolicies.length === 1 ? 'policy' : 'policies'} found
            </span>
          </div>
        </div>

        {/* Policy table */}
        <div className="overflow-hidden bg-white shadow-md rounded-lg border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-12 h-12 border-4 border-t-[#ED6A5A] border-gray-200 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#071E22] text-white">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('policyNumber')}
                    >
                      <div className="flex items-center">
                        Policy Number
                        {sortField === 'policyNumber' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('customerName')}
                    >
                      <div className="flex items-center">
                        Customer
                        {sortField === 'customerName' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('plan')}
                    >
                      <div className="flex items-center">
                        Plan
                        {sortField === 'plan' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('endDate')}
                    >
                      <div className="flex items-center">
                        Expiry Date
                        {sortField === 'endDate' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase cursor-pointer transition duration-150 hover:bg-opacity-90"
                      onClick={() => handleSort('premium')}
                    >
                      <div className="flex items-center justify-end">
                        Premium
                        {sortField === 'premium' && (
                          sortDirection === 'asc' ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPolicies.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-sm text-center text-gray-500">
                        No policies found matching your search criteria
                      </td>
                    </tr>
                  ) : (
                    filteredPolicies.map((policy) => (
                      <tr 
                        key={policy.id} 
                        className={`transition duration-150 hover:bg-gray-50 cursor-pointer ${selectedPolicy && selectedPolicy.id === policy.id ? 'bg-gray-100' : ''}`}
                        onClick={() => openPolicyDrawer(policy)}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-[#071E22] whitespace-nowrap">
                          {policy.policyNumber}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {policy.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {policy.plan}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {new Date(policy.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                          {getStatusBadge(policy.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-700 whitespace-nowrap">
                          ${policy.premium.toFixed(2)}/month
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                          <button className="inline-flex items-center justify-center w-8 h-8 text-gray-400 rounded-full hover:bg-[#ED6A5A] hover:text-white transition duration-200 focus:outline-none">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between my-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredPolicies.length}</span> of{' '}
                <span className="font-medium">{filteredPolicies.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 transition duration-150">
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#ED6A5A] border border-[#ED6A5A] hover:bg-[#EC5F4F] transition duration-150">
                  1
                </button>
                <button className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 transition duration-150">
                  <span className="sr-only">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>

      {/* Policy Detail Drawer - fixed positioned on the right */}
      {selectedPolicy && (
        <div className={`fixed inset-y-0 right-0 z-40 overflow-hidden lg:pl-10 ${isDrawerOpen ? 'block' : 'hidden'}`}>
          <div className={`w-screen max-w-md transform transition-all duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full overflow-y-auto bg-white shadow-xl">
              <div className="bg-gradient-to-r from-[#071E22] to-[#121212] px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-white">Policy Details</h2>
                  <div className="flex items-center ml-3 h-7">
                    <button
                      onClick={closePolicyDrawer}
                      className="p-2 -m-2 text-white hover:text-[#ED6A5A] transition duration-150"
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 px-4 py-6 overflow-y-auto sm:px-6">
                <div className="flow-root">
                  <div className="pb-6 border-b border-gray-200">
                    <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Policy Information</h3>
                    <div className="mt-4 space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Policy Number</p>
                        <p className="text-sm font-medium text-[#071E22]">{selectedPolicy.policyNumber}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Status</p>
                        <div className="mt-1">{getStatusBadge(selectedPolicy.status)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm font-medium text-[#071E22]">{new Date(selectedPolicy.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm font-medium text-[#071E22]">{new Date(selectedPolicy.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="text-sm font-medium text-[#071E22]">{new Date(selectedPolicy.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-6 border-b border-gray-200">
                    <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Customer Information</h3>
                    <div className="mt-4 space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-[#071E22]">{selectedPolicy.customerName}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-[#071E22]">customer@example.com</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-[#071E22]">(555) 123-4567</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-6 border-b border-gray-200">
                    <h3 className="text-xs font-medium tracking-wider text-gray-500 uppercase">Plan Details</h3>
                    <div className="mt-4 space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Plan</p>
                        <p className="text-sm font-medium text-[#071E22]">{selectedPolicy.plan}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Monthly Premium</p>
                        <p className="text-sm font-medium text-[#071E22]">${selectedPolicy.premium.toFixed(2)}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Coverage Limit</p>
                        <p className="text-sm font-medium text-[#071E22]">$1,000,000</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500">Deductible</p>
                        <p className="text-sm font-medium text-[#071E22]">$1,500</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-shrink-0 justify-between px-4 py-4 border-t border-gray-200 sm:px-6">
                {selectedPolicy.status === 'pending-renewal' && (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#121212] border border-transparent rounded-md hover:bg-[#071E22] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#071E22]"
                    >
                      Decline Renewal
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#ED6A5A] border border-transparent rounded-md shadow-sm hover:bg-[#EC5F4F] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
                    >
                      Process Renewal
                    </button>
                  </>
                )}
                {selectedPolicy.status === 'active' && (
                  <>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#121212] border border-transparent rounded-md hover:bg-[#071E22] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#071E22]"
                    >
                      Edit Policy
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-[#ED6A5A] border border-transparent rounded-md shadow-sm hover:bg-[#EC5F4F] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]">
                      Submit Claim
                    </button>
                  </>
                )}
                {selectedPolicy.status === 'expired' && (
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#ED6A5A] border border-transparent rounded-md shadow-sm hover:bg-[#EC5F4F] transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
                  >
                    Renew Policy
                  </button>
                )}
                {selectedPolicy.status === 'renewal-processing' && (
                  <button
                    type="button"
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-transparent rounded-md shadow-sm hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    View Renewal Status
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Policy Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A]"
                  onClick={closeAddModal}
                >
                  <span className="sr-only">Close</span>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div>
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Policy</h3>
                  <p className="mt-1 text-sm text-gray-500">Please fill in the policy details below.</p>
                </div>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">Policy Number</label>
                    <input
                      type="text"
                      name="policyNumber"
                      id="policyNumber"
                      className={`mt-1 block w-full border ${formErrors.policyNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                      placeholder="POL-2025-XXX"
                      value={newPolicy.policyNumber}
                      onChange={handleInputChange}
                    />
                    {formErrors.policyNumber && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.policyNumber}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">Format: POL-YYYY-###</p>
                  </div>

                  <div>
                    <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">Customer Name</label>
                    <input
                      type="text"
                      name="customerName"
                      id="customerName"
                      className={`mt-1 block w-full border ${formErrors.customerName ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                      placeholder="Full Name"
                      value={newPolicy.customerName}
                      onChange={handleInputChange}
                    />
                    {formErrors.customerName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="plan" className="block text-sm font-medium text-gray-700">Plan</label>
                    <select
                      name="plan"
                      id="plan"
                      className={`mt-1 block w-full border ${formErrors.plan ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                      value={newPolicy.plan}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a plan</option>
                      <option value="Bronze Individual Plan">Bronze Individual Plan</option>
                      <option value="Bronze Family Plan">Bronze Family Plan</option>
                      <option value="Silver Individual Plan">Silver Individual Plan</option>
                      <option value="Silver Family Plan">Silver Family Plan</option>
                      <option value="Gold Individual Plan">Gold Individual Plan</option>
                      <option value="Gold Family Plan">Gold Family Plan</option>
                      <option value="Platinum Individual Plan">Platinum Individual Plan</option>
                      <option value="Platinum Family Plan">Platinum Family Plan</option>
                    </select>
                    {formErrors.plan && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.plan}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        className={`mt-1 block w-full border ${formErrors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                        value={newPolicy.startDate}
                        onChange={handleInputChange}
                      />
                      {formErrors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.startDate}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        className={`mt-1 block w-full border ${formErrors.endDate ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                        value={newPolicy.endDate}
                        onChange={handleInputChange}
                      />
                      {formErrors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.endDate}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      name="status"
                      id="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm"
                      value={newPolicy.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="pending-renewal">Pending Renewal</option>
                      <option value="renewal-processing">Renewal Processing</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="premium" className="block text-sm font-medium text-gray-700">Monthly Premium ($)</label>
                    <input
                      type="number"
                      name="premium"
                      id="premium"
                      step="0.01"
                      min="0"
                      className={`mt-1 block w-full border ${formErrors.premium ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#ED6A5A] focus:border-[#ED6A5A] sm:text-sm`}
                      placeholder="0.00"
                      value={newPolicy.premium}
                      onChange={handleInputChange}
                    />
                    {formErrors.premium && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.premium}</p>
                    )}
                  </div>
                </form>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#ED6A5A] text-base font-medium text-white hover:bg-[#EC5F4F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] sm:col-start-2 sm:text-sm transition duration-200"
                  onClick={handleAddPolicy}
                >
                  Add Policy
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED6A5A] sm:mt-0 sm:col-start-1 sm:text-sm transition duration-200"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}