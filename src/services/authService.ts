import { injectable, inject } from "tsyringe";
import { PrismaClient } from "../generated/prisma";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { BadRequestError, UnauthorizedError } from "../middlewares/errorHandler";
import bcrypt from "bcryptjs";
import { AuthResponseDto, IAuthService, LoginDto } from "../interfaces/IAuthService";


@injectable()
export class AuthService implements IAuthService {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  async login(credentials: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new BadRequestError("Email e senha são obrigatórios");
    }

    // Buscar usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { roles: true },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    // Em um sistema real, verificaríamos a senha hash aqui
    // Por exemplo:
    // const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    // if (!isPasswordValid) {
    //   throw new UnauthorizedError("Credenciais inválidas");
    // }

    // Criar o payload do token
    const tokenPayload = {
      id: user.id,
      email: user.email,
      roles: user.roles.map(role => role.name),
    };

    // Gerar o token JWT
    const token = jwt.sign(tokenPayload, env.JWT_SECRET, {
      expiresIn: "24h", // Token expira em 24 horas
    });

    // Atualizar o lastLogin do usuário
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles.map(role => role.name),
      },
    };
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new UnauthorizedError("Token inválido ou expirado");
    }
  }
}