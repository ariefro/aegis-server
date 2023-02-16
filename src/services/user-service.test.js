import { hashSync } from 'bcrypt';
import { User } from '../models';
import UserService from './user-service';

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
