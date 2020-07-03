const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');
module.exports = class Block {
  constructor({ timeStamp, hash, lastHash, data }) {
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
  }

  static lightningChain(data) {
    return `${data}*`;
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastHash, minedData }) {
    const timeStamp = Date.now();
    const hash = cryptoHash(timeStamp, lastHash, minedData);
    return new this({ lastHash, timeStamp, hash, data: minedData });
  }
};
