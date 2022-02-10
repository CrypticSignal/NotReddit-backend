const { fetchUsernames } = require("../models/users.model");

exports.getUsernames = async (req, res, next) => {
  console.log("in controller");
  try {
    const usernames = await fetchUsernames();
    console.log(usernames);
    res.status(200).send(usernames);
  } catch (err) {
    next(err);
  }
};
