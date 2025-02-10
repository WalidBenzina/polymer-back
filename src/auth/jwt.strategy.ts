import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/user/user.entity'
import { UserService } from 'src/user/user.service'

export interface JwtPayload {
  email: string
  sub: string
  role: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'polymer',
    })
  }

  async validate(payload: JwtPayload): Promise<User> {
    return this.authService.findUserById(payload.sub)
  }
}
