import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUserService } from './findAllUser.service';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';

describe('FindAllUserService', () => {
  let service: FindAllUserService;
  let userRepo: { findAll: jest.Mock };

  beforeEach(async () => {
    userRepo = { findAll: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUserService,
        { provide: USER_REPOSITORIES_TOKEN, useValue: userRepo },
      ],
    }).compile();

    service = module.get(FindAllUserService);
  });

  it('deve retornar todos os usuários', async () => {
    userRepo.findAll.mockResolvedValue([{ id: 1, name: 'User' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ id: 1, name: 'User' }]);
  });
});