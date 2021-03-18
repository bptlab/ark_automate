const mongoose = require('mongoose');

const { Schema } = mongoose;

const userAccessSchema = new Schema({
  AccessLevel: String,
  robotId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
});

module.exports = mongoose.model('userAccessObject', userAccessSchema);
