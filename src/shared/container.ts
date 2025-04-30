import { container } from "tsyringe";
import { UserService } from "../services/UserService";
import { IUserService } from "../interfaces/IUserService";


container.registerSingleton<IUserService>("IUserService", UserService);
