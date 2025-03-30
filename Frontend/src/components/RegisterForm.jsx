import { useState, useEffect } from 'react';
import { Home, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../Store/authStore';
import { useLocation, useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate()

  const { sendRegisterReguest, returnedMessages, redirectToOtp, loading, authenticationState } = useAuthStore();
  const location = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role');
    if (role) {
      setFormData(prev => ({
        ...prev,
        role: role
      }));
    }
  }, [location.search]);

  useEffect(() => {
    if (returnedMessages) {
      setErrors({
        username: returnedMessages.username,
        email: returnedMessages.email,
      });
    }
  }, [returnedMessages]);

  const validateForm = () => {
    let newErrors = {};
    const usernameRegex = /^[a-zA-Z0-9\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!formData.username.trim() || !usernameRegex.test(formData.username))
      newErrors.username = "Enter a valid name.";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!passwordRegex.test(formData.password))
      newErrors.password = "Password must be at least 6 characters and include a number.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (authenticationState) {
      navigate("/");
    } else if (redirectToOtp) {
      navigate("/verify");
    }
  }, [authenticationState, redirectToOtp, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log(errors);
      return;
    }

    sendRegisterReguest(formData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
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
              d="M250 100 
                 Q350 200, 250 300 
                 Q150 400, 250 500 
                 Q350 400, 250 300 
                 Q150 200, 250 100 Z"
              fill="currentColor"
              fillOpacity="0.2"
            />
            <circle cx="250" cy="250" r="200" stroke="currentColor" strokeWidth="20" fill="none" strokeOpacity="0.4" />
            <path
              d="M250 150 
                 L300 250 
                 L250 350 
                 L200 250 Z"
              fill="currentColor"
              fillOpacity="0.6"
            />
          </svg>
          <div>
            <h2 className="text-4xl font-bold text-white mb-4">Showcase Your Services</h2>
            <p className="text-indigo-200 text-lg">Join our marketplace of successful service professionals</p>
          </div>
        </div>
      </div>
      {/* Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <a href="/" className="absolute top-6 left-6 flex items-center text-indigo-700 font-bold">
          <Home className="mr-2 h-6 w-6" />
          YourLogo
        </a>

        <div className="w-full max-w-md space-y-8 mt-10 md:mt-4">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-gradient-to-r from-indigo-700 to-indigo-900 bg-clip-text text-transparent">
              Get Started
            </h1>
            <p className="text-indigo-600 text-lg">Create your account in minutes to showcase your services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-indigo-800">Username</label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="Your username"
                  required
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="mr-1" /> {errors.username}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-indigo-800">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="hello@example.com"
                  required
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="mr-1" /> {errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-indigo-800">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="mr-1" /> {errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-800">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-700 focus:border-indigo-700 transition-all duration-200 placeholder-indigo-400"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-500 hover:text-indigo-700">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm flex items-center"><AlertCircle className="mr-1" /> {errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-800 hover:to-indigo-950 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Signing Up...
                </>
              ) : (
                "Create Account"
              )}
            </button>
            <p className="text-center text-sm text-indigo-700 ">
              Already have an account?{' '}
              <a href="/login" className="text-indigo-800 hover:text-indigo-900 font-medium">
                Log in
              </a>
            </p>

            <p className="text-center text-sm text-indigo-700 ">
              By creating an account, you agree to our<br />
              <a href="#terms" className="text-indigo-800 hover:text-indigo-900 font-medium">Terms of Service</a> and <a href="#privacy" className="text-indigo-800 hover:text-indigo-900 font-medium">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
