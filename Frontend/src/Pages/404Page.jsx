import React from "react";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center text-center relative overflow-hidden px-6">
      {/* Soft background decoration */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-red-100 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-32 right-32 w-56 h-56 bg-red-200 rounded-full blur-3xl opacity-30"></div>

      {/* Main content */}
      <div className="space-y-6 z-10">
        {/* Large 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-gray-200 tracking-tight">
          404
        </h1>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          The page you are looking for doesn’t exist or may have been moved.
        </p>

        {/* Action button */}
        <button
          onClick={() => (window.location.href = "/")}
          className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Marbo Global. All rights
        reserved.
      </footer>
    </div>
  );
};

export default NotFoundPage;
