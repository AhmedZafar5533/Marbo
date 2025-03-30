const User = require("../models/User");

module.exports = async (req, res, next) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "Unauthorized: Please log in",
            });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(401).json({
                isAuthenticated: false,
                message: "User not found",
            });
        }

        if (!user.otpVerified) {
            return res.status(401).json({
                isAuthenticated: false,
                otpRequired: true,
                message: "OTP not verified",
            });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
