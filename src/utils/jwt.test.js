import jwt from 'jsonwebtoken';
import Jwt from './jwt';

describe('Jwt sign', () => {
  const payload = { userId: '123' };

  it('should return a token with the correct payload', () => {
    process.env.SECRET = 'secret';

    const expectedToken = jwt.sign(payload, process.env.SECRET, Jwt.OPTIONS);
    const actualToken = Jwt.sign(payload);

    expect(actualToken).toEqual(expectedToken);
  });

  it('should throw an error if the secret key is missing', () => {
    process.env.SECRET = '';

    expect(() => Jwt.sign(payload)).toThrow('Missing secret key');
  });
});

describe('Jwt sign refresh token', () => {
  const payload = { userId: '123' };

  it('should return a token with the correct payload', () => {
    process.env.REFRESH_SECRET = 'secret';

    const expectedToken = jwt.sign(
      payload,
      process.env.REFRESH_SECRET,
      Jwt.REFRESH_OPTIONS,
    );
    const actualToken = Jwt.signRefreshToken(payload);

    expect(actualToken).toEqual(expectedToken);
  });

  it('should throw an error if the secret key is missing', () => {
    process.env.REFRESH_SECRET = '';

    expect(() => Jwt.signRefreshToken(payload)).toThrow('Missing secret key');
  });
});

describe('Jwt verify access token', () => {
  const payload = { userId: '123' };

  it('should verify a valid token', () => {
    process.env.SECRET = 'secret';

    const token = jwt.sign(payload, process.env.SECRET, Jwt.OPTIONS);
    const verified = Jwt.verify(token);

    expect(verified).toMatchObject(payload);
  });

  it('should throw an error for an invalid token', () => {
    const invalidToken = 'invalid-token';

    expect(() => Jwt.verify(invalidToken)).toThrow(jwt.JsonWebTokenError);
  });
});

describe('JWT decode', () => {
  const payload = { userId: '123' };
  process.env.SECRET = 'secret';

  it('should decode a valid token', () => {
    const token = jwt.sign(payload, process.env.SECRET, Jwt.OPTIONS);
    const decoded = Jwt.decodeToken(token);
    expect(decoded.payload).toMatchObject(payload);
  });

  it('should return null for an invalid token', () => {
    const invalidToken = 'invalid-token';
    const decoded = Jwt.decodeToken(invalidToken);
    expect(decoded).toBeNull();
  });
});
