import { Controller, Get, Post, Route, Tags, Body, Delete, Path } from "tsoa";
import { IUserService } from "../interfaces/IUserService";
import { inject, injectable } from "tsyringe";
import { User } from "../generated/prisma";

@Route("users")
@Tags("Users")
@injectable()
export class UserController extends Controller {
  constructor(@inject("IUserService") private userService: IUserService) {
    super();
  }

  @Get("/")
  public async getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post("/")
  public async createUser(@Body() body: User): Promise<User> {
    return this.userService.create(body || "");
  }

  @Delete("/{id}")
  public async deleteUser(@Path() id: number): Promise<void> {
    this.userService.delete(id);
  }
}
