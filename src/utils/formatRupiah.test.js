import rupiah from './formatRupiah';

describe('format rupiah currency', () => {
  it('should format number to rupiah currency correctly', () => {
    const result = rupiah(10000);

    expect(result).toBe('Rp 10.000');
  });

  it('should format number to rupiah currency correctly', () => {
    const result = rupiah(9210215);

    expect(result).toBe('Rp 9.210.215');
  });

  it('should return RpNan if parameter is not number', () => {
    const result = rupiah('abc');

    expect(result).toBe('RpNaN');
  });
});
