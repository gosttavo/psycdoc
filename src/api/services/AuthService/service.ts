import request from "../../request";
import qs from "qs";
import { AuthLoginBody } from "../../../interfaces/Auth";
import { AuthEndpoints } from "./config";

export default class AuthService {
  public static login = async ({ email, password }: AuthLoginBody) => {
    const response = await request({
      url: AuthEndpoints.login(),
      method: "POST",
      data: qs.stringify({ email, password }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log("Login response:", response.data);
    return response.data;
  };

  public static getUser = async (id: number) => {
    const response = await request({
      url: AuthEndpoints.me(),
      method: "POST",
      data: qs.stringify({ id }),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log("Get user response:", response.data);
    return response.data;
  };
}
