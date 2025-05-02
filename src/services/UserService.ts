// UserService.ts (com melhorias)
import { injectable, inject } from "tsyringe";
import bcrypt from "bcryptjs";
import { PrismaClient, User as PrismaUser } from "../generated/prisma";
import { IUserService } from "../interfaces/IUserService";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  GetAllUsersParams,
  PaginatedUsersResponse,
  ChangePasswordDto,
} from "../dtos/userDtos";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandler";
import { env } from "../config/env";

@injectable()
export class UserService implements IUserService {
  // Fator de custo para o hash bcrypt - idealmente em variável de ambiente
  private readonly BCRYPT_COST = env.BCRYPT_COST || 12;
  
  constructor(@inject("PrismaClient") private prisma: PrismaClient) {}

  async getAll(params: GetAllUsersParams): Promise<PaginatedUsersResponse> {
    const { page, limit, search, sortBy, sortOrder, active } = params;

    // Calcular offset para paginação
    const skip = (page - 1) * limit;

    // Construir filtros dinâmicos
    const where: any = {};

    // Filtrar por status (ativo/inativo)
    if (active !== undefined) {
      where.isActive = active;
    }

    // Pesquisar por nome ou email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Construir opções de ordenação
    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder || "asc";
    } else {
      orderBy.createdAt = "desc"; // Default: mais recentes primeiro
    }

    // Buscar usuários com paginação
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { roles: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    // Calcular meta-informações da paginação
    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map((user) => this.mapToResponseDto(user)),
      meta: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    return this.mapToResponseDto(user);
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    // Validar dados
    if (!data.name?.trim()) {
      throw new BadRequestError("Nome é obrigatório");
    }

    if (!data.email?.trim()) {
      throw new BadRequestError("Email é obrigatório");
    }

    if (!data.password) {
      throw new BadRequestError("Senha é obrigatória");
    }

    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestError(`Email ${data.email} já está em uso`);
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(data.password, this.BCRYPT_COST);

    // Preparar conexões para roles
    const roleConnections = data.roleIds?.length
      ? data.roleIds.map(id => ({ id }))
      : [{ id: 1 }]; // Default role 'user'

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        profileImageUrl: data.profileImageUrl,
        password: passwordHash,
        empresaId: data.empresaId || 1, // Add required empresa field with default value
        isActive: true,
        roles: {
          connect: roleConnections,
        },
      },
      include: {
        roles: true,
      },
    });

    return this.mapToResponseDto(user);
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
    });

    if (!existingUser) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Se estiver atualizando o email, verificar se já está em uso
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
        select: { id: true },
      });

      if (emailExists && emailExists.id !== id) {
        throw new BadRequestError(`Email ${data.email} já está em uso`);
      }
    }

    // Preparar dados para atualização
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.email !== undefined) updateData.email = data.email.trim().toLowerCase();
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.profileImageUrl !== undefined) updateData.profileImageUrl = data.profileImageUrl;

    // Atualizar roles se fornecidos
    let roleUpdate = {};
    if (data.roleIds) {
      roleUpdate = {
        roles: {
          disconnect: existingUser.roles.map(role => ({ id: role.id })), // Disconnect all current roles
          connect: data.roleIds.map(id => ({ id })), // Connect new roles
        }
      };
    }

    // Atualizar usuário
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...roleUpdate,
      },
      include: { roles: true },
    });

    return this.mapToResponseDto(user);
  }

  async changePassword(id: number, data: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = data;

    if (!currentPassword || !newPassword) {
      throw new BadRequestError("Senha atual e nova senha são obrigatórias");
    }

    // Verificar se usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, password: true },
    });

    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError("Senha atual inválida");
    }

    // Gerar hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, this.BCRYPT_COST);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }

  async resetPassword(id: number, newPassword: string): Promise<void> {
    // Método para administradores resetarem a senha de um usuário
    if (!newPassword) {
      throw new BadRequestError("Nova senha é obrigatória");
    }

    // Verificar se usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Gerar hash da nova senha
    const passwordHash = await bcrypt.hash(newPassword, this.BCRYPT_COST);

    // Atualizar senha
    await this.prisma.user.update({
      where: { id },
      data: { password: passwordHash },
    });
  }

  async delete(id: number): Promise<void> {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingUser) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Soft delete - atualiza isActive para false
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Método auxiliar para mapear o usuário do Prisma para o DTO de resposta
  private mapToResponseDto(user: PrismaUser & { roles: any[] }): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
      roles: user.roles.map(role => ({
        id: role.id,
        name: role.name,
      })),
    };
  }
}