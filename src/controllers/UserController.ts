import { 
  Controller, 
  Get, 
  Post, 
  Put,
  Route, 
  Tags, 
  Body, 
  Delete, 
  Path, 
  Security,
  Query,
  SuccessResponse,
  Response
} from "tsoa";
import { inject, injectable } from "tsyringe";
import { User } from "../generated/prisma";
import { IUserService } from "../interfaces/IUserService";
import { NotFoundError } from "../middlewares/errorHandler";
import { 
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto,
  PaginatedUsersResponse
} from "../dtos/userDtos";

@Route("users")
@Tags("Users")
@injectable()
export class UserController extends Controller {
  constructor(@inject("IUserService") private userService: IUserService) {
    super();
  }

  /**
   * Retorna uma lista paginada de usuários
   */
  @Get("/")
  // @Security("jwt", ["admin", "manager"])
  public async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Query() search?: string,
    @Query() sortBy?: string,
    @Query() sortOrder?: "asc" | "desc",
    @Query() active?: boolean
  ): Promise<PaginatedUsersResponse> {
    return this.userService.getAll({ 
      page, 
      limit, 
      search, 
      sortBy, 
      sortOrder, 
      active 
    });
  }

  /**
   * Retorna um usuário pelo ID
   */
  @Get("/{id}")
  // @Security("jwt")
  @Response<NotFoundError>(404, "Usuário não encontrado")
  public async getUserById(@Path() id: number): Promise<UserResponseDto> {
    return this.userService.getById(id);
  }

  /**
   * Cria um novo usuário
   */
  @Post("/")
  // @Security("jwt", ["admin"])
  @SuccessResponse(201, "Usuário criado com sucesso")
  public async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.create(body);
    this.setStatus(201);
    return user;
  }

  /**
   * Atualiza um usuário existente
   */
  @Put("/{id}")
  // @Security("jwt", ["admin"])
  @Response<NotFoundError>(404, "Usuário não encontrado")
  public async updateUser(
    @Path() id: number, 
    @Body() body: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, body);
  }

  /**
   * Remove um usuário (soft delete)
   */
  @Delete("/{id}")
  // @Security("jwt", ["admin"])
  @Response<NotFoundError>(404, "Usuário não encontrado")
  @SuccessResponse(204, "Usuário removido com sucesso")
  public async deleteUser(@Path() id: number): Promise<void> {
    await this.userService.delete(id);
    this.setStatus(204);
  }
}