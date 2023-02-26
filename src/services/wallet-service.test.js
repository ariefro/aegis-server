import { Wallet } from '../models';
import WalletService from './wallet-service';

describe('get wallets function', () => {
  afterEach(() => {
    Wallet.findAll.mockReset();
  });

  it("should return all of the user's wallet accounts", async () => {
    const userId = 'ae2cff11-9661-48e8-a51e-5b19b8b90633';

    const mockWallets = [
      {
        user_id: userId,
        name: 'cash 1',
        status: 'active',
        currency: 'IDR',
        balance: 10000,
      },
      {
        user_id: 'c4e541ad-56aa-4a40-8778-1c0c216b4a3d',
        name: 'cash 2',
        status: 'active',
        currency: 'IDR',
        balance: 2000,
      },
      {
        user_id: userId,
        name: 'cash 3',
        status: 'active',
        currency: 'IDR',
        balance: 9000,
      },
    ];

    const spyGetWallets = jest
      .spyOn(Wallet, 'findAll')
      .mockResolvedValue([mockWallets[0], mockWallets[2]]);

    const result = await WalletService.getWallets(userId);

    expect(spyGetWallets).toHaveBeenCalledTimes(1);
    expect(Array.isArray(result)).toBe(true);
    expect(Wallet.findAll).toHaveBeenCalledWith({
      where: { user_id: userId },
      attributes: { exclude: ['cash_flow_id', 'user_id'] },
    });
    expect(result).toEqual([
      {
        user_id: userId,
        name: 'cash 1',
        status: 'active',
        currency: 'IDR',
        balance: 10000,
      },
      {
        user_id: userId,
        name: 'cash 3',
        status: 'active',
        currency: 'IDR',
        balance: 9000,
      },
    ]);
  });

  it('should return an empty array if no wallets found for a given user id', async () => {
    const userId = 'ae2cff11-9661-48e8-a51e-5b19b8b90633';
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
