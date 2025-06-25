export interface CreateUserDto {
  email: string;
  name: string;
}

export interface UserResponseDto {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
