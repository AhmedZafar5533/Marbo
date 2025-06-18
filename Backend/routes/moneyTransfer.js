const express = require("express");
const router = express.Router();

router.get("/rate/exhange/:from", async (req, res) => {
    try {
        console.log("hello");
        console.log(req.params.from);
        const currency = req.params.from;
        const toConvert = req.query.to;
        const response = await fetch(
            `https://api.exchangerate.fun/latest?base=${currency}`
        );
        const data = await response.json();
        
        if (!data || !data.rates || !data.rates[toConvert]) {
            return res.status(400).json({
                error: "Invalid currency or conversion rate not found.",
            });
        }
        const convertedPrice = data.rates[toConvert];
        res.status(200).json({ data: convertedPrice });
    } catch (error) {}
});

module.exports = router;
