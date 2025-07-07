import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IUserRepositories } from '../domain/repositories/IUser.repositories'
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens'
import { User } from '../domain/entities/user.entity'

@Injectable()
export class FindUserByEmailService {
  execute(arg0: string) {
    throw new Error('Method not implemented.')
  }
  constructor(
    @Inject(USER_REPOSITORIES_TOKEN)
    private readonly userRepositories: IUserRepositories
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepositories.findByEmail(email)
    if (!user) {
      throw new NotFoundException('Usuário não existe')
    }
    return user
  }
}
