import { loginData } from "@/lib/types/data.type";
import { BASE_URL } from "@/api/base.api";
import axios from "axios";

export const login = async (data: loginData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response || !response.data) {
      throw new Error("Couldn't get a valid response from signup API");
    }

    console.log("login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
