const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const STARTING_BALANCE = 1000;
const GENESIS_DATA = {
  timeStamp: 1000,
  hash: 'gen-hash',
  lastHash: 'gen-lastHash',
  data: [],
  nonce: 1,
  difficulty: INITIAL_DIFFICULTY,
};

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
};
