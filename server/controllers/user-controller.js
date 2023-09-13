const { validationResult } = require("express-validator");
const userService = require("../services/user-service");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation failed", errors.array()),
        );
      }

      const userData = await userService.registation(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequestError("Validation failed", errors.array()),
        );
      }

      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
      // res.clearCookie("refreshToken");
      // return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.logout(refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;

      await userService.activate(activationLink);

      return res.redirect(process.env.CLIENT_URL);
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getUsers();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
