import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../../Store/authStore";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function OTPVerification() {
    const { verifyOtp, loading, redirectToOtp, getOtp, newOtp } = useAuthStore();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [nOtp, setNewOtp] = useState(null);
    const navigate = useNavigate();

    const RESEND_COOLDOWN = 30;
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        if (!loading && !redirectToOtp) {
            navigate("/");
        }
    }, [redirectToOtp, loading, navigate]);

    useEffect(() => {
        if (redirectToOtp) {
            getOtp();
            setResendTimer(RESEND_COOLDOWN);
        }
    }, [redirectToOtp, getOtp]);

    useEffect(() => {
        if (newOtp) {
            setNewOtp(newOtp);
        }
    }, [newOtp]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const timeoutId = setTimeout(() => {
            setResendTimer(resendTimer - 1);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [resendTimer]);

    const handleChange = (index, value) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newOtpArray = [...otp];
        newOtpArray[index] = value;
        setOtp(newOtpArray);
        if (value && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = () => {
        const joinedOtp = otp.join("");
        verifyOtp(joinedOtp);
    };

    const handleResendOtp = () => {
        if (resendTimer > 0) return;
        getOtp();
        setResendTimer(RESEND_COOLDOWN);
    };

    return (
        <div className="relative bg-gradient-to-br from-red-50/50 to-red-100/50 font-sans p-4">
            {/* Logo positioned at top left */}
            <header className="absolute top-0 left-0 p-4">
                <a href="/" className="flex items-center gap-2">
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


                </a>
            </header>

            {/* Centered form container using full viewport height */}
            <div className="flex justify-center items-center h-screen">
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 w-full max-w-md transition-transform duration-300 hover:-translate-y-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
                        Enter OTP
                    </h2>
                    <p className="text-gray-600 text-center mb-4">
                        We've sent a code to your email
                    </p>

                    <div className="flex justify-center gap-2 sm:gap-3 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-2xl font-semibold rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-200 transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Verifying...
                            </>
                        ) : (
                            "Verify"
                        )}
                    </button>

                    <p className="text-gray-600 text-center mt-6 text-xs sm:text-sm">
                        Didn't receive the code?{' '}
                        {resendTimer > 0 ? (
                            <span className="text-red-600 font-medium">
                                Resend OTP in {resendTimer} seconds
                            </span>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                className="text-red-600 font-medium hover:text-red-800 hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
