exports.handleInvalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "Invalid endpoint" });
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(400).send({ msg: "Username does not exist" });
  }
  next(err);
};

exports.handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({
      msg: err.msg,
    });
  } else {
    next(err);
  }
};

exports.handleUnexpectedErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
