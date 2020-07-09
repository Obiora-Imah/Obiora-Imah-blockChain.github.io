const Block = require('./block');
const { GENESIS_DATA, MINE_RATE } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
  const timeStamp = 200;
  const hash = 'foo-hash';
  const lastHash = 'last-hash';
  const data = 'foo-data';
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timeStamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty,
  });

  it('has data property', () => {
    expect(block.data).toEqual(data);
  });

  it('has lastHash property', () => {
    expect(block.lastHash).toEqual(lastHash);
  });
  it('has timestamp property', () => {
    expect(block.timeStamp).toEqual(timeStamp);
  });
  it('has hash property', () => {
    expect(block.hash).toEqual(hash);
  });
  it('has hash property', () => {
    expect(block.nonce).toEqual(nonce);
  });
  it('has hash property', () => {
    expect(block.difficulty).toEqual(difficulty);
  });

  describe('genesis()', () => {
    const genesisBlock = Block.genesis();

    it('returns an instance of a block', () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it('returns an instance of a block', () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe('mineBlock()', () => {
    const parentBlock = Block.genesis();
    const minedData = 'some mined data';
    const minedBlock = Block.mineBlock({ parentBlock, minedData });
    it('returns an instance of a block', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('set the lastHash to the lastHash of the last block', () => {
      expect(minedBlock.lastHash).toEqual(parentBlock.hash);
    });

    it('sets data', () => {
      expect(minedBlock.data).toEqual(minedData);
    });

    it('sets timeStamp', () => {
      expect(minedBlock.timeStamp).not.toEqual(undefined);
    });

    it('sets hash', () => {
      expect(minedBlock.hash).not.toEqual(undefined);
    });

    it('creat a sha256 hash with proper inputs', () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timeStamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          minedBlock.lastHash,
          minedData,
        ),
      );
    });

    it('sets `hash` that meets the difficulty criteia', () => {
      expect(minedBlock.hash.substring(0, minedBlock.difficulty)).toEqual(
        '0'.repeat(minedBlock.difficulty),
      );
    });

    describe('adjustDifficulty()', () => {
      it('it raises the mine rate of a quickly mine block', () => {
        expect(
          Block.adjustDifficulty({
            originalBlock: block,
            timeStamp: block.timeStamp + MINE_RATE - 100,
          }),
        ).toEqual(block.difficulty + 1);
      });
      it('lowers the mine rate of a slowly mine block', () => {
        expect(
          Block.adjustDifficulty({
            originalBlock: block,
            timeStamp: block.timeStamp + MINE_RATE + 100,
          }),
        ).toEqual(block.difficulty - 1);
      });

      it('adjust difficulty', () => {
        const possibleresults = [block.difficulty + 1, block.difficulty - 1];
        expect(possibleresults.includes(minedBlock.difficulty)).toBeTruthy();
      });

      it('lower limit of one', () => {
        block.difficulty = -1;
        expect(
          Block.adjustDifficulty({
            originalBlock: block,
          }),
        ).toEqual(1);
      });
    });
  });
});
