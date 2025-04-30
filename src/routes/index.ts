import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { userRouter } from "./user.routes";
import swaggerDocument from "../swagger-output.json";


const router = Router();

router.use("/users", userRouter);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
