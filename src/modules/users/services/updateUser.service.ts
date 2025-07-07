import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { updateUserDTO } from '../domain/dto/update-user.dto'
import { IUserRepositories } from '../domain/repositories/IUser.repositories'
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens'
import * as bcrypt from 'bcrypt'

@Injectable()
export class UpdateUserService {
  constructor(
    @Inject(USER_REPOSITORIES_TOKEN)
    private readonly userRepositories: IUserRepositories,
  ) {}

  async execute(id: number, updateUserDto: updateUserDTO) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10)
    }
    const user = await this.userRepositories.findById(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    return this.userRepositories.update(id, updateUserDto)
  }
}
