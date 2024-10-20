const { Order } = require('../models/order');
const { OrderItem } = require('../models/order-item');
const express = require('express');
const router = express.Router();

// Get all orders (for reference)
router.get('/', async (req, res) => {
    try {
        const orderList = await Order.find()
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product', // Populate product details inside orderItems
                    select: 'name price', // Select product fields to include
                },
            });

        if (!orderList) {
            return res.status(500).json({ success: false });
        }
        res.send(orderList);
    } catch (error) {
        res.status(500).send('Error fetching orders');
    }
});
router.delete('/:id',(req, res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if (order) {
            return res.status(200).json({ success: true, message: 'The order is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: "order not found!" });
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err });
    });
});
// Post a new order
router.post('/', async (req, res) => {
    try {
        // Validate incoming data
        const { orderItems, shippingAddress1, city, country, zip, phone, totalPrice, user } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: "Order must have at least one item." });
        }
        if (!shippingAddress1 || !city || !country || !zip || !phone || !totalPrice || !user) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Create an array of promises to save order items
        const orderItemIdsPromises = orderItems.map(async (orderItem) => {
            const newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });
            return newOrderItem.save(); // Save and return the newly created order item
        });

        // Resolve the promises and get the order item IDs
        const orderItemsIdsResolved = await Promise.all(orderItemIdsPromises);

        // Create the order object
        const order = new Order({
            orderItems: orderItemsIdsResolved,
            shippingAddress1,
            shippingAddress2: req.body.shippingAddress2, // Optional field
            city,
            country,
            zip,
            phone,
            status: req.body.status || 'Pending', // Set default status to 'Pending'
            totalPrice,
            user // Assumed the user ID is passed from frontend
        });

        // Save the order to the database
        const savedOrder = await order.save();

        // Send the saved order back as a response
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('The order cannot be created');
    }
});

module.exports = router;
