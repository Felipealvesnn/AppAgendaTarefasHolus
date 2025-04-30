export interface User {
  id?: number;
  name?: string;
  email?: string;
  roles?: Role[]; // Ex: ['admin', 'editor', 'viewer']
  isActive?: boolean; // Está com a conta ativa?
  createdAt?: Date; // Quando foi criado
  updatedAt?: Date; // Última atualização
  lastLogin?: Date; // Último login (opcional)
  profileImageUrl?: string; // URL da imagem de perfil (opcional)
}

export interface Role {
  id?: number;
  name?: string;
}
