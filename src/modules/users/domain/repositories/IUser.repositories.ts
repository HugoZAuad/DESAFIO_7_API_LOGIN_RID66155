import { CreateUserDTO } from '../dto/create-user.dto'
import { updateUserDTO } from '../dto/update-user.dto'
import { User } from '../entities/user.entity'

export interface IUserRepositories {
  findAll(offSet: number, limit: number): Promise<User[]>
  findById(id: number): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserDTO): Promise<User>
  update(id: number, data: updateUserDTO): Promise<User>
  delete(id: number): Promise<User>
}