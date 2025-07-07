import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { IUserRepositories } from '../domain/repositories/IUser.repositories'
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens'
import { join, resolve } from 'path'
import { stat, unlink } from 'fs/promises'

@Injectable()
export class UploadAvatarUserService {
  constructor(
    @Inject(USER_REPOSITORIES_TOKEN)
    private readonly userRepositories: IUserRepositories,
  ) {}

  async execute(id: number, avatarFilename: string) {
    const user = await this.userRepositories.findById(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }
    const directory = resolve(__dirname, '..', '..', '..', 'uploads')
    if (user.avatar) {
      const userAvatarFilePath = join(directory, user.avatar)
      const userAvatarFileExists = await stat(userAvatarFilePath).catch(() => null)
      if (userAvatarFileExists) {
        await unlink(userAvatarFilePath)
      }
    }
    
    return this.userRepositories.update(id, { avatar: avatarFilename } as any)
  }
}
