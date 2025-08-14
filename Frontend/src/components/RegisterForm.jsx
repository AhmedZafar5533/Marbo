import React, { useState, useEffect } from "react";
import {
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  X,
  Check,
  ArrowRight,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessages, setErrorMessages] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    isString: false,
    notEmpty: false,
    minLength: false,
    maxLength: true, // Default to true as it's unlikely to exceed 128 chars initially
    hasUpperCase: false,
    hasLowerCase: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const {
    sendRegisterRequest,
    returnedMessages,
    redirectToOtp,
    loading,
    authenticationState,
  } = useAuthStore();

  // Handle returned messages from auth store
  useEffect(() => {
    if (!returnedMessages) return;

    const newErrorMessages = { ...errorMessages };

    try {
      // Process each field in returnedMessages
      if (typeof returnedMessages === "object" && returnedMessages !== null) {
        Object.keys(returnedMessages).forEach((key) => {
          if (key in errorMessages) {
            // Safe string conversion
            if (
              returnedMessages[key] === null ||
              returnedMessages[key] === undefined
            ) {
              newErrorMessages[key] = "";
            } else if (typeof returnedMessages[key] === "string") {
              newErrorMessages[key] = returnedMessages[key];
            } else {
              // Handle objects/arrays by setting a generic message
              newErrorMessages[key] = `Error with ${key}`;
            }
          } else {
            // For any keys not in our error state, add to general error
            newErrorMessages.general =
              "There was a problem with your submission.";
          }
        });
      } else if (typeof returnedMessages === "string") {
        // Handle if returnedMessages is just a string
        newErrorMessages.general = returnedMessages;
      }
    } catch (e) {
      // Fallback for any parsing issues
      newErrorMessages.general = "An error occurred. Please try again.";
      console.error("Error processing returned messages", e);
    }

    setErrorMessages(newErrorMessages);
  }, [returnedMessages]);

  useEffect(() => {
    const role = new URLSearchParams(location.search).get("role");
    if (!role) navigate("/redirect");
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [location.search]);

  useEffect(() => {
    if (authenticationState) {
      navigate("/");
    } else if (redirectToOtp) {
      navigate("/verify");
    }
  }, [authenticationState, redirectToOtp, navigate]);

  useEffect(() => {
    const { password } = formData;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;

    setPasswordValidation({
      isString: typeof password === "string",
      notEmpty: password.trim() !== "",
      minLength: password.length >= 8,
      maxLength: password.length <= 128,
      hasUpperCase: uppercaseRegex.test(password),
      hasLowerCase: lowercaseRegex.test(password),
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    setErrorMessages((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    const usernameRegex = /^[a-zA-Z0-9\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (!formData.username.trim() || !usernameRegex.test(formData.username))
      newErrors.username = "Enter a valid name.";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address.";
    if (!passwordRegex.test(formData.password))
      newErrors.password =
        "Password must be at least 6 characters and include a number.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    setErrorMessages(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("Form data before sending:", formData);
    sendRegisterRequest(formData);
  };

  // Password validation checklist component
  const PasswordChecklist = () => {
    const requirements = [
      {
        key: "isString",
        text: "Password must be a string",
        met: passwordValidation.isString,
      },
      {
        key: "notEmpty",
        text: "Password is required",
        met: passwordValidation.notEmpty,
      },
      {
        key: "minLength",
        text: "Password must be at least 8 characters long",
        met: passwordValidation.minLength,
      },
      {
        key: "maxLength",
        text: "Password must be at most 128 characters long",
        met: passwordValidation.maxLength,
      },
      {
        key: "hasUpperCase",
        text: "Password must contain at least one uppercase letter",
        met: passwordValidation.hasUpperCase,
      },
      {
        key: "hasLowerCase",
        text: "Password must contain at least one lowercase letter",
        met: passwordValidation.hasLowerCase,
      },
    ];

    return (
      <div className="mt-2 space-y-1 text-sm">
        {requirements.map((req) => (
          <div key={req.key} className="flex items-center">
            {req.met ? (
              <Check className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className={req.met ? "text-green-600" : "text-red-500"}>
              {req.text}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Simple error message component
  const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
      <p className="text-red-500 text-sm flex items-center">
        <AlertCircle className="mr-1 h-4 w-4" /> {message}
      </p>
    );
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
              <div className="relative h-12 w-12 rounded-full bg-gradient-to-tr from-red-600 to-red-500 shadow-lg flex items-center justify-center transition-transform transform group-hover:scale-110">
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

        {/* Signup Card */}
        <div className="bg-white shadow-lg border border-gray-100 rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an account
            </h2>
            <p className="text-gray-500 mt-2">Sign up to get started</p>
          </div>

          {/* General error message */}
          {errorMessages.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              <p>{errorMessages.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Choose a username"
              />
              <ErrorMessage message={errorMessages.username} />
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                placeholder="Enter your email"
              />
              <ErrorMessage message={errorMessages.email} />
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage message={errorMessages.password} />

              {/* Password Validation Checklist */}
              {formData.password.length > 0 && <PasswordChecklist />}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <ErrorMessage message={errorMessages.confirmPassword} />
            </div>

            {/* Signup Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Login prompt */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-red-600 hover:text-red-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
