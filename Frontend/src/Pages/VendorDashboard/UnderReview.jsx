import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnderReviewPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="flex flex-col items-center text-center p-8">
                    <div className="mb-6">
                        <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
                            <Clock className="w-12 h-12 text-indigo-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Submission Is Under Review</h1>
                    <p className="text-gray-600 mb-6">
                        Thank you for completing your profile. Our team is reviewing your data. You’ll be notified once everything is approved.
                    </p>

                    <Link to={'/'}>
                        <button className="py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 flex items-center justify-center">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Return to Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UnderReviewPage;
