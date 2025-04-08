import { BASE_URL } from "@/api/base.api";
import axios from "axios";

export const getAllDepartment = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/department
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
