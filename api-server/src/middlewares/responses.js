import ApplicationError from "../errors/application";

const success = (res) => {
  return (data) => {
    return res.json({
      status: "success",
      data,
    });
  };
};

const error = (res) => {
  return (err) => {
    if (err instanceof Error == false)
      return res
        .status(err.statusCode)
        .json(Object.assign(err, { message: err.message }));
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Unexpected error",
    });
  };
};

const fail = (res) => {
  return (validations) => {
    return res.status(422).json({
      status: "fail",
      validations,
    });
  };
};

const unauthoratized = (res) => {
  return (message) => {
    return res.status(401).json({
      status: "unauthoratized",
      message,
    });
  };
};

export default (req, res, next) => {
  Object.assign(res, {
    success: success(res),
    error: error(res),
    fail: fail(res),
    unauthoratized: unauthoratized(res),
  });
  next();
};
