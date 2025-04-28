import React, { useState, useEffect } from 'react';
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../Store/authStore';

const LoadingSpinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { authenticationState, redirectToOtp, sendLoginRequest } = useAuthStore()

  useEffect(() => {
    if (authenticationState) {
      navigate("/");
    } else if (redirectToOtp) {
      navigate("/verify");
    }
  }, [authenticationState, redirectToOtp, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await sendLoginRequest({ email, password });
    setIsLoading(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 flex justify-center">

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



        </div>

        {/* Login Card */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link to="/forget-password" className="text-xs text-red-600 hover:text-red-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>



            {/* Login Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>

            </div>
          </form>
        </div>

        {/* Sign up prompt */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
              Sign up
            </Link>
          </p>
        </div>
      </div >
    </div >
  );
};

export default LoginPage;