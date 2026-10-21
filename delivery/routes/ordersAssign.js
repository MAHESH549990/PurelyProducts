const express = require("express");
const router = express.Router();

const Order = require("../../models/orders.js");

// Middleware: allow only logged-in delivery partners
function requireDeliveryPartner(req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        req.flash("error", "Please log in first.");
        return res.redirect("/users/login");
    }

    if (req.user.role !== "delivery") {
        req.flash("error", "Access denied. Delivery partners only.");
        return res.redirect("/");
    }

    next();
}

// GET: Assigned orders
router.get("/assign", requireDeliveryPartner, async (req, res) => {
    try {
        const orders = await Order.find({
            status: "assigned",
            deliveryPartner: req.user._id
        })
            .populate("customer")
            .populate("products.product")
            .sort({ createdAt: -1 });

        res.render("routes/assignedOrders.ejs", { orders });
    } catch (err) {
        console.error("Assigned Orders Error:", err);
        req.flash("error", "Unable to load assigned orders.");
        res.redirect("/delivery");
    }
});

// GET: Orders out for delivery
router.get(
    "/assign/out-for-delivery",
    requireDeliveryPartner,
    async (req, res) => {
        try {
            const orders = await Order.find({
                status: "out_for_delivery",
                deliveryPartner: req.user._id
            })
                .populate("customer")
                .populate("products.product")
                .sort({ createdAt: -1 });

            res.render("routes/outOfDeliveryOrders.ejs", { orders });
        } catch (err) {
            console.error("Out-for-Delivery Orders Error:", err);
            req.flash("error", "Unable to load delivery orders.");
            res.redirect("/delivery");
        }
    }
);

// GET: Delivered orders
router.get(
    "/assign/delivered",
    requireDeliveryPartner,
    async (req, res) => {
        try {
            const orders = await Order.find({
                status: "delivered",
                deliveryPartner: req.user._id
            })
                .populate("customer")
                .populate("products.product")
                .sort({ createdAt: -1 });

            res.render("routes/deliveredOrders.ejs", { orders });
        } catch (err) {
            console.error("Delivered Orders Error:", err);
            req.flash("error", "Unable to load delivered orders.");
            res.redirect("/delivery");
        }
    }
);

// GET: Details of a delivery partner's own order
router.get("/assign/:id", requireDeliveryPartner, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            deliveryPartner: req.user._id,
            status: {
                $in: ["assigned", "out_for_delivery", "delivered"]
            }
        })
            .populate("customer")
            .populate("products.product");

        if (!order) {
            req.flash("error", "Order not found or not assigned to you.");
            return res.redirect("/delivery/assign");
        }

        res.render("routes/assignProductDetails.ejs", { order });
    } catch (err) {
        console.error("Order Details Error:", err);
        req.flash("error", "Unable to load order details.");
        res.redirect("/delivery/assign");
    }
});

// PATCH: Start delivery
router.patch(
    "/assign/:id/out-for-delivery",
    requireDeliveryPartner,
    async (req, res) => {
        try {
            const order = await Order.findOne({
                _id: req.params.id,
                deliveryPartner: req.user._id,
                status: "assigned"
            });

            if (!order) {
                req.flash(
                    "error",
                    "Order not found, not assigned to you, or already processed."
                );
                return res.redirect("/delivery/assign");
            }

            order.status = "out_for_delivery";
            await order.save();

            req.flash("success", "Order is now out for delivery!");
            res.redirect("/delivery/assign/out-for-delivery");
        } catch (err) {
            console.error("Start Delivery Error:", err);
            req.flash("error", "Unable to update order status.");
            res.redirect("/delivery/assign");
        }
    }
);

// PATCH: Mark order as delivered
router.patch(
    "/assign/:id/out-for-delivery/delivered",
    requireDeliveryPartner,
    async (req, res) => {
        try {
            const order = await Order.findOne({
                _id: req.params.id,
                deliveryPartner: req.user._id,
                status: "out_for_delivery"
            });

            if (!order) {
                req.flash(
                    "error",
                    "Order not found, not assigned to you, or not out for delivery."
                );
                return res.redirect("/delivery/assign/out-for-delivery");
            }

            order.status = "delivered";
            await order.save();

            req.flash("success", "Order delivered successfully!");
            res.redirect("/delivery/assign/delivered");
        } catch (err) {
            console.error("Complete Delivery Error:", err);
            req.flash("error", "Unable to mark order as delivered.");
            res.redirect("/delivery/assign/out-for-delivery");
        }
    }
);

module.exports = router;