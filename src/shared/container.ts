import { container } from "tsyringe";
import { UserService } from "../services/UserService";
import { IUserService } from "../interfaces/IUserService";
import { prisma } from "../prismackuente";

container.registerSingleton<IUserService>("IUserService", UserService);
container.register("PrismaClient", {
    useValue: prisma  ,
  });
