import { FormData } from "@/lib/data.type";
import { baseUrl } from "@/lib/server";
import axios from "axios";

export const signup = async (data: FormData) => {
 

  try {
    const response = await axios.post(
      `${baseUrl}/auth/student`, // Corrected URL
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
