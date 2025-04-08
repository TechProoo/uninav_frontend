export type Response<T> = {
  status: "success" | "error";
  message: string;
  data: T;
  error?: {
    cause: string;
    statusCode: number;
  };
};
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
export type Material = {
  id: string;
  type: string;
  tags: string[];
  clickCount: number;
  viewCount: number;
  downloadCount: number;
  likes: number;
  creatorId: string;
  label: string;
  description: string;
  visibility: string;
  restriction: string;
  reviewStatus: string;
  reviewedBy: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    departmentId: string;
    level: number;
  };
  resource: {
    materialId: string;
    resourceAddress: string;
    resourceType: string;
    fileKey: string;
    metaData: any[];
    createdAt: string;
    updatedAt: string;
  };
};

export type Bookmark = {
  id: string;
  userid: string;
  materialId?: string;
  collectionId?: string;

  material?: Material;
  collection?: unknown;
  createdAt?: string;
  updatedAt?: string;
};
