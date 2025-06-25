export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface UpdateUserRequest {
  name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
