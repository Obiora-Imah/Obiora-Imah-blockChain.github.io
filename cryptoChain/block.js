const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');
const hexToBinary = require('hex-to-binary');

module.exports = class Block {
  constructor({ timeStamp, hash, lastHash, data, nonce, difficulty }) {
    this.timeStamp = timeStamp;
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    return new this(GENESIS_DATA);
  }

  static adjustDifficulty({ originalBlock, timeStamp }) {
    const rate = timeStamp - originalBlock.timeStamp;
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    if (rate > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }

  static mineBlock({ parentBlock, minedData }) {
    const { hash } = parentBlock;
    let newHash, timeStamp;
    let difficulty = parentBlock.difficulty;
    let nonce = 0;
    do {
      nonce++;
      timeStamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: parentBlock,
        timeStamp,
      });
      newHash = cryptoHash(timeStamp, hash, nonce, difficulty, minedData);
    } while (
      hexToBinary(newHash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );
    return new this({
      lastHash: hash,
      timeStamp,
      nonce,
      difficulty,
      hash: newHash,
      data: minedData,
    });
  }
};
