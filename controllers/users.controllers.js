const { addUser, fetchUsernames, fetchUser } = require("../models/users.models");

exports.getUsernames = async (req, res, next) => {
  try {
    const usernames = await fetchUsernames();
    res.status(200).send(usernames);
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await fetchUser(req.params.username);
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

exports.postUser = async (req, res, next) => {
  try {
    const addedUser = await addUser(req.body);
    res.status(201).send(addedUser);
  } catch (err) {
    next(err);
  }
};
