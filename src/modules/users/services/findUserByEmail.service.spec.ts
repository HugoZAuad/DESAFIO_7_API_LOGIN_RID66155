import { Test, TestingModule } from '@nestjs/testing';
import { FindUserByEmailService } from './findUserByEmail.service';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';
import { NotFoundException } from '@nestjs/common';

describe('FindUserByEmailService', () => {
  let service: FindUserByEmailService;
  let userRepo: { findByEmail: jest.Mock };

  beforeEach(async () => {
    userRepo = { findByEmail: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailService,
        { provide: USER_REPOSITORIES_TOKEN, useValue: userRepo },
      ],
    }).compile();

    service = module.get(FindUserByEmailService);
  });

  it('deve retornar usuário pelo email', async () => {
    userRepo.findByEmail.mockResolvedValue({ id: 1, email: 'user@teste.com' });
    const result = await service.findByEmail('user@teste.com');
    expect(result).toEqual({ id: 1, email: 'user@teste.com' });
  });

  it('deve lançar NotFoundException se usuário não existir', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    await expect(service.findByEmail('naoexiste@teste.com')).rejects.toThrow(NotFoundException);
  });
});