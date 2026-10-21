
const express = require("express");
const router = express.Router({ mergeParams: true });

const Product = require("../../models/products.js");
const Review = require("../../models/review.js");
const Order = require("../../models/orders.js");
const asyncWrap = require("../../utils/asyncWrap.js");

const {
    isLoggedIn,
    validateReviews,
    isReviewOwner
} = require("../userMiddleware.js");

const upload = require("../../upload.js"); // Adjust path if needed
const cloudinary = require("../../cloudConfig.js");
const { Readable } = require("stream");

// Upload image buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "PurelyProducts/reviews",
                resource_type: "image"
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        Readable.from(buffer).pipe(stream);
    });
};

// Add review only after delivery
router.post(
    "/",
    isLoggedIn,
    upload.single("image"),
    validateReviews,
    asyncWrap(async (req, res) => {
        const { id } = req.params;

        const deliveredOrder = await Order.findOne({
            customer: req.user._id,
            status: "delivered",
            "products.product": id
        });

        if (!deliveredOrder) {
            req.flash(
                "error",
                "You can review this product only after delivery."
            );
            return res.redirect(`/product/${id}`);
        }

        const product = await Product.findById(id);

        if (!product) {
            req.flash("error", "Product not found.");
            return res.redirect("/product");
        }

        const newReview = new Review(req.body.review);
        newReview.owner = req.user._id;

        // Upload selected image, if any
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer);

            newReview.image = {
                url: result.secure_url,
                filename: result.public_id
            };
        }

        await newReview.save();

        product.reviews.push(newReview._id);
        await product.save();

        req.flash("success", "Review added successfully.");
        res.redirect(`/product/${id}`);
    })
);

// Delete review
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewOwner,
    asyncWrap(async (req, res) => {
        const { id, reviewId } = req.params;

        await Product.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId }
        });

        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review deleted successfully.");
        res.redirect(`/product/${id}`);
    })
);

module.exports = router;
