const mongoose = require('mongoose');

const { Schema } = mongoose;

// eslint-disable-next-line camelcase
const Session_Schema = new Schema({
  user_id: mongoose.Types.ObjectId,
  local_client_id: mongoose.Types.ObjectId,
});

const Session = mongoose.model('session', Session_Schema);
module.exports = { Session };
