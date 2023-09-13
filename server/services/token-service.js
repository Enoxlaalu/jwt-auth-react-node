const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token-model");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token, isAccessToken) {
    const secret =
      process.env[
        isAccessToken ? "JWT_ACCESS_SECRET_KEY" : "JWT_REFRESH_SECRET_KEY"
      ];

    try {
      const userData = jwt.verify(token, secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      tokenData.save();
    }

    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = tokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
