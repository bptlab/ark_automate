const mongoose = require('mongoose');

const { Schema } = mongoose;

const userAccessSchema = new Schema({
  AccessLevel: String,
  robotId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'RobotId required'],
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: [true, 'UserId required'],
  },
});

mongoose.model('userAccessObject', userAccessSchema);
