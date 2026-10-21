const express = require("express");
const router = express.Router();
const requireDeliveryPartner=require("../requireDeliveryPartner.js");

const Order = require("../../models/orders.js");

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
            return res.redirect("/delivery/orders/assign");
        }

        res.render("routes/assignProductDetails.ejs", { order });
    } catch (err) {
        console.error("Order Details Error:", err);
        req.flash("error", "Unable to load order details.");
        res.redirect("/delivery/orders/assign");
    }
});


// POST: Confirm assigned order and start delivery
router.post("/:id/confirm", requireDeliveryPartner, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            deliveryPartner: req.user._id,
            status: "assigned"
        });

        if (!order) {
            console.log("Order not found for delivery partner:", req.params.id);
            req.flash("error", "Order not found or not assigned to you.");
            return res.redirect("/delivery/orders/assign");
        }

        order.status = "out_for_delivery";
        await order.save();

        console.log("Updated order status:", order.status);
        console.log("Assigned delivery partner:", order.deliveryPartner);

        req.flash("success", "Delivery has started!");

        return res.redirect("/delivery/orders/assign/out-for-delivery");
    } catch (err) {
        console.error("Confirm Order Error:", err);
        req.flash("error", "Unable to confirm this order.");
        return res.redirect("/delivery/orders/assign");
    }
});

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
                return res.redirect("/delivery/orders/assign/out-for-delivery");
            }

            order.status = "delivered";
            await order.save();

            req.flash("success", "Order delivered successfully!");
            res.redirect("/delivery/orders/assign/delivered");
        } catch (err) {
            console.error("Complete Delivery Error:", err);
            req.flash("error", "Unable to mark order as delivered.");
            res.redirect("/delivery/orders/assign/out-for-delivery");
        }
    }
);



module.exports = router;