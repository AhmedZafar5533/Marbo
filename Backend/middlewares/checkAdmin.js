const User = require("../models/User");

const checkAdmin = async (req, res, next) => {
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

        // Check if the user's role is admin
        if (user.role !== "admin") {
            return res.status(403).json({
                isAuthenticated: true,
                message: "Unauthorized!",
            });
        }

        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
module.exports = checkAdmin;
