import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const repository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  let service: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(repository as any);
  });

  it('registers a user with a bcrypt hash and omits the password from the response', async () => {
    repository.create.mockImplementation((user) => ({ id: 'user-id', ...user }));
    repository.save.mockImplementation(async (user) => user);

    const user = await service.register({
      name: 'Test User',
      email: 'test.user@example.invalid',
      password: 'test-password',
    });

    const persistedPassword = repository.create.mock.calls[0][0].password;
    expect(persistedPassword).not.toBe('test-password');
    expect(bcrypt.compareSync('test-password', persistedPassword)).toBe(true);
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(user).not.toHaveProperty('password');
  });

  it('logs in with valid credentials without exposing the password', async () => {
    const passwordHash = bcrypt.hashSync('test-password', 10);
    repository.findOne.mockResolvedValue({
      id: 'user-id',
      name: 'Test User',
      email: 'test.user@example.invalid',
      password: passwordHash,
    });

    const user = await service.login({
      email: 'test.user@example.invalid',
      password: 'test-password',
    });

    expect(user).toMatchObject({ id: 'user-id', email: 'test.user@example.invalid' });
    expect(user).not.toHaveProperty('password');
  });

  it('rejects an invalid password', async () => {
    repository.findOne.mockResolvedValue({
      id: 'user-id',
      email: 'test.user@example.invalid',
      password: bcrypt.hashSync('test-password', 10),
    });

    await expect(
      service.login({ email: 'test.user@example.invalid', password: 'incorrect-password' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
