const crypto = require('crypto');
module.exports = cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');
  hash.update(inputs.sort().join(' '));
  return hash.digest('hex');
};
