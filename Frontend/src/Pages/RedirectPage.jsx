
import { UserCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

/* eslint-disable react/no-unescaped-entities */

const RedirectPage = () => {
    return (
        <div className="min-h-screen bg-indigo-50 flex flex-col">
            {/* Header */}
            <header className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <div className="text-indigo-700 font-bold text-2xl tracking-tight"><Link to={"/"}>Logo</Link></div>
                </div>

            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-16">
                <div className="text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Find Your Perfect <span className="text-indigo-700">Marketplace Match</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                        Connect, collaborate, and grow. Whether you're looking to to buy products or offer your services, we've got you covered.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center space-y-6 md:space-y-0 md:space-x-8">
                        {/* Customer Option */}
                        <div className="bg-white shadow-lg rounded-xl p-8 w-full md:w-1/2 ">
                            <div className="flex items-center justify-center mb-6">
                                <UserCheck className="h-16 w-16 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                I'm a Customer
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Hire top-tier professionals, buy products, all in within a few clicks .
                            </p>
                            <Link
                                to={"/signup?role=customer"}
                                className="w-full block text-center bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition-colors"
                            >
                                Start Buying
                            </Link>
                        </div>

                        {/* Vendor Option */}
                        <div className="bg-white shadow-lg rounded-xl p-8 w-full md:w-1/2 ">
                            <div className="flex items-center justify-center mb-6">
                                <Briefcase className="h-16 w-16 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                                I'm a Vendor
                            </h2>
                            <p className="text-gray-600 text-center mb-6">
                                Showcase your services and products, connect globally, and build a thriving career.
                            </p>
                            <Link
                                to={"/signup?role=vendor"}
                                className="w-full block text-center bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 transition-colors"
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