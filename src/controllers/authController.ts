import { 
  Body, 
  Controller, 
  Post, 
  Route, 
  Tags, 
  Response,
  Example
} from "tsoa";
import { inject, injectable } from "tsyringe";
import { IAuthService } from "../interfaces/IAuthService";
import { LoginDto, AuthResponseDto } from "../interfaces/IAuthService";
import { BadRequestError, UnauthorizedError } from "../middlewares/errorHandler";

@Route("auth")
@Tags("Authentication")
@injectable()
export class AuthController extends Controller {
  constructor(@inject("IAuthService") private authService: IAuthService) {
    super();
  }

  /**
   * Autentica um usuário e retorna um token JWT
   */
  @Post("/login")
  @Response<BadRequestError>(400, "Dados de entrada inválidos")
  @Response<UnauthorizedError>(401, "Credenciais inválidas")
  @Example<AuthResponseDto>({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      roles: ["admin"]
    }
  })
  public async login(@Body() credentials: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(credentials);
  }
}
