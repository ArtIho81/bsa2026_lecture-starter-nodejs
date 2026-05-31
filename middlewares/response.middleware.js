const responseMiddleware = (req, res, next) => {
  const errorData = (message) => ({ error: true, message });

  if (res.err) {
    const message = Array.isArray(res.err)
      ? res.err.join(", ")
      : res.err.message;
    const status = message.match(`wasn't found`) ? 404 : 400;
    return res.status(status).json(errorData(message));
  }
  res.status(200).json(res.data);

  next();
};

export { responseMiddleware };
