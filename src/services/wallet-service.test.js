import { Op } from 'sequelize';
import { Wallet, CashFlow } from '../models';
import WalletService from './wallet-service';

const userId = 'ae2cff11-9661-48e8-a51e-5b19b8b90633';
const walletId = '56568ac0-19c0-4186-b66d-adf2098c8083';

describe('getWallets function', () => {
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
      attributes: { exclude: ['cash_flow_id', 'user_id', 'status', 'currency', 'balance', 'created_at'] },
    });
    expect(result).toEqual(expectedResult);
  });

  it('should return an empty array if no wallets found for a given user id', async () => {
    const spyGetWallets = jest.spyOn(Wallet, 'findAll').mockResolvedValue([]);

    const result = await WalletService.getWallets(userId);

    expect(spyGetWallets).toHaveBeenCalledTimes(1);
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: { user_id: userId },
      attributes: { exclude: ['cash_flow_id', 'user_id', 'status', 'currency', 'balance', 'created_at'] },
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});

describe('getWalletByID function', () => {
  afterEach(() => {
    Wallet.findOne.mockReset();
  });

  const expectedResult = {
    id: walletId,
    name: 'cash 2',
    status: 'active',
    currency: 'IDR',
    balance: 25000,
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
      walletId,
    );

    expect(spyGetWalletById).toHaveBeenCalledTimes(1);
    expect(Wallet.findOne).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        [Op.and]: { id: walletId },
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

describe('getOtherWallets function', () => {
  afterEach(() => {
    Wallet.findAll.mockReset();
  });

  it('should return an array of wallets excluding the specified wallet', async () => {
    const expectedResult = [
      {
        id: '3b1b22e7-65e6-4106-b5a4-81a09430ae4d',
        name: 'cash 1',
        status: 'active',
      },
      {
        id: '9f2f2193-53c4-4c50-a1b4-e47a916981fa',
        name: 'cash 3',
        status: 'active',
      },
    ];

    const spyGetOtherWallets = jest
      .spyOn(Wallet, 'findAll')
      .mockResolvedValue(expectedResult);

    const otherWallets = await WalletService.getOtherWallets(userId, walletId);

    expect(spyGetOtherWallets).toHaveBeenCalledTimes(1);
    expect(otherWallets).toHaveLength(2);
    expect(otherWallets[0]).toMatchObject({
      id: '3b1b22e7-65e6-4106-b5a4-81a09430ae4d',
      name: 'cash 1',
      status: 'active',
    });
    expect(otherWallets[1]).toMatchObject({
      id: '9f2f2193-53c4-4c50-a1b4-e47a916981fa',
      name: 'cash 3',
      status: 'active',
    });
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        id: {
          [Op.not]: walletId,
        },
      },
      attributes: { exclude: ['user_id', 'balance', 'currency', 'created_at'] },
    });
  });

  it('should return an empty array if no other wallets are found', async () => {
    const spyGetOtherWallets = jest.spyOn(Wallet, 'findAll').mockResolvedValue([]);

    const result = await WalletService.getOtherWallets(userId, walletId);

    expect(spyGetOtherWallets).toHaveBeenCalledTimes(1);
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: {
        user_id: userId,
        id: {
          [Op.not]: walletId,
        },
      },
      attributes: { exclude: ['user_id', 'balance', 'currency', 'created_at'] },
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });
});

describe('addWallet function', () => {
  afterEach(() => {
    Wallet.create.mockReset();
  });

  it('should create a new wallet', async () => {
    const addWalletRequest = {
      name: 'My Wallet',
      balance: 0,
      currency: 'IDR',
      userID: userId,
      cashFlowID: '1731c479-e5a6-4dd2-a50a-02778275b760',
    };

    const expectedResult = {
      id: '75f481e0-7a34-4c1f-a519-860f05d2592a',
      user_id: userId,
      cash_flow_id: '1731c479-e5a6-4dd2-a50a-02778275b760',
      name: 'My Wallet',
      currency: 'IDR',
      balance: 0,
      status: 'active',
    };

    const spyAddWallet = jest.spyOn(Wallet, 'create').mockResolvedValue(expectedResult);
    const result = await WalletService.addWallet(addWalletRequest);

    expect(spyAddWallet).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      name: addWalletRequest.name,
      balance: addWalletRequest.balance,
      currency: addWalletRequest.currency,
      user_id: addWalletRequest.userID,
      cash_flow_id: addWalletRequest.cashFlowID,
    });
    expect(typeof result).toBe('object');
    expect(result).toEqual(expectedResult);
  });
});
