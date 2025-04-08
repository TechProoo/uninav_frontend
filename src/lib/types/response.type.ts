export type Response<T> = {
  status: "success" | "error";
  message: string;
  data: T;
  error?: {
    cause: string;
    statusCode: number;
  };
}
export type UserProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  departmentId: string;
  level: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  department: {
    id: string;
    name: string;
    description: string;
    facultyId: string;
  };
  auth: {
    userId: string;
    email: string;
    verificationCode: string | null;
    emailVerified: boolean;
    matricNo: string | null;
    userIdType: string | null;
    userIdImage: string | null;
    userIdVerified: boolean;
  };
  courses: {
    userId: string;
    courseId: string;
    course: {
      id: string;
      courseName: string;
      courseCode: string;
      description: string;
      reviewStatus: string;
      reviewedBy: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }[];
};
