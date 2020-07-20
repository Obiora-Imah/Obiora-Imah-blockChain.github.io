const Wallet = require('./');
const { STARTING_BALANCE } = require('../config');
const { verifySignature } = require('../util');

describe('Walllet', () => {
  let wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });

  it(`has a balance`, () => {
    expect(wallet).toHaveProperty('balance');
  });

  it(`has a starting balance`, () => {
    expect(wallet.balance).toEqual(STARTING_BALANCE);
  });

  it(`has a public key`, () => {
    expect(wallet).toHaveProperty('publicKey');
  });

  describe('signing data', () => {
    const data = 'foobar';
    it(`verifies a signature`, () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        }),
      ).toBe(true);
    });

    it(`does not verifies an invalid signature`, () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        }),
      ).toBe(false);
    });
  });
});
