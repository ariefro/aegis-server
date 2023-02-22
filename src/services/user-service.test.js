import { compareSync, hashSync } from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models';
import Jwt from '../utils/jwt';
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

describe('registerUser function', () => {
  afterEach(() => {
    User.create.mockReset();
  });

  it('should create a new user', async () => {
    const password = 'password';

    jest.spyOn(User, 'create').mockResolvedValue(mockUser);
    const result = await UserService.registerUser(mockUser);

    expect(result.username).toEqual('johndoe');
    expect(result.email).toEqual('johndoe@example.com');
    expect(compareSync(password, result.password)).toBe(true);
    expect(User.create).toHaveBeenCalledTimes(1);
  });
});

describe('loginUser function', () => {
  const password = 'password';
  const invalidPassword = 'invalid-password';
  const user = {
    username: 'johndoe',
    password: hashSync(password, 10),
    email: 'johndoe@example.com',
  };

  beforeAll(() => {
    jest.spyOn(UserService, 'generateAccessToken').mockResolvedValue('access-token');
  });

  it('returns an access token if user credentials are valid', async () => {
    const token = await UserService.loginUser({ user, password });
    expect(token).toBe('access-token');
  });

  it('throws an error if the user is invalid', async () => {
    await expect(UserService.loginUser({ user: null, password })).rejects.toThrow('Username or password is incorrect');
  });

  it('throws an error if the password is invalid', async () => {
    await expect(UserService.loginUser({ user, password: invalidPassword })).rejects.toThrow('Username or password is incorrect');
  });

  afterAll(() => {
    UserService.generateAccessToken.mockRestore();
  });
});

describe('tokenVersionChecker', () => {
  beforeAll(() => {
    jest.spyOn(UserService, 'generateAccessToken').mockResolvedValue('access-token');
  });

  afterAll(() => {
    UserService.generateAccessToken.mockReset();
  });

  it('should generate an access token', async () => {
    const token = await UserService.tokenVersionChecker(mockUser, 0);

    expect(token).toBe('access-token');
  });

  it('should return token version not valid', async () => {
    await expect(UserService.tokenVersionChecker(mockUser, 1)).rejects.toThrow('Token version not valid');
  });
});

describe('generateAccessToken function', () => {
  const jwtSignSpy = jest.spyOn(Jwt, 'sign').mockResolvedValue('example-token');
  it('should generate an access token', async () => {
    const token = await UserService.generateAccessToken(mockUser);

    expect(token).toBe('example-token');
    expect(jwtSignSpy).toHaveBeenCalledTimes(1);
  });
});

describe('generateRefreshToken function', () => {
  const jwtSignRefreshTokenSpy = jest.spyOn(Jwt, 'signRefreshToken').mockResolvedValue('refresh-token');
  it('should generate a refresh token', async () => {
    const token = await UserService.generateRefreshToken(mockUser);

    expect(token).toBe('refresh-token');
    expect(jwtSignRefreshTokenSpy).toHaveBeenCalledTimes(1);
  });
});

describe('updateToken', () => {
  it('should update refresh token for a given user', async () => {
    const newRefreshToken = 'new_refresh_token';
    const updatedMockUser = {
      id: 'ae2cff11-9661-48e8-a51e-5b19b8b90633',
      username: 'johndoe',
      password: hashSync('password', 10),
      email: 'johndoe@example.com',
      token_version: 0,
      refresh_token: 'new_refresh_token',
    };

    jest.spyOn(UserService, 'updateToken').mockResolvedValue(updatedMockUser);
    const result = await UserService.updateToken(mockUser.username, newRefreshToken);

    expect(result.refresh_token).toEqual(updatedMockUser.refresh_token);
  });
});

describe('updateTokenVersion', () => {
  it('should update token version for a given user', async () => {
    const newTokenVersion = 1;
    const updatedMockUser = {
      id: 'ae2cff11-9661-48e8-a51e-5b19b8b90633',
      username: 'johndoe',
      password: hashSync('password', 10),
      email: 'johndoe@example.com',
      token_version: 1,
      refresh_token: 'new_refresh_token',
    };

    jest.spyOn(UserService, 'updateTokenVersion').mockResolvedValue(updatedMockUser);
    const result = await UserService.updateTokenVersion(mockUser.username, newTokenVersion);

    expect(result.token_version).toEqual(updatedMockUser.token_version);
  });
});
