const UserModel = require("../models/user-model");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");
const ApiError = require("../exceptions/api-error");

class UserService {
  async registation(email, password) {
    const user = await UserModel.findOne({ email });

    if (user) {
      throw ApiError.BadRequestError(`User ${email} already registered`);
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4();
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      activationLink,
    });
    await mailService.sendActivationEmail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`,
    );
    const userDto = new UserDto(newUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });

    if (user) {
      const arePasswordsEqual = await bcrypt.compare(password, user.password);

      if (arePasswordsEqual) {
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto };
      }

      throw ApiError.BadRequestError("Wrong password");
    }

    throw ApiError.BadRequestError("User doesn't exist. Please register");
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new ApiError.UnauthorizedError();
    }

    const userData = tokenService.verifyToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }

    const user = UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw ApiError.BadRequestError("Wrong activation link");
    }

    user.isActivated = true;
    await user.save();
  }

  async getUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
