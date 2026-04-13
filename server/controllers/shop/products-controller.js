const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], price = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};

    if (category.length) {
      const normalizedCategory = category
        .split(",")
        .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1));

      filters.category = { $in: normalizedCategory };
    }

    // Handle price range filter
    if (price.length) {
      const [minPrice, maxPrice] = price.split(",").map(Number);
      if (!isNaN(minPrice) && !isNaN(maxPrice)) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
    }

    let sort = {};

    switch (sortBy) {
      case "price-lowtohigh":
        sort.price = 1;
        break;

      case "price-hightolow":
        sort.price = -1;
        break;

      case "title-atoz":
        sort.title = 1;
        break;

      case "title-ztoa":
        sort.title = -1;
        break;

      default:
        sort.price = 1;
        break;
    }

    const products = await Product.find(filters).sort(sort);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some errors occured",
    });
  }
};

const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    const { category, price } = product;

    const priceRange = 0.3;
    const minPrice = price * (1 - priceRange);
    const maxPrice = price * (1 + priceRange);

    const relatedProducts = await Product.find({
      _id: { $ne: id },
      category: category,
      price: {
        $gte: minPrice,
        $lte: maxPrice,
      },
    })
      .limit(6)
      .select("title price salePrice images category");

    res.status(200).json({
      success: true,
      data: relatedProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some errors occured",
    });
  }
};

const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .select("title price salePrice images category totalStock featured");

    res.status(200).json({
      success: true,
      data: featuredProducts,
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
  getFilteredProducts,
  getProductDetails,
  getRelatedProducts,
  getFeaturedProducts,
};
