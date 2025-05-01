import { Request } from "express";
import { ForbiddenError, UnauthorizedError } from "./errorHandler";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Tipagem para o usuário autenticado
export interface AuthenticatedUser {
  id: number;
  email: string;
  roles: string[];
}

// Extendendo o Request do Express para incluir o usuário autenticado
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export function expressAuthentication(
  request: AuthenticatedRequest,
  securityName: string,
  scopes?: string[]
): Promise<AuthenticatedUser> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return Promise.reject(
        new UnauthorizedError("Token de autenticação não fornecido")
      );
    }

    return new Promise((resolve, reject) => {
      jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(new UnauthorizedError("Token de autenticação inválido"));
          return;
        }

        const user = decoded as AuthenticatedUser;

        // Verificar permissões (scopes) do usuário
        if (scopes && scopes.length > 0) {
          // Verifica se o usuário tem pelo menos uma das roles necessárias
          const hasRequiredRole = scopes.some((scope) =>
            user.roles.includes(scope)
          );

          if (!hasRequiredRole) {
            reject(
              new ForbiddenError(
                "Você não tem permissão para acessar este recurso"
              )
            );
            return;
          }
        }

        // Inclui o usuário no request para uso posterior
        request.user = user;
        resolve(user);
      });
    });
  }

  return Promise.reject(
    new UnauthorizedError("Método de autenticação não suportado")
  );
}
