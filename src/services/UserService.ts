import { injectable, inject } from "tsyringe";
import { PrismaClient, User as PrismaUser } from "../generated/prisma";
import { IUserService } from "../interfaces/IUserService";

@injectable()
export class UserService implements IUserService {
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  async getAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({ include: { roles: true } });
  }

  async create(model: PrismaUser): Promise<PrismaUser> {
    if (!model.name) throw new Error("Nome é obrigatório!");

    const name = model.name.trim();
    const email =
      model.email || `${name.replace(/\s+/g, "").toLowerCase()}@example.com`;

    return this.prisma.user.create({
      data: {
        name,
        email,
        createdAt: new Date(), // ✅ agora
        isActive: true,
        roles: {
          connect: [{ id: 1 }], // ✅ associa o role ID 1
        },
      },
      include: {
        roles: true, // opcional: inclui os roles retornados na resposta
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
