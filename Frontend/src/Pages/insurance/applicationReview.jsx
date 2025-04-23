import { useState } from "react";
import { 
  Search, 
  Filter, 
  User, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Flag, 
  Eye,
  FileText,
  MoreHorizontal,
  Shield
} from "lucide-react";

export default function InsuranceApplicationReview() {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedApplicationType, setSelectedApplicationType] = useState("all");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  
  const toggleApplicationDetails = (id) => {
    if (expandedApplication === id) {
      setExpandedApplication(null);
    } else {
      setExpandedApplication(id);
    }
  };
  
  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  const displayToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleApprove = (id) => {
    displayToast(`Application #${id} approved successfully`, "success");
  };

  const handleReject = (id) => {
    displayToast(`Application #${id} rejected`, "error");
  };
  
  // Mock data for applications
  const applications = {
    pending: [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(555) 123-4567",
        type: "Auto Insurance",
        submittedDate: "Apr 18, 2025",
        riskLevel: "medium",
        coverageAmount: "$500,000",
        status: "pending",
        flagged: false,
        notes: "Applicant has a clean driving record but lives in a high-risk area."
      },
      {
        id: 2,
        name: "Michael Chen",
        email: "mchen@example.com",
        phone: "(555) 987-6543",
        type: "Home Insurance",
        submittedDate: "Apr 17, 2025",
        riskLevel: "low",
        coverageAmount: "$750,000",
        status: "pending",
        flagged: false,
        notes: "Property is in good condition with updated security systems."
      },
      {
        id: 3,
        name: "David Rodriguez",
        email: "drodriguez@example.com",
        phone: "(555) 234-5678",
        type: "Life Insurance",
        submittedDate: "Apr 16, 2025",
        riskLevel: "high",
        coverageAmount: "$1,000,000",
        status: "pending",
        flagged: true,
        notes: "Medical history requires additional review. Flagged for medical underwriting."
      }
    ],
    approved: [
      {
        id: 4,
        name: "Emma Wilson",
        email: "ewilson@example.com",
        phone: "(555) 345-6789",
        type: "Auto Insurance",
        submittedDate: "Apr 15, 2025",
        approvedDate: "Apr 17, 2025",
        riskLevel: "low",
        coverageAmount: "$300,000",
        status: "approved",
        flagged: false,
        notes: "Perfect driving record and premium vehicle safety features."
      },
      {
        id: 5,
        name: "James Taylor",
        email: "jtaylor@example.com",
        phone: "(555) 456-7890",
        type: "Home Insurance",
        submittedDate: "Apr 14, 2025",
        approvedDate: "Apr 16, 2025",
        riskLevel: "medium",
        coverageAmount: "$650,000",
        status: "approved",
        flagged: false,
        notes: "Property in flood zone but has taken appropriate mitigation measures."
      }
    ],
    rejected: [
      {
        id: 6,
        name: "Olivia Martinez",
        email: "omartinez@example.com",
        phone: "(555) 567-8901",
        type: "Life Insurance",
        submittedDate: "Apr 13, 2025",
        rejectedDate: "Apr 16, 2025",
        riskLevel: "high",
        coverageAmount: "$2,000,000",
        status: "rejected",
        rejectionReason: "Medical history shows multiple high-risk conditions",
        flagged: true,
        notes: "Suggest reapplication with lower coverage amount and higher premium."
      }
    ]
  };
  
  const getStatusBadgeClasses = (status) => {
    switch(status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-teal-100 text-teal-800";
      case "rejected":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getRiskBadgeClasses = (risk) => {
    switch(risk) {
      case "low":
        return "bg-teal-100 text-teal-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "high":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "approved":
        return <CheckCircle className="h-4 w-4 text-teal-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };
  
  // Filter applications based on selected criteria
  const filteredApplications = applications[selectedTab].filter(app => {
    let matchesRiskLevel = selectedRiskLevel === "all" || app.riskLevel === selectedRiskLevel;
    let matchesType = selectedApplicationType === "all" || app.type.toLowerCase().includes(selectedApplicationType.toLowerCase());
    // For dateRange we would normally implement actual date filtering
    // This is simplified for the example
    return matchesRiskLevel && matchesType;
  });
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center z-50 ${
          toastType === "success" ? "bg-teal-500 text-white" : 
          toastType === "error" ? "bg-rose-500 text-white" : 
          "bg-amber-500 text-white"
        }`}>
          {toastType === "success" ? <CheckCircle className="h-5 w-5 mr-2" /> : 
           toastType === "error" ? <XCircle className="h-5 w-5 mr-2" /> : 
           <AlertTriangle className="h-5 w-5 mr-2" />}
          <span>{toastMessage}</span>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insurance Applications</h1>
            <p className="text-gray-600">Review and manage insurance applications</p>
          </div>
          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-[#EC5F4F] focus:border-[#EC5F4F] w-64 shadow-sm"
              />
            </div>
            <button 
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm"
              onClick={toggleFilter}
            >
              <Filter className="h-5 w-5 text-[#EC5F4F] mr-2" />
              <span>Filters</span>
              {filterOpen ? 
                <ChevronUp className="h-4 w-4 text-gray-500 ml-2" /> : 
                <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
              }
            </button>
          </div>
        </div>
        
        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-2 focus:ring-[#EC5F4F] focus:border-[#EC5F4F]"
                  value={selectedRiskLevel}
                  onChange={(e) => setSelectedRiskLevel(e.target.value)}
                >
                  <option value="all">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-2 focus:ring-[#EC5F4F] focus:border-[#EC5F4F]"
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                >
                  <option value="all">All Dates</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Type</label>
                <select 
                  className="w-full border border-gray-200 rounded-lg p-2 focus:ring-[#EC5F4F] focus:border-[#EC5F4F]"
                  value={selectedApplicationType}
                  onChange={(e) => setSelectedApplicationType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="health">Health Insurance</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 mr-2">
                Reset
              </button>
              <button className="px-4 py-2 bg-[#EC5F4F] text-white rounded-lg hover:bg-[#EC5F4F]">
                Apply Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              selectedTab === "pending" ? "border-b-2 border-[#EC5F4F] text-[#EC5F4F]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedTab("pending")}
          >
            Pending Review ({applications.pending.length})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              selectedTab === "approved" ? "border-b-2 border-[#EC5F4F] text-[#EC5F4F]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedTab("approved")}
          >
            Approved ({applications.approved.length})
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              selectedTab === "rejected" ? "border-b-2 border-[#EC5F4F] text-[#EC5F4F]" : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setSelectedTab("rejected")}
          >
            Rejected ({applications.rejected.length})
          </button>
        </div>
        
        {/* Application List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Insurance Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submission Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <>
                    <tr 
                      key={application.id} 
                      className={`hover:bg-gray-50 ${expandedApplication === application.id ? 'bg-grey-500' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-[#EC5F4F] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900">{application.name}</div>
                              {application.flagged && (
                                <Flag className="h-4 w-4 text-rose-500 ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500">{application.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.type}</div>
                        <div className="text-sm text-gray-500">Coverage: {application.coverageAmount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {application.submittedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskBadgeClasses(application.riskLevel)}`}>
                          {application.riskLevel.charAt(0).toUpperCase() + application.riskLevel.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(application.status)}`}>
                          <span className="flex items-center">
                            {getStatusIcon(application.status)}
                            <span className="ml-1">
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            className="text-grey-500 hover:text-grey-500"
                            onClick={() => toggleApplicationDetails(application.id)}
                          >
                            {expandedApplication === application.id ? 
                              <ChevronUp className="h-5 w-5" /> : 
                              <ChevronDown className="h-5 w-5" />
                            }
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <MoreHorizontal className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded Application Details */}
                    {expandedApplication === application.id && (
                      <tr>
                        <td colSpan="6" className="bg-gray-50 px-6 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-md font-medium text-gray-900 mb-3">Applicant Details</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Full Name:</span>
                                  <span className="text-sm text-gray-900">{application.name}</span>
                                </div>
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Email:</span>
                                  <span className="text-sm text-gray-900">{application.email}</span>
                                </div>
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Phone:</span>
                                  <span className="text-sm text-gray-900">{application.phone}</span>
                                </div>
                              </div>
                              
                              <h3 className="text-md font-medium text-gray-900 mt-4 mb-3">Application Notes</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="text-sm text-gray-700">{application.notes}</p>
                              </div>
                              
                              {application.status === "rejected" && (
                                <div className="mt-4">
                                  <h3 className="text-md font-medium text-rose-600 mb-3">Rejection Reason</h3>
                                  <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                                    <p className="text-sm text-rose-700">{application.rejectionReason}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-md font-medium text-gray-900 mb-3">Policy Details</h3>
                              <div className="bg-white p-4 rounded-lg shadow-sm space-y-2">
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Insurance Type:</span>
                                  <span className="text-sm text-gray-900">{application.type}</span>
                                </div>
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Coverage Amount:</span>
                                  <span className="text-sm text-gray-900">{application.coverageAmount}</span>
                                </div>
                                <div className="flex">
                                  <span className="text-sm font-medium text-gray-500 w-32">Submitted Date:</span>
                                  <span className="text-sm text-gray-900">{application.submittedDate}</span>
                                </div>
                                {application.approvedDate && (
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-500 w-32">Approved Date:</span>
                                    <span className="text-sm text-teal-600">{application.approvedDate}</span>
                                  </div>
                                )}
                                {application.rejectedDate && (
                                  <div className="flex">
                                    <span className="text-sm font-medium text-gray-500 w-32">Rejected Date:</span>
                                    <span className="text-sm text-rose-600">{application.rejectedDate}</span>
                                  </div>
                                )}
                              </div>
                              
                              {application.status === "pending" && (
                                <div className="mt-6 flex space-x-3">
                                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 mr-2" />
                                      View Documents
                                    </div>
                                  </button>
                                  <button 
                                    onClick={() => handleApprove(application.id)}
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                                  >
                                    <div className="flex items-center">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve
                                    </div>
                                  </button>
                                  <button 
                                    onClick={() => handleReject(application.id)} 
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
                                  >
                                    <div className="flex items-center">
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle className="h-10 w-10 text-amber-400 mb-2" />
                      <h3 className="text-md font-medium text-gray-900">No applications found</h3>
                      <p className="text-sm text-gray-500 mt-1">Try adjusting your filters or search terms</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-5 bg-white p-3 rounded-lg shadow-sm">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredApplications.length}</span> of <span className="font-medium">{applications[selectedTab].length}</span> results
          </div>
          <div className="flex space-x-1">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              1
            </button>
            <button className="px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-[#EC5F4F]">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}