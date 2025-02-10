import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../user/user.entity'
import { Role } from 'src/role/role.entity'
import { Client } from 'src/client/client.entity'
import { UserService } from 'src/user/user.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Client]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'polymer',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
  exports: [AuthService, PassportModule, TypeOrmModule, JwtModule],
})
export class AuthModule {}
