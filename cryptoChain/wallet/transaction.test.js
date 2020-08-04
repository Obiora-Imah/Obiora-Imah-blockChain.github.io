const Transaction = require('./transaction');
const Wallet = require('./');
const { verifySignature } = require('../util');

describe('Transaction', () => {
  let transaction, senderWallet, recipient, amount;
  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = 'recipient-value';
    amount = 50;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it('has an `id`', () => {
    expect(transaction).toHaveProperty('id');
  });

  describe('outputMap', () => {
    it('has an `outputMap`', () => {
      expect(transaction).toHaveProperty('outputMap');
    });

    it('out amount to the recipient', () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it('output remaining balance for senderWallet', () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount,
      );
    });
  });

  describe('input', () => {
    it('has an `input`', () => {
      expect(transaction).toHaveProperty('input');
    });

    it('has an `input`', () => {
      expect(transaction.input).toHaveProperty('timestamp');
    });

    it('sets the `amount` to the `senderWallet` balance', () => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it('sets the `address` to the `senderWallet` publicKey', () => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it('signs the input', () => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        }),
      ).toBeTruthy();
    });
  });

  describe('validTrasaction()', () => {
    let errorMock;
    beforeEach(() => {
      errorMock = jest.fn();

      global.console.error = errorMock;
    });
    describe('when transaction is valid', () => {
      it('returns true', () => {
        expect(Transaction.validTransaction({ transaction })).toBe(true);
      });
    });
    describe('when transaction is invalid', () => {
      describe('and a transaction outputMap is invalid', () => {
        it('returns false and logs error', () => {
          transaction.outputMap[senderWallet.publicKey] = 99999;
          expect(Transaction.validTransaction({ transaction })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe('and a transaction input signature is invalid', () => {
        it('returns false and log error', () => {
          transaction.input.signature = new Wallet().sign('fakedata');
          expect(Transaction.validTransaction({ transaction })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe('update()', () => {
      let originalSignature,
        originalSenderWalletBalance,
        nextRecipient,
        nextAmount;
      beforeEach(() => {
        originalSignature = transaction.input.signature;
        originalSenderWalletBalance =
          transaction.outputMap[senderWallet.publicKey];
        nextRecipient = 'next-recipien';
        nextAmount = 50;
        console.log('before: ', transaction.outputMap);
        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        });

        console.log('after: ', transaction.outputMap);
      });
      // it('outputs the amount to next recipient', () => {
      //   expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      // });
      // it('subtracts the amount from original senderWallet balance', () => {
      //   expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
      //     originalSenderWalletBalance - nextAmount,
      //   );
      // });
      // it('maintains a total output amount that matches the input amount', () => {
      //   expect(
      //     Object.values(transaction.outputMap).reduce(
      //       (runningTotal, currentAmout) => runningTotal + currentAmout,
      //     ),
      //   ).toEqual(transaction.input.amount);
      // });
      it('re-signs the transaction', () => {
        expect(transaction.input.signature).not.toEqual(originalSignature);
      });
    });
  });
});
