import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = container.resolve(UserController);

router.get("/", (req, res) => userController.getAllUsers(req, res));
router.post("/", (req, res, next) => userController.createUser(req, res, next));
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));

export { router as userRouter };
