import createNotificationMessage from './notificationMessage';

describe('generate notification message', () => {
  it('should generate message when slug is expense', () => {
    const result = createNotificationMessage(
      'expense',
      90000,
      'dummy source wallet',
      'dummy destination wallet',
      'test',
    );

    expect(result).toBe('You have spent Rp 90.000 for test');
  });

  it('should generate message when slug is payment', () => {
    const result = createNotificationMessage(
      'payment',
      90000,
      'dummy source wallet',
      'dummy destination wallet',
      'test',
    );

    expect(result).toBe('You have spent Rp 90.000 for test');
  });

  it('should generate message when slug is top up', () => {
    const result = createNotificationMessage(
      'top up',
      90000,
      'dummy source wallet',
      'dummy destination wallet',
      'test',
    );

    expect(result).toBe('You have received Rp 90.000 from test');
  });

  it('should generate message when slug is transfer', () => {
    const result = createNotificationMessage(
      'transfer',
      90000,
      'dummy source wallet',
      'dummy destination wallet',
      'test',
    );

    expect(result).toBe(
      'You have transfered Rp 90.000 from dummy source wallet to dummy destination wallet for test',
    );
  });
});
