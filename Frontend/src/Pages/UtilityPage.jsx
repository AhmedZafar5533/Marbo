import { useState } from 'react';
import { Search, BookOpen, CreditCard, FileText, ArrowRight, Loader2 } from 'lucide-react';

export default function RegistrationLookup() {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  // Mock student data - in a real app, this would come from an API
  const mockStudent = {
    name: "Alex Johnson",
    course: "Computer Science",
    semester: "Fall 2025",
    registrationNumber: "CS20250089",
    profileImage: "/api/placeholder/150/150",
    dues: [
      { id: 1, title: "Tuition Fee", amount: 2500, dueDate: "2025-06-15", status: "Pending" },
      { id: 2, title: "Library Fee", amount: 150, dueDate: "2025-06-10", status: "Paid" },
      { id: 3, title: "Laboratory Fee", amount: 350, dueDate: "2025-06-20", status: "Pending" },
      { id: 4, title: "Activity Fee", amount: 200, dueDate: "2025-06-15", status: "Pending" }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!registrationNumber.trim()) {
      setError('Please enter a registration number.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call with timeout
    setTimeout(() => {
      if (registrationNumber.toUpperCase() === mockStudent.registrationNumber) {
        setStudent(mockStudent);
        setError('');
      } else {
        setStudent(null);
        setError('No student found with that registration number. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const totalDue = student?.dues.reduce((sum, due) => 
    due.status === "Pending" ? sum + due.amount : sum, 0);

  const totalPaid = student?.dues.reduce((sum, due) => 
    due.status === "Paid" ? sum + due.amount : sum, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}


      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Registration Search Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800">Student Fee Lookup</h2>
              <p className="text-blue-600 text-sm">Enter your registration number to view your dues</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter Registration Number (e.g. CS20250089)"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition-colors duration-200 disabled:bg-blue-400"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      View Fees
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              </form>
              
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          {student && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-blue-600 px-6 py-4 text-white">
                <h2 className="text-xl font-semibold">Student Fee Details</h2>
              </div>
              
              {/* Student Profile */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={student.profileImage} 
                      alt="Student" 
                      className="h-24 w-24 rounded-full object-cover border-4 border-blue-100"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-1">{student.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Registration No.</p>
                        <p className="font-semibold">{student.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Course</p>
                        <p>{student.course}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Semester</p>
                        <p>{student.semester}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fee Summary */}
              <div className="p-6 bg-blue-50 border-b border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-3 rounded-full mr-4">
                        <CreditCard className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Total Due</p>
                        <p className="text-2xl font-bold text-red-600">${totalDue.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-3 rounded-full mr-4">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Already Paid</p>
                        <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Fee Details Table */}
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Fee Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {student.dues.map((fee) => (
                        <tr key={fee.id}>
                          <td className="py-4 px-4 text-sm font-medium text-gray-900">{fee.title}</td>
                          <td className="py-4 px-4 text-sm text-gray-900">${fee.amount.toFixed(2)}</td>
                          <td className="py-4 px-4 text-sm text-gray-500">{fee.dueDate}</td>
                          <td className="py-4 px-4 text-sm">
                            <span 
                              className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                fee.status === "Paid" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {fee.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 text-center">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md">
                    Pay All Pending Fees
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>


    </div>
  );
}