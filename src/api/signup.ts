import { FormData } from "@/lib/types/data.type";
import { BASE_URL } from "@/api/base.api";
import axios from "axios";

export const signup = async (data: FormData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth/student`, // Corrected URL
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.data) {
      throw new Error("Couldn't get a valid response from signup API");
    }

    console.log(response);
    console.log("Signup successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};
