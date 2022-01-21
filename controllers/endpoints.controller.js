const { readEndpointsFile } = require("../models/endpoints.model");

exports.describeEndpoints = async (req, res, next) => {
  try {
    res.status(200).json(await readEndpointsFile());
  } catch (err) {
    next(err);
  }
};
