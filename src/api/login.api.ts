import { loginData } from "@/lib/types/data.type";
import { api } from "./base.api";
import { Response, UserProfile } from "@/lib/types/response.type";

export const login = async (
  data: loginData
): Promise<{ token: string; data: Response<UserProfile> }> => {
  try {
    const requestData = JSON.stringify({
      emailOrMatricNo: data.email,
      password: data.password,
    });

    const config = {
      method: "POST",
      url: "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    const response = await api<Response<UserProfile>>(config);
    console.log(JSON.stringify(response.data));
    return { token: response.headers.authorization, data: response.data };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
