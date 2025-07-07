import { Injectable } from '@nestjs/common'
import { Repository, DataSource } from 'typeorm'
import { IUserRepositories } from '../domain/repositories/IUser.repositories'
import { CreateUserDTO } from '../domain/dto/create-user.dto'
import { updateUserDTO } from '../domain/dto/update-user.dto'
import { User } from '../domain/entities/user.entity'

@Injectable()
export class UserRepositories implements IUserRepositories {
  private readonly repository: Repository<User>

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User)
  }

  async findAll(offSet: number, limit: number): Promise<User[]> {
    return this.repository.find({
      skip: offSet,
      take: limit,
    })
  }

  async findById(id: number): Promise<User | null> {
    return this.repository.findOneBy({ id })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOneBy({ email })
  }

  async create(data: CreateUserDTO): Promise<User> {
    const user = this.repository.create(data)
    return this.repository.save(user)
  }

  async update(id: number, data: updateUserDTO): Promise<User> {
    await this.repository.update(id, data)
    return this.findById(id) as Promise<User>
  }

  async delete(id: number): Promise<User> {
    const user = await this.findById(id)
    if (user) {
      await this.repository.remove(user)
    }
    return user as User
  }

  countUsers(): Promise<number> {
    return this.repository.count()
  }
}
