const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    } = req.body;

    if (paymentMethod === "COD") {
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "Pending",
        paymentMethod: "COD",
        paymentStatus: "Pending",
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId: "",
      });

      await newlyCreatedOrder.save();

      return res.status(200).json({
        success: true,
        orderId: newlyCreatedOrder._id,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round((totalAmount * 100) / 120),
      currency: "usd",
      payment_method_types: ["card"],
      description: "Order payment",
      metadata: {
        userId,
        cartId,
      },
    });

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod: "Stripe",
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: paymentIntent.id,
    });

    await newlyCreatedOrder.save();

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: newlyCreatedOrder._id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating stripe payment",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be confirmed",
      });
    }

    // Retrieve the payment intent to confirm its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        success: false,
        message: "Payment not successful",
      });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Pending";
    order.paymentId = paymentId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

const getAllOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUserId,
  getOrderDetails,
};
