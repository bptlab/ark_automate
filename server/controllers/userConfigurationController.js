const userConfig = require('../config/userConfig.json');

exports.getCurrentId = async (req, res) => {
  try {
    res.set('Content-Type', 'application/json');
    res.send(userConfig);
  } catch (err) {
    console.log(err);
  }
};

// GET /set-current-id?userId=1
exports.setCurrentId = async (req, res) => {
  try {
    const { userId } = req.query;
    let id = Number(userId);
    userConfig.UserId = id;
    res.set('Content-Type', 'application/json');
    res.send(userConfig);
  } catch (err) {
    console.log(err);
  }
};
