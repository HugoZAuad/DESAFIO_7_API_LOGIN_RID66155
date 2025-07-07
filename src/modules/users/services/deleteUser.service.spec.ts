import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserService } from './deleteUser.service';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
  let userRepo: { delete: jest.Mock, findById: jest.Mock };

  beforeEach(async () => {
    userRepo = { delete: jest.fn(), findById: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        { provide: USER_REPOSITORIES_TOKEN, useValue: userRepo },
      ],
    }).compile();

    service = module.get(DeleteUserService);
  });

  it('deve deletar usuário', async () => {
    userRepo.findById.mockResolvedValue({ id: 1, name: 'Usuário Excluído' });
    userRepo.delete.mockResolvedValue({ id: 1, name: 'Usuário Excluído' });

    const resultado = await service.execute(1);

    expect(userRepo.delete).toHaveBeenCalledWith(1);
    expect(resultado).toEqual(expect.objectContaining({ id: 1 }));
  });
});