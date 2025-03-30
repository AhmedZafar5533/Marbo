module.exports = {
    theme: {
        extend: {
            colors: {
                emerald: {
                    600: "#059669",
                    700: "#047857",
                },
            },
            animation: {
                float: "float 3s ease-in-out infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
        },
    },
};
