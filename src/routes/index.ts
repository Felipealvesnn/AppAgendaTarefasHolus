import { Router } from "express";
import swaggerUi from "swagger-ui-express";
// import { userRouter } from "./user.routes";
import swaggerDocumentd from "../docs/swagger.json"; // ou o caminho gerado pelo tsoa
import { RegisterRoutes } from "./routes";



const router = Router();

//router.use("/users", userRouter);
RegisterRoutes(router);

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentd, {
  swaggerOptions: {
    persistAuthorization: true,  // Mantém a configuração de autenticação
  }
}));

export default router;
