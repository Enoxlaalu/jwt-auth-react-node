import { AuthResponse } from "src/models/response/AuthResponse";
import callApi from "src/utils/callApi.ts";

export default class AuthService {
  static async login(email: string, password: string): Promise<AuthResponse> {
    return await callApi({
      url: "/api/login",
      method: "POST",
      body: {
        email,
        password,
      },
    });
  }

  static async register(
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return await callApi({
      url: "/api/registration",
      method: "POST",
      body: {
        email,
        password,
      },
    });
  }

  static async logout() {
    return await callApi({
      url: "/api/logout",
      method: "POST",
    });
  }

  static async checkAuth(): Promise<AuthResponse> {
    return await callApi({
      url: "/api/refresh",
    });
  }
}
