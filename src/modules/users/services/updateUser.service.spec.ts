import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserService } from './updateUser.service';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';
import * as bcrypt from 'bcrypt';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let userRepo: { update: jest.Mock, findById: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: USER_REPOSITORIES_TOKEN,
          useValue: userRepo,
        },
      ],
    }).compile();

    service = module.get(UpdateUserService);
  });

  it('deve atualizar usuário com senha criptografada', async () => {
    userRepo.findById.mockResolvedValue({ id: 1, name: 'Atualizado' });
    userRepo.update.mockImplementation((id, data) => ({
      id,
      ...data,
    }));

    const dto = { name: 'Atualizado', password: 'novaSenha' };

    const result = await service.execute(1, dto);

    expect(userRepo.update).toHaveBeenCalledWith(1, {
      name: 'Atualizado',
      password: expect.any(String),
    });
    expect(result.id).toBe(1);
    expect(await bcrypt.compare('novaSenha', result.password)).toBe(true);
  });
});