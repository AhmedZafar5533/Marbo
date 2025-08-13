// Pages/SuccessPage.js
import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <CheckCircle className="text-red-600 w-12 h-12" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Successful!</h1>
        <p className="text-gray-700 mb-6">
          Thank you for your purchase. Your transaction has been completed successfully.
        </p>

        <Link
          to="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
        >
          Go to Home
        </Link>

        <div className="mt-6 text-gray-500 text-sm">
          Need help? <a href="/contact-us" className="text-red-600 underline">Contact Support</a>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
