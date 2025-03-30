const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["customer", "vendor"],
            default: "customer",
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        otpVerified: {
            type: Boolean,
            default: false,
        },
        onboardingDone: {
            type: Boolean,
            default: false,
        },
        prfilePic: {
            type: String,
            default: "https://www.gravatar.com/avatar/?d=mp&s=200",
        },
    },
    { timestamps: true }
);

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
