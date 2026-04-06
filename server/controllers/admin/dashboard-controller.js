const User = require("../../models/User");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const dashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalPendingOrders = await Order.countDocuments({
      orderStatus: "Pending",
    });

    const topSellingProducts = await Order.aggregate([
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.productId",
          totalQuantity: { $sum: "$cartItems.quantity" },
          productTitle: { $first: "$cartItems.title" },
          productImage: { $first: "$cartItems.image" },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          productName: {
            $ifNull: ["$productDetails.title", "$productTitle"],
          },
          productImage: {
            $ifNull: ["$productDetails.image", "$productImage"],
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalUsers,
      totalOrders,
      totalProducts,
      totalPendingOrders,
      topSellingProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { dashboardData };
