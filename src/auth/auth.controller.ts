import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'
import { LoginDto } from './dto/login.dto'
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiOperation({ summary: 'Register a new user.' })
  async register(@Body() registerDto: RegisterDto): Promise<{
    idUtilisateur: string
    nomUtilisateur: string
    email: string
    statut: string
    role: {
      idRole: string
      nomRole: string
      permissions: string[]
    }
    idClient: {
      idClient: string
      nomClient: string
      email: string
      adresse: string
      telephone: string
      statut: string
    } | null
  }> {
    return this.authService.register(registerDto)
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiOperation({ summary: 'Authenticate a user and return a token.' })
  async login(@Body() loginDto: LoginDto): Promise<{ access_token: string }> {
    return this.authService.login(loginDto)
  }
}
