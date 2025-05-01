import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto, 
  GetAllUsersParams,
  PaginatedUsersResponse
} from "../dtos/userDtos";

export interface IUserService {
  getAll(params: GetAllUsersParams): Promise<PaginatedUsersResponse>;
  getById(id: number): Promise<UserResponseDto>;
  create(data: CreateUserDto): Promise<UserResponseDto>;
  update(id: number, data: UpdateUserDto): Promise<UserResponseDto>;
  delete(id: number): Promise<void>;
}