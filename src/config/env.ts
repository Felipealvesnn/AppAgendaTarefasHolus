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
    NODE_ENV: getEnvVar("NODE_ENV"),
    JWT_SECRET: getEnvVar("JWT_SECRET"),
    DATABASE_URL: getEnvVar("DATABASE_URL"),
    BCRYPT_COST: parseInt(getEnvVar("BCRYPT_COST"), 10),
    REFRESH_TOKEN_EXPIRY: getEnvVar("REFRESH_TOKEN_EXPIRY"),
    ACCESS_TOKEN_EXPIRY: getEnvVar("ACCESS_TOKEN_EXPIRY"),
};
