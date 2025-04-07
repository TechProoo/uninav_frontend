export interface Faculty {
  id: string;
  name: string;
  description: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  facultyId: string;
  faculty: Faculty;
}

export interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  departmentId: string;
  level: number;
}

export interface loginData {
  email: string;
  password: string;
}
