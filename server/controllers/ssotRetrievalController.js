const mongoose = require('mongoose');
const ssotModels = require('../models/singleSourceOfTruthModel.js');

// GET /ssot/:id
exports.getSingleSourceOfTruth = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { id } = req.params;
    const ssot = await mongoose.model('SSoT').findById(id).exec();
    res.send(ssot);
  } catch (err) {
    console.error(err);
  }
};
