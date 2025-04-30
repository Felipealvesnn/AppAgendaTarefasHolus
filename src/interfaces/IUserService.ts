import { User } from "../models/User";

export interface IUserService {
  getAll(): User[];
  create(name: string): User;
  delete(id: number): void;
}
