import { Test, TestingModule } from '@nestjs/testing'
import { FindAllUserService } from './findAllUser.service'
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens'

describe('FindAllUserService', () => {
  let service: FindAllUserService
  let userRepo: { findAll: jest.Mock }

  beforeEach(async () => {
    userRepo = {
      findAll: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUserService,
        { provide: USER_REPOSITORIES_TOKEN, useValue: userRepo },
      ],
    }).compile()

    service = module.get(FindAllUserService)
  })

  it('deve retornar todos os usuários com os campos definidos', async () => {
    const usuariosMock = [{ id: 1, email: 'a@b.com' }]
    userRepo.findAll.mockResolvedValue(usuariosMock)

    const resultado = await service.findAll(0, 10)

    expect(userRepo.findAll).toHaveBeenCalledWith(0, 10)
    expect(resultado).toEqual(usuariosMock)
  })
})