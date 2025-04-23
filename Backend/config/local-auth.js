const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            { usernameField: "email" },
            async (email, password, done) => {
                try {
                    // console.log("Received:", email.toLowerCase(), password);
                    const lowerCasedEmail = email.toLowerCase();
                    console.log();
                    const user = await User.findOne({ email: lowerCasedEmail });
                    console.log(user);
                    if (!user)
                        return done(null, false, {
                            message: "Invalid email or password",
                        });

                    const isMatch = await user.matchPassword(password);
                    if (!isMatch)
                        return done(null, false, {
                            message: "Invalid email or password",
                        });

                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id).select("-password");
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
