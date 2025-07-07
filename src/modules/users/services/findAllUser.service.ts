import { Inject, Injectable } from "@nestjs/common"
import { IUserRepositories } from "../domain/repositories/IUser.repositories"
import { USER_REPOSITORIES_TOKEN } from "../utils/repositoriesUser.Tokens"

@Injectable()
export class FindAllUserService {
  constructor(
    @Inject(USER_REPOSITORIES_TOKEN)
    private readonly userRepositories: IUserRepositories
  ) {}

  async findAll(offset = 0, limit = 10) {
    return this.userRepositories.findAll(offset, limit)
  }
}