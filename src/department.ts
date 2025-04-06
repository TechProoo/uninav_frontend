import axios from "axios";

export const getAllFaculty = async () => {
  try {
    const response = await axios.get(
      "https://uninav-backend-production.up.railway.app/faculty",
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw new Error("Error finding faculty");
  }
};
