import { injectable, inject } from "tsyringe";
import { PrismaClient, User as PrismaUser } from "../generated/prisma";
import { IUserService } from "../interfaces/IUserService";
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  GetAllUsersParams,
  PaginatedUsersResponse,
} from "../dtos/userDtos";
import { BadRequestError, NotFoundError } from "../middlewares/errorHandler";

@injectable()
export class UserService implements IUserService {
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
      data: users.map((user) => ({
        ...user,
        lastLogin: user.lastLogin || undefined,
        profileImageUrl: user.profileImageUrl || undefined,
      })),
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

    return {
      ...user,
      roles: user.roles,
      lastLogin: user.lastLogin || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
    };
  }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    // Validar dados
    if (!data.name) {
      throw new BadRequestError("Nome é obrigatório");
    }

    if (!data.email) {
      throw new BadRequestError("Email é obrigatório");
    }

    // Verificar se email já existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError(`Email ${data.email} já está em uso`);
    }

    // Preparar conexões para roles
    const roleConnections = [];

    if (data.roleIds && data.roleIds.length > 0) {
      // Se roleIds fornecido, conectar aos IDs específicos
      for (const roleId of data.roleIds) {
        roleConnections.push({ id: roleId });
      }
    } else {
      // Caso contrário, conectar ao role padrão (assumindo role 'user' com ID 1)
      roleConnections.push({ id: 1 });
    }

    // Criar usuário
    const user = await this.prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        profileImageUrl: data.profileImageUrl,
        isActive: true,
        roles: {
          connect: roleConnections,
        },
      },
      include: {
        roles: true,
      },
    });

    return {
      ...user,
      roles: user.roles,
      lastLogin: user.lastLogin || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
    };
  }

  async update(id: number, data: UpdateUserDto): Promise<UserResponseDto> {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Se estiver atualizando o email, verificar se já está em uso
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        throw new BadRequestError(`Email ${data.email} já está em uso`);
      }
    }

    // Preparar dados para atualização
    const updateData: any = {
      ...(data.name && { name: data.name.trim() }),
      ...(data.email && { email: data.email.trim().toLowerCase() }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
      ...(data.profileImageUrl !== undefined && {
        profileImageUrl: data.profileImageUrl,
      }),
    };

    // Atualizar roles se fornecidos
    const updateOptions: any = {
      data: updateData,
      include: { roles: true },
    };

    if (data.roleIds && data.roleIds.length > 0) {
      // Desconectar todas as roles atuais e reconectar as novas
      updateOptions.data.roles = {
        set: [],
        connect: data.roleIds.map((id) => ({ id })),
      };
    }

    // Atualizar usuário
    const user = await this.prisma.user.update({
      where: { id },
      include: { roles: true },

      ...updateOptions,
    });

    return {
      ...user,
      roles: [],
      lastLogin: user.lastLogin || undefined,
      profileImageUrl: user.profileImageUrl || undefined,
    };
  }

  async delete(id: number): Promise<void> {
    // Verificar se usuário existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }

    // Em vez de excluir permanentemente, fazemos um "soft delete"
    // atualizando o campo isActive para false
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
