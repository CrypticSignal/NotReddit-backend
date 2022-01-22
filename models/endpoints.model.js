const fs = require("fs/promises");

exports.readEndpointsFile = async () => {
  try {
    const endpointsFileContents = await fs.readFile(__dirname + "/../endpoints.json", "utf-8");
    return endpointsFileContents;
  } catch (err) {
    return Promise.reject({
      status: 500,
      msg: "Internal server error",
    });
  }
};
