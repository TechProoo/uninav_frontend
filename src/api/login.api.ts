import { loginData } from "@/lib/data.type";
import { api } from "./base.api";

export const login = async (data: loginData) => {
  try {
    const requestData = JSON.stringify({
      emailOrMatricNo: data.email,
      password: data.password,
    });

    const config = {
      method: "post",
      url: "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    const response = await api(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};
