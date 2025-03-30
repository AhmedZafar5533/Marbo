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
        <div className="relative bg-gradient-to-br from-gray-50 to-blue-100 font-sans p-4">
            {/* Logo positioned at top left */}
            <header className="absolute top-0 left-0 p-4">
                <a href="/">
                    <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
                        Marbo Global
                    </h1>
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

                    {nOtp && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 text-center rounded-md shadow-sm">
                            <p className="text-base sm:text-lg font-semibold">
                                New OTP: <span className="text-green-900">{nOtp}</span>
                            </p>
                        </div>
                    )}

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
                                className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-center text-lg sm:text-2xl font-semibold rounded-xl border-2 border-gray-300 bg-gray-50 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="w-full bg-gradient-to-r from-indigo-700 to-indigo-900 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg hover:from-indigo-800 hover:to-indigo-950 transition-all duration-300 transform hover:scale-[1.01] shadow-lg hover:shadow-xl flex items-center justify-center"
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
                        Didn't receive the code?{" "}
                        {resendTimer > 0 ? (
                            <span className="text-indigo-600 font-medium">
                                Resend OTP in {resendTimer} seconds
                            </span>
                        ) : (
                            <button
                                onClick={handleResendOtp}
                                className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
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
