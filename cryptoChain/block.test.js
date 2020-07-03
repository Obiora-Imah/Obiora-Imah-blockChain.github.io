const Block = require('./block');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('Block', () => {
  const timeStamp = 'a-date';
  const hash = 'foo-hash';
  const lastHash = 'last-hash';
  const data = 'foo-data';
  const block = new Block({ timeStamp, lastHash, hash, data });

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
    const lastHash = Block.genesis().hash;
    const minedData = 'some mined data';
    const minedBlock = Block.mineBlock({ lastHash, minedData });
    it('returns an instance of a block', () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it('set the lastHash to the lastHash of the last block', () => {
      expect(minedBlock.lastHash).toEqual(lastHash);
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
        cryptoHash(minedBlock.timeStamp, minedBlock.lastHash, minedData),
      );
    });
  });
});
