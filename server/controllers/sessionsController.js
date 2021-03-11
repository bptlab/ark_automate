/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const sessionsModel = require('../models/sessionModel.js');

// GET /session/byClient/:id
// example client_id 604a3ba656ee2d1f2d4eda61
// TODO figure out why session is not found
exports.getUserFromClientId = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');

    const { id } = req.params;
    const usableId = mongoose.Types.ObjectId(id);
    const session = await mongoose
      .model('session')
      .find({ local_client_id: usableId })
      .exec();
    console.log(mongoose.Types.ObjectId(id));
    res.send(session.user_id);
  } catch (err) {
    console.error(err);
  }
};

// GET /session/new?lci=123123&userId=123111
exports.createSession = async (req, res) => {
    res.set('Content-Type', 'application/json');
    const session = new sessionsModel.Session({
      user_id: req.query.userId,
      local_client_id: req.query.lci,
      });
    session.save((err) => {
      if (err) return console.error(err);
      return res.send(session);
    });
};

// DELETE /session/:id
exports.deleteSession = async (req, res) => {
    try {
        const { id } = req.params;
        await mongoose.model('session').deleteOne({ _id: id }).exec();
        res.send("Session deleted");
      } catch (err) {
        console.error(err);
      }
};