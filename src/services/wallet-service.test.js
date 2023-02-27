import { Op } from 'sequelize';
import { Wallet, CashFlow } from '../models';
import WalletService from './wallet-service';

const userId = 'ae2cff11-9661-48e8-a51e-5b19b8b90633';

describe('Get Wallets', () => {
  afterEach(() => {
    Wallet.findAll.mockReset();
  });

  it("should return all of the user's wallet accounts", async () => {
    const expectedResult = [
      {
        id: '3b1b22e7-65e6-4106-b5a4-81a09430ae4d',
        name: 'cash 1',
        status: 'active',
        currency: 'IDR',
        balance: 10000,
      },
      {
        id: '9f2f2193-53c4-4c50-a1b4-e47a916981fa',
        name: 'cash 3',
        status: 'active',
        currency: 'IDR',
        balance: 9000,
      },
    ];

    const spyGetWallets = jest
      .spyOn(Wallet, 'findAll')
      .mockResolvedValue(expectedResult);

    const result = await WalletService.getWallets(userId);

    expect(spyGetWallets).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: { user_id: userId },
      attributes: { exclude: ['cash_flow_id', 'user_id'] },
    });
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array if no wallets found for a given user id', async () => {
    const spyGetWallets = jest.spyOn(Wallet, 'findAll').mockResolvedValue([]);

    const result = await WalletService.getWallets(userId);

    expect(spyGetWallets).toHaveBeenCalledTimes(1);
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: { user_id: userId },
      attributes: { exclude: ['cash_flow_id', 'user_id'] },
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});

describe('Get Wallet By ID', () => {
  afterEach(() => {
    Wallet.findOne.mockReset();
  });

  const expectedResult = {
    id: 'b426a3df-d5e4-4aab-bdb5-7f234a4a2ee8',
    name: 'cash',
    status: 'active',
    currency: 'IDR',
    balance: 10000,
    total: {
      income: 12000,
      expense: 6000,
    },
  };

  it('should return a wallet account with a user ID and wallet ID that match.', async () => {
    const spyGetWalletById = jest
      .spyOn(Wallet, 'findOne')
      .mockResolvedValue(expectedResult);

    const result = await WalletService.getWalletByID(
      userId,
      'b426a3df-d5e4-4aab-bdb5-7f234a4a2ee8',
    );

    expect(spyGetWalletById).toHaveBeenCalledTimes(1);
    expect(Wallet.findOne).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        [Op.and]: { id: 'b426a3df-d5e4-4aab-bdb5-7f234a4a2ee8' },
      },
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: CashFlow,
          as: 'total',
          attributes: ['income', 'expense'],
        },
      ],
    });
    expect(typeof result).toBe('object');
    expect(result).toEqual(expectedResult);
  });

  it("should return null if no wallet's found", async () => {
    const spyGetWalletById = jest
      .spyOn(Wallet, 'findOne')
      .mockResolvedValue(null);

    const result = await WalletService.getWalletByID(
      userId,
      'b426a3df-d5e4-4aab-bdb5-7f234a4a2ee9',
    );

    expect(spyGetWalletById).toHaveBeenCalledTimes(1);
    expect(Wallet.findOne).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        [Op.and]: { id: 'b426a3df-d5e4-4aab-bdb5-7f234a4a2ee9' },
      },
      attributes: { exclude: ['user_id'] },
      include: [
        {
          model: CashFlow,
          as: 'total',
          attributes: ['income', 'expense'],
        },
      ],
    });
    expect(result).toBeNull();
  });
});
