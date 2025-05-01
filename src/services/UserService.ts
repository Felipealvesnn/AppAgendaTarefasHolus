import { injectable, inject } from "tsyringe";
import { PrismaClient, User as PrismaUser } from "../generated/prisma";
import { IUserService } from "../interfaces/IUserService";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject("PrismaClient") private prisma: PrismaClient
  ) {}

  async getAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({ include: { roles: true } });
  }

  async create(name: string): Promise<PrismaUser> {
    if (!name) throw new Error("Nome é obrigatório!");

    // Criar um email fictício se ainda não estiver usando
    const email = `${name.toLowerCase().replace(/\s/g, '')}@email.com`;

    return this.prisma.user.create({
      data: {
        name,
        email,
        isActive: true,
        roles: { connect: [] }, // ou adicione roles aqui se necessário
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
