import { Test, TestingModule } from '@nestjs/testing';
import { UploadAvatarUserService } from './uploadAvatarUser.service';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';
jest.mock('fs/promises');

describe('UploadAvatarUserService', () => {
  let service: UploadAvatarUserService;
  let userRepo: { update: jest.Mock, findById: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      update: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadAvatarUserService,
        { provide: USER_REPOSITORIES_TOKEN, useValue: userRepo },
      ],
    }).compile();

    service = module.get(UploadAvatarUserService);
  });

  it('deve atualizar o avatar do usuário', async () => {
    userRepo.findById.mockResolvedValue({ id: 1, name: 'User' });
    userRepo.update.mockResolvedValue({ id: 1, name: 'User', avatar: 'avatar.jpg' });

    const result = await service.execute(1, 'avatar.jpg');

    expect(userRepo.update).toHaveBeenCalledWith(1, { avatar: 'avatar.jpg' });
    expect(result).toEqual(expect.objectContaining({ avatar: 'avatar.jpg' }));
  });

  it('deve lançar erro se usuário não existir', async () => {
    userRepo.findById.mockResolvedValue(null);

    await expect(service.execute(2, 'avatar.jpg')).rejects.toThrow();
  });
});