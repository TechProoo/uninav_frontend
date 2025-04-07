import { baseUrl } from "@/lib/server";
import axios from "axios";

export const getAllFaculty = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}/department
`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    if (!response) {
      throw Error("Couldn't get departments");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw new Error("Error finding faculty");
  }
};
