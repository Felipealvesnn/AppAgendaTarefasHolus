import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export class UserController {
    static getAllUsers(req: Request, res: Response) {
        const users = UserService.getAll();
        res.json(users);
    }

    static createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = UserService.create(req.body.name);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    static deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = parseInt(req.params.id);
            UserService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}