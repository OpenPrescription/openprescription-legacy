export default (req, res, next) => {
  if (req.headers.authorization !== process.env.API_KEY)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  next();
};
