import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './createUser.service';
import { BadRequestException } from '@nestjs/common';
import { USER_REPOSITORIES_TOKEN } from '../utils/repositoriesUser.Tokens';
import { CreateUserDTO } from '../domain/dto/create-user.dto';
import * as bcrypt from 'bcrypt';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let userRepo: { findByEmail: jest.Mock; create: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: USER_REPOSITORIES_TOKEN,
          useValue: userRepo,
        },
      ],
    }).compile();

    service = module.get(CreateUserService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve lançar exceção se e-mail já estiver cadastrado', async () => {
    userRepo.findByEmail.mockResolvedValue({ id: 1, email: 'existente@mail.com' });

    const dto: CreateUserDTO = {
      name: 'Novo Usuário',
      email: 'existente@mail.com',
      password: '123456',
      username: 'Novo Usuário'
    };

    await expect(service.execute(dto)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('deve criar um novo usuário com senha criptografada', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    userRepo.create.mockImplementation(user => ({
      id: 1,
      ...user,
    }));

    const dto: CreateUserDTO = {
      name: 'Novo',
      email: 'novo@teste.com',
      password: 'senhaSegura',
      username: 'Novo Usuário'
    };

    const resultado = await service.execute(dto);

    expect(userRepo.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepo.create).toHaveBeenCalled();
    expect(await bcrypt.compare('senhaSegura', resultado.password)).toBe(true);
    expect(resultado).toEqual(expect.objectContaining({ id: 1, email: dto.email }));
  });
});