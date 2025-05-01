
import { User } from "../generated/prisma";

export interface IUserService {
  getAll(): Promise<User[]>;
  create(name: User): Promise<User>;
  delete(id: number): Promise<void>;
}
