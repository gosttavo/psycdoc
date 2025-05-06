import request from "../../request";
import { AuthLoginBody } from "../../../interfaces/Auth";
import { AuthEndpoints } from "./config";

export default class AuthService {
  public static login = async (data: AuthLoginBody) => {
    const response = await request({
      url: AuthEndpoints.login(),
      method: "POST",
      data: data,
      headers: { "Content-Type": "application/json" }
    });

    if (!response.success) {
      throw new Error(response.error || 'Login failed');
    }

    return response;
  };

  public static getUser = async (id: number) => {
    const user = await request({
      url: `${AuthEndpoints.me()}?id=${id}`,
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    return user[0];
  };
}