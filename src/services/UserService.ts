import { injectable } from "tsyringe";
import { User } from "../models/User";
import { IUserService } from "../interfaces/IUserService";

let users: User[] = [];
let idCounter = 1;

@injectable()
export class UserService implements IUserService {
  getAll(): User[] {
    return users;
  }

  create(name: string): User {
    if (!name) throw new Error("Nome é obrigatório!");
    const newUser = { id: idCounter++, name };
    users.push(newUser);
    return newUser;
  }

  delete(id: number): void {
    users = users.filter(user => user.id !== id);
  }
}
