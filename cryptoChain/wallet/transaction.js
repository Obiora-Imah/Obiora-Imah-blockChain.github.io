const uuid = require('uuid/v1');
const { verifySignature } = require('../util');
class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};
    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    const newMap = { ...outputMap };
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(newMap),
    };
  }

  static validTransaction({ transaction }) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;
    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => {
        return total + outputAmount;
      },
    );
    if (outputTotal !== amount) {
      console.error('invalid transaction');
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error('invalid transaction');
      return false;
    }

    return true;
  }

  update({ senderWallet, recipient, amount }) {
    this.outputMap[recipient] = amount;
    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    this.createInput({ senderWallet, outputMap: { ...this.outputMap } });
  }
}

module.exports = Transaction;
