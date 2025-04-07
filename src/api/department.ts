<<<<<<<< HEAD:src/components/api/department.api.ts
import { api } from "./base.api";

export const getAllFaculty = async () => {
  try {
    const response = await api.get("/faculty");
    console.log(response.data);
========
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

>>>>>>>> 5ad6750dd95a3651195411aed503de6e79cae32a:src/api/department.ts
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty:", error);
    throw new Error("Error finding faculty");
  }
};
