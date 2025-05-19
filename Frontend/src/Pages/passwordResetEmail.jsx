// ForgotPasswordForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgetPasswordStore } from "../../Store/forgetPasswordStore";


// Simple Spinner component
const Spinner = () => (
    <div className="inline-block w-5 h-5 border-4 border-white border-solid rounded-full animate-spin border-t-transparent"></div>
);


export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    // Destructure loading from the store
    const { sendForgetPasswordRequest, loading } = useForgetPasswordStore();

    const handleSubmit = async (e) => { // Made async as sendForgetPasswordRequest is likely async
        e.preventDefault();

        // Prevent submission if already loading
        if (loading) {
            return;
        }

        // More robust email validation regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");

        // Call the store action
        // Await the request if it's async and handle potential errors/success navigation here
        // The useAuthStore might handle navigation internally,
        // but adding a try/catch here is good practice if it throws errors.
        try {
            await sendForgetPasswordRequest(email);
            // Assuming sendForgetPasswordRequest handles success navigation internally
            // If it doesn't, you would navigate here on success, e.g., navigate("/reset-password/verify");
        } catch (err) {
            // Handle errors from the store action, if necessary
            console.error("Forgot password request failed:", err);
            setError(err.message || "Failed to send reset code. Please try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-7"
            >
                <h2 className="text-3xl font-extrabold text-gray-900 text-center">
                    Forgot Password
                </h2>
                <p className="text-center text-gray-600 text-base">
                    Enter your registered email to receive a reset link.
                </p>

                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        // Disable input while loading
                        className={`w-full py-3 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${loading ? 'bg-gray-200 cursor-not-allowed border-gray-300' : 'border-gray-300'
                            }`}
                        aria-label="Email Address"
                        disabled={loading} // Disable input
                    />
                    {error && <p className="text-red-600 text-sm text-left">{error}</p>}
                </div>

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
                            <span className="ml-2">Sending...</span>
                        </>
                    ) : (
                        // Show original text when not loading
                        "Send Reset Link"
                    )}
                </button>
            </form>
        </div>
    );
}