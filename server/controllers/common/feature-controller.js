const Feature = require("../../models/Feature");

const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    const featureImage = new Feature({ image });

    await featureImage.save();

    res.status(201).json({ success: true, data: featureImage });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find({});

    res.status(200).json({ success: true, data: images });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error" });
  }
};

module.exports = {
  addFeatureImage,
  getFeatureImages,
};
