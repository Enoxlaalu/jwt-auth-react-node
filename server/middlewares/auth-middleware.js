const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

module.exports = (req, res, next) => {
  const throwError = () => {
    next(ApiError.UnauthorizedError());
  };

  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throwError();
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      throwError();
    }

    const userData = tokenService.verifyToken(token, true);

    if (!userData) throwError();

    req.user = userData;

    next();
  } catch (e) {
    throwError();
  }
};
