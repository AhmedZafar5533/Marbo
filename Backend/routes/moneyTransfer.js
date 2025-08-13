const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuthetication");
const MoneyTransfer = require("../models/moneyTransfer");
const moneyTransferSchemaValidation = require("../Validations/moneyTransferOrderValidation");

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

router.post("/order/add/:serviceId", checkAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const orderExists = await MoneyTransfer.findOne({
      useId: userId,
      serviceId: req.params.serviceId,
    });

    if (orderExists)
      return res.status(400).json({ message: "User already has an order." });

    const {
      amount,
      convertedAmount,
      currency,
      deliveryMethod,
      recipientId,
      accountNumber,
      bankName,
      receipientName,
    } = req.body;
    console.log(req.body);
    const { error } = moneyTransferSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    console.log(req.body);

    const moneyTransfer = MoneyTransfer.create({
      ...req.body,
      userId,
      serviceId: req.params.serviceId,
      status: "pending",
    });
    if (!moneyTransfer) {
      return res
        .status(500)
        .json({ error: "Failed to create money transfer." });
    }
    res.status(201).json({
      message: "Money transfer created successfully.",
      data: moneyTransfer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

router.get("/get/order/:serviceId", checkAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const moneyTransfers = await MoneyTransfer.findOne({
      userId,
      serviceId: req.params.serviceId,
    });
    res.status(200).json({ data: moneyTransfers });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

module.exports = router;
