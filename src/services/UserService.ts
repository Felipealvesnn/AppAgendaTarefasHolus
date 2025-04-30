import { User } from "../models/User";

let users: User[] = [];
let idCounter = 1;

export class UserService {
    static getAll() {
        return users;
    }

    static create(name: string) {
        if (!name) throw new Error("Nome é obrigatório!");
        const newUser = { id: idCounter++, name };
        users.push(newUser);
        return newUser;
    }

    static delete(id: number) {
        users = users.filter(user => user.id !== id);
    }
}