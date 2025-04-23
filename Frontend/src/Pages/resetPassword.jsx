// ResetPasswordForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Removed useSearchParams as we are using useParams
// Import the Eye, EyeOff, and CheckCircle icons
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
// Import the store and the loading state
import { useForgetPasswordStore } from "../../Store/forgetPasswordStore";

// Simple Spinner component (can be moved to a shared components file)
const Spinner = () => (
    <div className="inline-block w-5 h-5 border-4 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
);

export default function ResetPasswordForm() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // State for the password mismatch error specifically
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    // States to track validation rule status for the new password
    const [isLengthValid, setIsLengthValid] = useState(false);
    const [hasUppercase, setHasUppercase] = useState(false);
    const [hasLowercase, setHasLowercase] = useState(false);
    const [hasDigit, setHasDigit] = useState(false);
    // State to toggle password visibility
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Destructure loading and the reset request function from the store
    const { loading, sendResetPasswordRequest, resetSuccess } = useForgetPasswordStore();

    const navigate = useNavigate();

    // Get the token from URL parameters
    const { token } = useParams();

    // Effect to check for token existence on mount
    useEffect(() => {
        // If no token is present in the URL path, redirect
        if (!token) {
            navigate('/');
        }
        // Added navigate to dependency array as recommended by React hooks linting
    }, [token, navigate]);


    // Function to check password strength rules and update state
    const checkPasswordStrength = (password) => {
        setIsLengthValid(password.length >= 8);
        setHasUppercase(/[A-Z]/.test(password));
        setHasLowercase(/[a-z]/.test(password));
        setHasDigit(/[0-9]/.test(password));
        // Add more checks here if needed (e.g., special characters)
    };

    useEffect(() => {
        if (resetSuccess)
            navigate('/login');
    }, [resetSuccess]);

    // Check password strength whenever the newPassword changes
    useEffect(() => {
        checkPasswordStrength(newPassword);
        // Also check for mismatch error when new password changes
        if (confirmPassword && newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError(""); // Clear mismatch error if they now match
        }
    }, [newPassword, confirmPassword]); // Depend on newPassword and confirmPassword

    // Check for mismatch error when confirmPassword changes
    useEffect(() => {
        if (newPassword && newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
        } else {
            setConfirmPasswordError(""); // Clear mismatch error if they now match
        }
    }, [confirmPassword, newPassword]); // Depend on confirmPassword and newPassword


    const handleSubmit = async (e) => { // Made the function async
        e.preventDefault();

        // Prevent submission if already loading
        if (loading) {
            return;
        }

        // Re-check password strength on submit to be sure
        const isCurrentLengthValid = newPassword.length >= 8;
        const hasCurrentUppercase = /[A-Z]/.test(newPassword);
        const hasCurrentLowercase = /[a-z]/.test(newPassword);
        const hasCurrentDigit = /[0-9]/.test(newPassword);

        // Update states based on final check for visual consistency on submit
        setIsLengthValid(isCurrentLengthValid);
        setHasUppercase(hasCurrentUppercase);
        setHasLowercase(hasCurrentLowercase);
        setHasDigit(hasCurrentDigit);

        // Check if all strength requirements are met
        if (!isCurrentLengthValid || !hasCurrentUppercase || !hasCurrentLowercase || !hasCurrentDigit) {
            // The visual feedback below the input handles specific errors
            setConfirmPasswordError(""); // Clear mismatch error if strength fails
            return; // Prevent submission if requirements are not met
        }

        // Check password match after strength validation passes
        if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return; // Prevent submission if passwords don't match
        } else {
            setConfirmPasswordError(""); // Clear mismatch error
        }
        try {

            await sendResetPasswordRequest({ token, newPassword, confirmPassword });

        } catch (error) {
            // Handle errors from the API call if your store doesn't handle them globally
            console.error("Password reset failed:", error);
        }
        // --- End Store Action Call ---
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-7"
            >
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    Reset Password
                </h2>
                <p className="text-center text-gray-600 text-base">
                    Create a new strong password.
                </p>

                {/* New Password Input Group with Toggle and Validation Feedback */}
                <div className="space-y-2"> {/* Space between input and validation list */}
                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            // Disable input while loading
                            className={`w-full py-3 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${loading ? 'bg-gray-200 cursor-not-allowed border-gray-300' : 'border-gray-300'
                                }`}
                            aria-label="New Password"
                            disabled={loading} // Disable input
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            // Disable button while loading
                            className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer ${loading ? 'cursor-not-allowed' : ''}`}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                            disabled={loading} // Disable toggle button
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>


                </div>

                {/* Confirm Password Input Group with Toggle */}
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        // Disable input while loading
                        className={`w-full py-3 px-4 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${loading ? 'bg-gray-200 cursor-not-allowed border-gray-300' : 'border-gray-300'
                            }`}
                        aria-label="Confirm New Password"
                        disabled={loading} // Disable input
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        // Disable button while loading
                        className={`absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer ${loading ? 'cursor-not-allowed' : ''}`}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        disabled={loading} // Disable toggle button
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {/* Password Strength Validation Feedback List */}
                <ul className="text-sm text-gray-600 space-y-1">
                    <li className={`flex items-center ${isLengthValid ? 'text-green-600' : ''}`}>
                        {isLengthValid ? <CheckCircle size={16} className="mr-1 flex-shrink-0" /> : <span className="w-4 h-4 mr-1 flex-shrink-0"></span>}
                        At least 8 characters long
                    </li>
                    <li className={`flex items-center ${hasUppercase ? 'text-green-600' : ''}`}>
                        {hasUppercase ? <CheckCircle size={16} className="mr-1 flex-shrink-0" /> : <span className="w-4 h-4 mr-1 flex-shrink-0"></span>}
                        Contains an uppercase letter
                    </li>
                    <li className={`flex items-center ${hasLowercase ? 'text-green-600' : ''}`}>
                        {hasLowercase ? <CheckCircle size={16} className="mr-1 flex-shrink-0" /> : <span className="w-4 h-4 mr-1 flex-shrink-0"></span>}
                        Contains a lowercase letter
                    </li>
                    <li className={`flex items-center ${hasDigit ? 'text-green-600' : ''}`}>
                        {hasDigit ? <CheckCircle size={16} className="mr-1 flex-shrink-0" /> : <span className="w-4 h-4 mr-1 flex-shrink-0"></span>}
                        Contains a digit
                    </li>
                </ul>


                {/* Display Mismatch Error */}
                {confirmPasswordError && <p className="text-red-600 text-sm text-left mt-2">{confirmPasswordError}</p>}


                <button
                    type="submit"
                    // Conditionally apply styles based on loading state
                    className={`w-full bg-red-600 text-white font-bold py-3.5 rounded-lg transition-all flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed bg-red-500' : 'hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'
                        }`}
                    disabled={loading} // Disable the button when loading is true
                >
                    {loading ? (
                        // Show spinner and text when loading
                        <>
                            <Spinner />
                            <span className="ml-2">Resetting...</span>
                        </>
                    ) : (
                        // Show original text when not loading
                        "Reset Password"
                    )}
                </button>
            </form>
        </div>
    );
}
