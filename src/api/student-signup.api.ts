import { FormData } from "@/lib/data.type";
import { api } from "./base.api";

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
      headers: {
        "Content-Type": "application/json",
      },
      data: requestData,
    };

    const response = await api(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
