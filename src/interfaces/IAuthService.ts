export interface LoginDto {
    email: string;
    password: string;
  }
  
  export interface AuthResponseDto {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      roles: string[];
    };
  }
  
  export interface IAuthService {
    login(credentials: LoginDto): Promise<AuthResponseDto>;
    validateToken(token: string): Promise<any>;
  }
  