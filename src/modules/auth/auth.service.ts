import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { User } from "../users/domain/entities/user.entity"
import { AuthLoginDTO } from "./domain/dto/authLogin.dto"
import * as bcrypt from "bcrypt"
import { CreateUserDTO } from '../users/domain/dto/create-user.dto'
import { AuthRegisterDTO } from './domain/dto/authRegister.dto'
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto'
import { ValidateTokenDTO } from './domain/dto/validateToken.dto'
import { MailerService } from '@nestjs-modules/mailer'
import { templateHTML } from './domain/utils/templateHtml'
import { CreateUserService } from "../users/services/createUser.service"
import { FindUserByEmailService } from "../users/services/findUserByEmail.service"
import { UpdateUserService } from "../users/services/updateUser.service"

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly createUserService: CreateUserService,
    private readonly findUserByEmailService: FindUserByEmailService,
    private readonly updateUserService: UpdateUserService,
    private readonly mailerService: MailerService
  ) { }

  async generateJwtToken(user: User, expiresIn: string = '1d') {
    const payload = { sub: user.id, name: user.name }
    const options = { expiresIn: expiresIn, issuer: 'dnc_hotel', audience: 'users' }
    return { access_token: await this.jwtService.signAsync(payload, options) }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.findUserByEmailService.findByEmail(email)
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('E-mail ou password está incorreto')
    }

    return await this.generateJwtToken(user)
  }

  async register(body: AuthRegisterDTO) {
    const newUser: CreateUserDTO = {
      email: body.email,
      name: body.name,
      username: body.username,
      password: body.password,
    }
    const user = await this.createUserService.execute(newUser)
    return await this.generateJwtToken(user)
  }

  async reset({ token, password }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token)
    if (!valid || !decoded) throw new UnauthorizedException('Token inválido')

    const user: User = await this.updateUserService.execute(Number(decoded.sub), { password })
    return await this.generateJwtToken(user)
  }

  async forgot(email: string) {
    const user = await this.findUserByEmailService.findByEmail(email)
    if (!user) throw new UnauthorizedException('E-mail está incorreto')

    const token = await this.generateJwtToken(user, '30m')

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password - DNC Hotel',
      html: templateHTML(user.name, token.access_token),
    })

    return `O código de verificação foi enviado para o seu ${email}`
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'dnc_hotel',
        audience: 'users',
      })
      return { valid: true, decoded }

    } catch (error) {
      return { valid: false, message: error.message }
    }
  }
}
