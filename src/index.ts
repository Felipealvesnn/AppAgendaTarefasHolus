import express from "express";
import { userRouter } from "./routes/user.routes";
import { errorHandler } from "./middlewares/errorHandler";
import router from "./routes";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT || 3000;

app.use(express.json());

app.use(router); 


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});