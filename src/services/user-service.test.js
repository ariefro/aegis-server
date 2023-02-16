import { hashSync } from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models';
import UserService from './user-service';

const mockUser = {
  id: 'ae2cff11-9661-48e8-a51e-5b19b8b90633',
  username: 'johndoe',
  password: hashSync('password', 10),
  email: 'johndoe@example.com',
  token_version: 0,
  refresh_token: 'refresh_token',
};

describe('getUsers function', () => {
  afterEach(() => {
    User.findAll.mockReset();
  });

  it('should return all users', async () => {
    const mockUsers = [
      {
        username: 'johndoe',
        password: hashSync('password', 10),
        email: 'johndoe@example.com',
      },
      {
        username: 'janedoe',
        password: hashSync('password', 10),
        email: 'janedoe@example.com',
      },
      {
        username: 'alicesmith',
        password: hashSync('password', 10),
        email: 'alice@example.com',
      },
    ];

    jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers);
    const result = await UserService.getUsers();

    expect(result).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array if no user found', async () => {
    const mockUsers = [];

    jest.spyOn(User, 'findAll').mockResolvedValue(mockUsers);
    const result = await UserService.getUsers();

    expect(result).toEqual(mockUsers);
    expect(User.findAll).toHaveBeenCalledTimes(1);
  });
});

describe('getUserByUsername function', () => {
  afterEach(() => {
    User.findOne.mockReset();
  });

  it('should return user with matching username', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    const result = await UserService.getUserByUsername({ username: 'johndoe' });

    expect(result).toHaveProperty('username', 'johndoe');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'johndoe' } });
  });

  it('should return null if no user found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const result = await UserService.getUserByUsername({ username: 'dummy' });

    expect(result).toBeNull();
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'dummy' } });
  });
});

describe('getUserByUsernameOrEmail function', () => {
  afterEach(() => {
    User.findOne.mockReset();
  });

  it('should return user with matching username', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
    const result = await UserService.getUserByUsernameOrEmail({ username: 'johndoe' });

    expect(result).toHaveProperty('username', 'johndoe');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { [Op.or]: [{ username: 'johndoe' }, { email: undefined }] } });
  });

  it('should return user with matching email', async () => {
    const mockUsers = {
      username: 'johndoe',
      password: hashSync('password', 10),
      email: 'johndoe@example.com',
    };

    jest.spyOn(User, 'findOne').mockResolvedValue(mockUsers);
    const result = await UserService.getUserByUsernameOrEmail({ email: 'johndoe@example.com' });

    expect(result).toHaveProperty('email', 'johndoe@example.com');
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { [Op.or]: [{ username: undefined }, { email: 'johndoe@example.com' }] } });
  });

  it('should return null if no user found', async () => {
    jest.spyOn(User, 'findOne').mockResolvedValue(null);
    const result = await UserService.getUserByUsername({ username: 'dummy' });

    expect(result).toBeNull();
    expect(User.findOne).toHaveBeenCalledTimes(1);
    expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'dummy' } });
  });
});
