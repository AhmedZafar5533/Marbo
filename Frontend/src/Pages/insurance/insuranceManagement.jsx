import { useState } from 'react';
import { Plus, Search, Edit, Trash2, ChevronDown, ChevronUp, Filter, X, Eye } from 'lucide-react';

export default function InsurancePlanManagement() {
  // Dummy data for insurance plans
  const [plans, setPlans] = useState([
    {
      id: 1,
      name: "Premium Health Coverage",
      type: "Family",
      coverageAmount: "$500,000",
      monthlyPremium: "$450",
      status: "Active",
      enrollees: 125,
      lastUpdated: "Apr 15, 2025",
    },
    {
      id: 2,
      name: "Basic Health Plan",
      type: "Individual",
      coverageAmount: "$250,000",
      monthlyPremium: "$180",
      status: "Active",
      enrollees: 309,
      lastUpdated: "Apr 11, 2025",
    },
    {
      id: 3,
      name: "Senior Care Plus",
      type: "Senior",
      coverageAmount: "$350,000",
      monthlyPremium: "$290",
      status: "Draft",
      enrollees: 0,
      lastUpdated: "Apr 18, 2025",
    },
    {
      id: 4,
      name: "Student Health Essential",
      type: "Individual",
      coverageAmount: "$200,000",
      monthlyPremium: "$125",
      status: "Active",
      enrollees: 217,
      lastUpdated: "Apr 5, 2025",
    },
    {
      id: 5,
      name: "Corporate Group Plan",
      type: "Group",
      coverageAmount: "$450,000",
      monthlyPremium: "$320",
      status: "Under Review",
      enrollees: 0,
      lastUpdated: "Apr 19, 2025",
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewPlan, setViewPlan] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Individual',
    coverageAmount: '',
    monthlyPremium: '',
    status: 'Draft',
    details: ''
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const addNewPlan = () => {
    const newPlan = {
      id: plans.length + 1,
      name: formData.name,
      type: formData.type,
      coverageAmount: formData.coverageAmount.startsWith('$') ? formData.coverageAmount : `$${formData.coverageAmount}`,
      monthlyPremium: formData.monthlyPremium.startsWith('$') ? formData.monthlyPremium : `$${formData.monthlyPremium}`,
      status: formData.status,
      enrollees: 0,
      lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setPlans([...plans, newPlan]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      type: 'Individual',
      coverageAmount: '',
      monthlyPremium: '',
      status: 'Draft',
      details: ''
    });
  };

  const viewPlanDetails = (plan) => {
    setViewPlan(plan);
    setIsViewModalOpen(true);
  };

  const deletePlan = (id) => {
    setPlans(plans.filter(plan => plan.id !== id));
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          plan.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || plan.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedPlans = [...filteredPlans].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Main content */}
      <main className="py-6">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex relative left-50   sm:left-120 md:left-150 lg:left-300 items-center gap-x-2 rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
              >
              <Plus className="h-5 w-5" />
              Add New Plan
            </button>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-1 mt-10 mb-10 gap-9 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white overflow-hidden shadow-md rounded-lg border-b-2 border-red-500 hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-red-100 p-3">
                    <div className="h-8 w-8 text-red-600">📋</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Plans</dt>
                      <dd className="text-2xl font-semibold text-gray-900">{plans.length}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md rounded-lg border-b-2 border-amber-400 hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-amber-100 p-3">
                    <div className="h-8 w-8 text-amber-600">👥</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Enrollees</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {plans.reduce((sum, plan) => sum + plan.enrollees, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md rounded-lg border-b-2 border-green-500 hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                    <div className="h-8 w-8 text-green-600">✓</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Plans</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        {plans.filter(plan => plan.status === 'Active').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow-md rounded-lg border-b-2 border-blue-500 hover:shadow-lg transition-shadow">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                    <div className="h-8 w-8 text-blue-600">💰</div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Premium</dt>
                      <dd className="text-2xl font-semibold text-gray-900">
                        $
                        {Math.round(
                          plans.reduce((sum, plan) => sum + parseInt(plan.monthlyPremium.replace('$', '')), 0) / plans.length
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {['All', 'Active', 'Draft', 'Under Review'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeFilter === status
                        ? 'border-red-500 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Plans table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-medium text-gray-900">Insurance Plans</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {filteredPlans.length} {filteredPlans.length === 1 ? 'plan' : 'plans'} found
                </span>
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Plan Name
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('type')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Type
                        {sortField === 'type' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('coverageAmount')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Coverage
                        {sortField === 'coverageAmount' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('monthlyPremium')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Premium
                        {sortField === 'monthlyPremium' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('status')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Status
                        {sortField === 'status' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('enrollees')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Enrollees
                        {sortField === 'enrollees' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('lastUpdated')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        Last Updated
                        {sortField === 'lastUpdated' && (
                          sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedPlans.length > 0 ? (
                    sortedPlans.map((plan) => (
                      <tr key={plan.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{plan.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{plan.coverageAmount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{plan.monthlyPremium}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            plan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            plan.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.enrollees}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.lastUpdated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => viewPlanDetails(plan)}
                              className="text-gray-600 hover:text-gray-900 bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button 
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 p-1 rounded-full hover:bg-blue-200 transition-colors"
                              title="Edit plan"  
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => deletePlan(plan.id)}
                              className="text-red-600 hover:text-red-900 bg-red-100 p-1 rounded-full hover:bg-red-200 transition-colors"
                              title="Delete plan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                        No plans found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedPlans.length}</span> of{' '}
                    <span className="font-medium">{sortedPlans.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Previous</span>
                      <ChevronUp className="h-5 w-5 rotate-90" />
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Next</span>
                      <ChevronDown className="h-5 w-5 rotate-90" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add plan modal */}
      {isAddModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsAddModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Plus className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Add New Insurance Plan
                    </h3>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Plan Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Enter plan name"
                        />
                      </div>
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Plan Type</label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        >
                          <option>Individual</option>
                          <option>Family</option>
                          <option>Group</option>
                          <option>Senior</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="coverageAmount" className="block text-sm font-medium text-gray-700">Coverage Amount</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              name="coverageAmount"
                              id="coverageAmount"
                              value={formData.coverageAmount}
                              onChange={handleInputChange}
                              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="monthlyPremium" className="block text-sm font-medium text-gray-700">Monthly Premium</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="text"
                              name="monthlyPremium"
                              id="monthlyPremium"
                              value={formData.monthlyPremium}
                              onChange={handleInputChange}
                              className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                        >
                          <option>Draft</option>
                          <option>Under Review</option>
                          <option>Active</option>
                        </select>
                      </div>
                      <div>
                      <label htmlFor="details" className="block text-sm font-medium text-gray-700">Additional Details</label>
                        <textarea
                          id="details"
                          name="details"
                          rows={3}
                          value={formData.details}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                          placeholder="Enter any additional details about the plan"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={addNewPlan}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Plan
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View plan modal */}
      {isViewModalOpen && viewPlan && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setIsViewModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={() => setIsViewModalOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <Eye className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Plan Details
                    </h3>
                    <div className="mt-4">
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
                        <dt className="text-sm font-medium text-gray-500">Plan Name</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.name}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Type</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.type}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
                        <dt className="text-sm font-medium text-gray-500">Coverage Amount</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.coverageAmount}</dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Monthly Premium</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.monthlyPremium}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
                        <dt className="text-sm font-medium text-gray-500">Status</dt>
                        <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            viewPlan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            viewPlan.status === 'Draft' ? 'bg-gray-100 text-gray-800' : 
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {viewPlan.status}
                          </span>
                        </dd>
                      </div>
                      <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Enrollees</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.enrollees}</dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 rounded-md">
                        <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{viewPlan.lastUpdated}</dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}