const cryptoHash = require('./crypto-hash');

describe('cryptoHash()', () => {
  const hash =
    'b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b';

  it('matches', () => {
    expect(cryptoHash('foo')).toEqual(hash);
  });

  it('returns the same hash', () => {
    expect(cryptoHash('foo', 'two', 'hey')).toEqual(
      cryptoHash('hey', 'foo', 'two'),
    );
  });

  it('return a unique has anytime the property of the object change', () => {
    let foo = {};
    const originalHash = cryptoHash(foo);
    foo['a'] = 'a';

    expect(originalHash).not.toEqual(cryptoHash(foo));
  });
});
