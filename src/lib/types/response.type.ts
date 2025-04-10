export type Response<T> = {
  status: "success" | "error";
  message: string;
  data: T;
  error?: {
    cause: string;
    statusCode: number;
  };
};

// Material Enum Types
export enum ResourceType {
  UPLOAD = "upload",
  URL = "url",
  GDRIVE = "GDrive",
}

export enum MaterialTypeEnum {
  PDF = "pdf",
  VIDEO = "video",
  ARTICLE = "article",
  IMAGE = "image",
  OTHER = "other",
}

export enum VisibilityEnum {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum RestrictionEnum {
  DOWNLOADABLE = "downloadable",
  READONLY = "readonly",
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
export type Pagination<T> = {
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    limit: number; // page size
    hasMore: boolean;
    hasPrev: boolean;
  };
  data: T;
};
export type Course = {
  id: string;
  courseName: string;
  courseCode: string;
  description: string;
  reviewStatus: string;
  reviewedBy: string | null;
  departmentId: string;
  level: number;
  createdAt?: string;
  updatedAt?: string;
};

export enum CourseLevel {
  L100 = 100,
  L200 = 200,
  L300 = 300,
  L400 = 400,
  L500 = 500,
}

export type Material = {
  id: string;
  type: string;
  tags: string[];
  clicks: number;
  views: number;
  downloads: number;
  likes: number;
  isLiked?: boolean;
  creatorId: string;
  label: string;
  description: string;
  visibility: VisibilityEnum;
  restriction: RestrictionEnum;
  targetCourseId: string | null;
  targetCourse?: {
    id: string;
    courseName: string;
    courseCode: string;
  };
  reviewStatus: string;
  reviewedBy: string | null;
  searchVector?: string;
  createdAt: string;
  updatedAt: string;
  adverts?: Advert[];
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    departmentId: string;
    level: number;
  };
  resource?: {
    materialId: string;
    resourceAddress: string;
    resourceType: ResourceType;
    fileKey: string | null;
    metaData: string[];
    createdAt: string;
    updatedAt: string;
  };
};

export type Collection = {
  id: string;
  label: string;
  description: string;
  visibility: VisibilityEnum;
  creatorId: string;

  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    departmentId: string;
    level: number;
  };

  materials: Material[];
  createdAt: string;
  updatedAt: string;
};
export type Bookmark = {
  id: string;
  userid: string;
  materialId?: string;
  collectionId?: string;
  material?: Material;
  collection?: unknown;
  createdAt: string;
  updatedAt?: string;
};

export interface Faculty {
  id: string;
  name: string;
  description: string;
  departments?: Department[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  facultyId: string;
  faculty?: Faculty;
}

export interface Blog {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: "article" | "scheme_of_work" | "guidline" | "tutorial";
  headingImageAddress: string;
  headingImageKey: string;
  bodyKey: string;
  likes: number;
  views: number;
  clicks: number;
  tags: string[];
  body: string;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  status: "success" | "error";
  message: string;
  error?: {
    cause: string;
    statusCode: number;
  };
}

export interface BlogResponse {
  data: Blog[],
  pagination: {
    page: string;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
  };
}

export enum AdvertTypeEnum {
  FREE = "free",
  PAID = "pro",
  BOOST = "boost",
  TARGETED = "targeted",
}

export type Advert = {
  id: string;
  type: AdvertTypeEnum;
  amount: string;
  creatorId: string;
  materialId: string;
  collectionId: string | null;
  imageUrl: string;
  fileKey: string;
  label: string;
  description: string;
  clicks: number;
  views: number;

  material?: Material;
  collection?: Collection;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  reviewStatus: string;
  createdAt: string;
  updatedAt: string;
};

export type SearchResponse = {
  message: string;
  status: "success" | "error";
  data: {
    data: {
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
      visibility: VisibilityEnum;
      restriction: RestrictionEnum;
      targetCourse: string | null;
      reviewStatus: string;
      reviewedBy: string | null;
      creator: {
        id: string;
        firstName: string;
        lastName: string;
        username: string;
      };
      targetCourseInfo: {
        id: string;
        courseName: string;
        courseCode: string;
      } | null;
      rank: number;
    }[];
    pagination: {
      page: string;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasMore: boolean;
      hasPrev: boolean;
    };
  };
};