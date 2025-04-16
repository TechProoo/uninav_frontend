import { loginData } from "@/lib/types/data.type";
import { api } from "./base.api";
import { Response, UserProfile } from "@/lib/types/response.type";
import { updateAuthToken } from "@/lib/utils";
import { FormData } from "@/lib/types/data.type";

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
  } catch (error: any) {
    console.error("Error during login:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

export const logout = async () => {
  try {
    const config = {
      method: "POST",
      url: "/auth/logout",
    };
    await api<Response<any>>(config);
  } catch (error: any) {
    console.error("Error during logout:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
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
      url: "/auth/student",
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
  } catch (error: any) {
    console.error("Error during signup:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
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
  } catch (error: any) {
    console.error("Error verifying email by code:", error);
    throw new Error(
      error?.response?.data?.message || "Email Verification Failed"
    );
  }
};

// Email verification by token
export const verifyEmailByToken = async (token: string) => {
  try {
    // No need to encode here since it's already encoded in the URL
    const config = {
      method: "GET",
      url: `/auth/verify-email/token?token=${token}`,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error: any) {
    console.error("Error verifying email by token:", error);
    throw new Error(
      error?.response?.data?.message || "Email Verification Failed"
    );
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
  } catch (error: any) {
    console.error("Error verifying email by code:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Request password reset
export const requestPasswordReset = async (email: string) => {
  try {
    const requestData = JSON.stringify({ email });

    const config = {
      method: "POST",
      url: "/auth/forgot-password",
      data: requestData,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error: any) {
    console.error("Error requesting password reset:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};

// Reset password with token
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const requestData = JSON.stringify({ token, newPassword });

    const config = {
      method: "POST",
      url: "/auth/reset-password",
      data: requestData,
    };

    const response = await api<Response<any>>(config);
    return response.data;
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error?.response?.data?.message || "Something went wrong");
  }
};
