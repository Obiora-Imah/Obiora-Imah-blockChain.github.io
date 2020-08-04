const Blockchain = require('./blockchain');
const Block = require('./block');
const { cryptoHash } = require('../util');

describe('Blockchain', () => {
  let blockchain, newChain, originalChain;
  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it('should contain block of chain', () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it('have a genesis block', () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block to the chain', () => {
    const data = 'test data';
    blockchain.addBlock({ data });
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(data);
  });

  describe('isValidChain()', () => {
    describe('when the chain does not start with a genesis block', () => {
      it('returns false', () => {
        blockchain.chain[0] = { data: 'fake-chain' };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe('when the chain does start with a genesis block and have multiple blocks', () => {
      beforeEach(() => {
        blockchain.addBlock({ data: 'Bear' });
        blockchain.addBlock({ data: 'Pola' });
        blockchain.addBlock({ data: 'Fish' });
        blockchain.addBlock({ data: 'Dog' });
      });
      describe('and a lastHash reference has changed', () => {
        it('returns false', () => {
          blockchain.chain[2].lastHash = 'broken-lastHash';
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain has a block with an invalid field', () => {
        it('returns false', () => {
          blockchain.chain[2].data = 'broken-data';
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the contains a block with a jumped difficulty', () => {
        it('returns false', () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const lastHash = lastBlock.hash;
          const timeStamp = Date.now();
          const nonce = 0;
          const data = [];
          const difficulty = lastBlock.difficulty - 3;
          // blockchain.chain[2].data = 'broken-data';
          const hash = cryptoHash(lastHash, timeStamp, nonce, data, difficulty);
          const badBlock = new Block({
            timeStamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });
          blockchain.chain.push(badBlock);
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe('and the chain is  valid chain', () => {
        it('returns true', () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;
    });
    describe('when the new chain is not longer', () => {
      it('does not replace the chain', () => {
        newChain.chain[0] = { data: 'new chain' };
        blockchain.replaceChain(newChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when the new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'Bear' });
        newChain.addBlock({ data: 'Pola' });
        newChain.addBlock({ data: 'Fish' });
        newChain.addBlock({ data: 'Dog' });
      });
      describe('and the chain is invalide', () => {
        it('does not replace the chain', () => {
          newChain.chain[2].hash = 'corrupt';
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);

          expect(errorMock).toHaveBeenCalled();
        });
      });
      describe('when the new chain is valid', () => {
        it('replace the chain', () => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(newChain.chain);
          expect(logMock).toHaveBeenCalled();
        });
      });
    });
  });
});
