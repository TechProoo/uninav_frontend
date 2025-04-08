import { loginData } from "@/lib/types/data.type";
import { api } from "./base.api";
import { Response, UserProfile } from "@/lib/types/response.type";
import { updateAuthToken } from "@/lib/utils";
import { FormData } from "@/lib/types/data.type";
import { fetchUserProfile } from "./user.api";

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
      data: requestData,
    };

    const response = await api<Response<UserProfile>>(config);
    const authHeader: string = response.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    updateAuthToken(token);
    return { token, data: response.data };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const signup = async (formData: FormData) => {
  try {
    const requestData = JSON.stringify({
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      departmentId: formData.departmentId,
      level: formData.level,
    });

    const config = {
      method: "post",
      url: "/auth/signup",
      data: requestData,
    };

    const response = await api<Response<UserProfile>>(config);
    const authHeader: string = response.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    updateAuthToken(token);

    return {
      ...response.data,
      token,
    };
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
