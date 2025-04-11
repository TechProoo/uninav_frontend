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

// Email verification by code
export const verifyEmailByCode = async (email: string, code: string) => {
  try {
    const requestData = JSON.stringify({
      email,
      code,
    });

    const config = {
      method: "POST",
      url: "/auth/verify-email",
      data: requestData,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error) {
    console.error("Error verifying email by code:", error);
    throw error;
  }
};

// Email verification by token
export const verifyEmailByToken = async (token: string) => {
  try {
    const requestData = JSON.stringify({
      token,
    });

    const config = {
      method: "POST",
      url: "/auth/verify-email/token",
      data: requestData,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error) {
    console.error("Error verifying email by token:", error);
    throw error;
  }
};

// Resend email verification
export const resendEmailVerification = async (email: string) => {
  try {
    const requestData = JSON.stringify({
      email,
    });

    const config = {
      method: "POST",
      url: "/auth/resend-verification",
      data: requestData,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error) {
    console.error("Error resending verification email:", error);
    throw error;
  }
};
