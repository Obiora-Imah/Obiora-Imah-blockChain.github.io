const Block = require('./block');
const cryptoHash = require('./crypto-hash');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    const len = chain.length;
    for (let i = 1; i < len; i++) {
      const { timeStamp, data, hash, lastHash } = chain[i];
      const prevHash = chain[i - 1].hash;
      if (prevHash !== lastHash) return false;
      if (hash !== cryptoHash(timeStamp, lastHash, data)) return false;
    }
    return true;
  }

  addBlock(options) {
    const lastHash = this.chain[this.chain.length - 1].hash;
    const block = Block.mineBlock({ lastHash, minedData: options.data });
    this.chain.push(block);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error('chain must be longer');
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error('chain must be valid');
      return;
    }
    console.log('valid chain');
    this.chain = chain;
  }
}

module.exports = Blockchain;
