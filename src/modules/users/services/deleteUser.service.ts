import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IUserRepositories } from '../domain/repositories/IUser.repositories'
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens'

@Injectable()
export class DeleteUserService {
  constructor(
    @Inject(USER_REPOSITORIES_TOKEN)
    private readonly userRepositories: IUserRepositories,
  ) {}

  async execute(id: number) {
    const user = await this.userRepositories.findById(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    return this.userRepositories.delete(id)
  }
}
