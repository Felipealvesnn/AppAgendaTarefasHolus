// import { Router } from "express";
// import { container } from "tsyringe";
// import { UserController } from "../controllers/UserController";

// const router = Router();
// const userController = container.resolve(UserController);

// router.get("/", (req, res) => userController.getAllUsers(req, res));

// router.post("/", (req, res, next) => {
//   /**
//    * @swagger
//    * /users:
//    *   post:
//    *     summary: Cria um novo usuário
//    *     tags:
//    *       - Users
//    *     requestBody:
//    *       required: true
//    *       content:
//    *         application/json:
//    *           schema:
//    *             type: object
//    *             required:
//    *               - name
//    *             properties:
//    *               name:
//    *                 type: string
//    *                 example: João
//    *     responses:
//    *       201:
//    *         description: Usuário criado com sucesso
//    */
//   userController.createUser(req, res, next);
// });

// router.delete("/:id", (req, res, next) =>
//   userController.deleteUser(req, res, next)
// );

// export { router as userRouter };
