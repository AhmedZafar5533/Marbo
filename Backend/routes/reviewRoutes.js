const express = require("express");
const { reviewSchema } = require("../Validations/reviewValidatin");
const reviews = require("../models/reviews");

const router = express.Router();

router.get("/get/:id", async (req, res) => {
  try {
    const Review = mongoose.model("Review");

    let reviews = [];
    let skipCount = (page - 1) * limit;

    if (includeUserReview && page === 1) {
      const userReview = await Review.findOne({ findingId, userId }).lean();

      const otherReviews = await Review.find({
        findingId,
        ...(userReview && { _id: { $ne: userReview._id } }),
      })
        .sort({ createdAt: -1 })
        .limit(limit - (userReview ? 1 : 0))
        .lean();

      reviews = userReview ? [userReview, ...otherReviews] : otherReviews;
    } else {
      if (page > 1 && includeUserReview) {
        skipCount = (page - 1) * limit - 1;
        if (skipCount < 0) skipCount = 0;
      }

      reviews = await Review.find({ findingId })
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limit)
        .lean();
    }
  } catch (error) {}
});

router.post("/upload/:id", async (req, res) => {
  try {
    const body = req.body;
    console.log("Body:", body);

    const { error } = reviewSchema.validate({
      comment: body.comment,
      rating: body.rating,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const newReview = await reviews.create({
      review: body.comment,
      rating: body.rating,
      userId: req.user._id,
      serviceId: body.serviceId,
      username: req.user.username,
      findingId: req.params.id,
    });

    if (!newReview)
      res
        .status(400)
        .json({ message: "Error posting review. Please try again!" });
    res.status(201).json({
      message: "Review uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
