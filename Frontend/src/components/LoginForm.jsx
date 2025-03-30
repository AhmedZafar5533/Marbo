import { useState, useEffect } from 'react';
import { Home, Eye, EyeOff, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../Store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // Destructure the loading state from your auth store along with the other functions/values.
  const { sendLoginRequest, authenticationState, redirectToOtp, loading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticationState) {
      navigate("/");
    } else if (redirectToOtp) {
      navigate("/verify");
    }
  }, [authenticationState, redirectToOtp, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendLoginRequest({ email, password });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Illustration Section - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 to-indigo-900 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full"></div>

        <div className="max-w-md text-center space-y-8 z-10">
          <svg
            className="w-full h-64 text-white opacity-90"
            viewBox="0 0 500 500"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M250 50 
                 C350 150, 350 350, 250 450 
                 C150 350, 150 150, 250 50"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <path
              d="M250 100 
                 Q300 200, 250 300 
                 Q200 400, 250 500 
                 Q300 400, 250 300 
                 Q200 200, 250 100 Z"
              stroke="currentColor"
              strokeWidth="10"
              fill="none"
              strokeOpacity="0.4"
            />
            <polygon
              points="250,150 350,250 250,350 150,250"
              fill="currentColor"
              fillOpacity="0.6"
            />
          </svg>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Welcome Back</h2>
            <p className="text-indigo-200 text-lg">Reconnect with your business ecosystem</p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 relative pt-30 md:pt-30 lg:pt-5">
        <a href="/" className="absolute top-6 left-6 flex items-center text-indigo-700 font-bold">
          <Home className="mr-2 h-6 w-6" />
          YourLogo
        </a>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent">
              Login
            </h1>
            <p className="text-indigo-600 text-lg">Access your business dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-indigo-800">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-indigo-800">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Login Button with Loading Spinner */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-800 hover:to-indigo-950 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Logging In...
                </>
              ) : (
                "Log In"
              )}
            </button>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-indigo-700 mt-6">
              Don't have an account?{' '}
              <a href="/redirect" className="text-indigo-800 hover:text-indigo-900 font-medium">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
