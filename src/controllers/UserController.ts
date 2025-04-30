import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "tsyringe";
import { IUserService } from "../interfaces/IUserService";

@injectable()
export class UserController {
  constructor(
    @inject("IUserService") private userService: IUserService
  ) {}

  getAllUsers(req: Request, res: Response) {
    const users = this.userService.getAll();
    res.json(users);
  }

  createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = this.userService.create(req.body.name);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      this.userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
