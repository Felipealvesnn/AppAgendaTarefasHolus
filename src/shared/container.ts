import { container } from "tsyringe";
import { UserService } from "../services/UserService";
import { IUserService } from "../interfaces/IUserService";
import { prisma } from "../prismackuente";
import { AuthService } from "../services/authService";
import { IAuthService } from "../interfaces/IAuthService";

container.registerSingleton<IUserService>("IUserService", UserService);
container.registerSingleton<IAuthService>("IAuthService", AuthService);

container.register("PrismaClient", {
    useValue: prisma  ,
  });
