import callApi from "src/utils/callApi.ts";
import { UserResponse } from "src/models/response/UserResponse.ts";

export default class UserService {
  static async getUsers(): Promise<UserResponse[]> {
    return await callApi({
      url: "api/users",
    });
  }
}
