import React from 'react';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
            <div className="max-w-3xl w-full">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                        {/* Illustration Side */}
                        <div className="w-full md:w-1/2 bg-indigo-600 p-8 flex items-center justify-center">
                            <div className="text-center">
                                <div className="relative">
                                    <div className="text-9xl font-bold text-white opacity-20">404</div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="space-y-4">
                                            <div className="flex justify-center">
                                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                                                    <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <h2 className="text-xl text-white font-semibold">Page not found</h2>
                                        </div>
                                    </div>
                                </div>

                                {/* Abstract shapes for decoration */}
                                <div className="absolute top-20 left-20 w-16 h-16 rounded-full bg-purple-500 opacity-20"></div>
                                <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-indigo-300 opacity-20"></div>
                                <div className="absolute top-40 right-40 w-12 h-12 rounded-full bg-pink-500 opacity-10"></div>
                            </div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-8 md:p-12">
                            <div className="space-y-6">
                                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Oops! Looks like you're lost</h1>
                                <p className="text-lg text-gray-600">
                                    The page you're looking for doesn't exist or has been moved to another location.
                                </p>
                                <div className="space-y-3">
                                    <button
                                        className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        onClick={() => window.location.href = '/'}
                                    >
                                        <ArrowLeft className="mr-2 h-5 w-5" />
                                        Return to Home
                                    </button>
                                    <p className="text-sm text-gray-500 pt-4">
                                        If you believe this is a mistake, please contact our support team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-gray-600 text-sm">
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;