const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  const hash =
    '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae';

  it('matches', () => {
    expect(cryptoHash('foo')).toEqual(hash);
  });

  it('returns the same hash', () => {
    expect(cryptoHash('foo', 'two', 'hey')).toEqual(
      cryptoHash('hey', 'foo', 'two'),
    );
  });
});
