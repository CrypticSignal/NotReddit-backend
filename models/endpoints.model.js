const endpointsFile = require("../endpoints.json");

exports.readEndpointsFile = async () => {
  try {
    return endpointsFile;
  } catch (err) {
    return Promise.reject({
      status: 500,
      msg: "Internal server error",
    });
  }
};
