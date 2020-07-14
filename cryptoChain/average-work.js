const Blockchain = require('./blockchain');

const blockchain = new Blockchain();
blockchain.addBlock({ data: 'initial' });
// console.log(blockchain.chain[blockchain.chain.length - 1]);
let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;
const times = [];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timeStamp;
  blockchain.addBlock({ data: `block ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimestamp = nextBlock.timeStamp;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);
  average = times.reduce((total, num) => total + num) / times.length;

  console.log(
    `time to mine block: ${timeDiff}ms, difficulty: ${
      nextBlock.difficulty
    }. Average time: ${average}ms`,
  );
}
