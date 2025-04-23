import { UserCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

/* eslint-disable react/no-unescaped-entities */

const RedirectPage = () => {
    return (
        <div className="min-h-screen bg-red-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center">

            <div className="flex-shrink-0">
              <a
                href="/"
                aria-label="Go to homepage"
                className="flex items-center space-x-3 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 group"
              >
                {/* Logo icon */}
                <div
                  className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110"
                >
                  <span className="text-white font-extrabold text-2xl">M</span>
                  {/* subtle ring on hover */}
                  <span className="absolute inset-0 rounded-full ring-2 ring-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                </div>

                {/* Brand name */}
                <span className="text-2xl font-extrabold text-gray-900 transition-colors group-hover:text-red-600">
                  Marbo Global
                </span>
              </a>
            </div>


          
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Find Your Perfect <span className="text-red-600">Marketplace Match</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Connect, collaborate, and grow. Whether you're looking to buy products or offer your services, we've got you covered.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Customer Option */}
                        <div className="bg-white shadow-lg rounded-xl p-8 w-full md:w-1/2">
                            <div className="flex items-center justify-center mb-6">
                                <UserCheck className="h-16 w-16 text-red-500 group-hover:text-red-600 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                I'm a Customer
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Hire top-tier professionals, buy products, all within a few clicks.
                            </p>
                            <Link
                                to={"/signup?role=customer"}
                                className="w-full block text-center bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-md"
                            >
                                Start Buying
                            </Link>
                        </div>

                        {/* Vendor Option */}
                        <div className="bg-white shadow-lg rounded-xl p-8 w-full md:w-1/2">
                            <div className="flex items-center justify-center mb-6">
                                <Briefcase className="h-16 w-16 text-red-500 group-hover:text-red-600 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                I'm a Vendor
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Showcase your services and products, connect globally, and build a thriving career.
                            </p>
                            <Link
                                to={"/signup?role=vendor"}
                                className="w-full block text-center bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors shadow-md"
                            >
                                Start Selling
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RedirectPage;
