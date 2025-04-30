import dotenv from "dotenv";

dotenv.config();

function getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Variável de ambiente ${key} não definida.`);
    }
    return value;
}

export const env = {
    PORT: getEnvVar("PORT"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
};
