import { Role } from "../generated/prisma";

export interface RoleDto {
  id: number;
  name: string;
}

// DTO para retornar dados do usuário
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  empresaId?: number;
  updatedAt: Date;
  lastLogin?: Date;
  profileImageUrl?: string;
  roles: RoleDto[];
}

// DTO para criar um novo usuário
export interface CreateUserDto {
  name: string;
  email: string;
  password?: string;
  empresaId: number;
  roleIds?: number[];
  profileImageUrl?: string;
}

// DTO para atualizar um usuário
export interface UpdateUserDto {
  name?: string;
  email?: string;
  isActive?: boolean;
  roleIds?: number[];
  profileImageUrl?: string;
}

// Parâmetros para paginação e filtros
export interface GetAllUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  active?: boolean;
}

// Resposta paginada
export interface PaginatedUsersResponse {
  data: UserResponseDto[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}