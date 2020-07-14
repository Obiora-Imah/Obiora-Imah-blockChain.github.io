const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const Blockchain = require('./blockchain');
const PubSub = require('./pubsub');

const app = express();
app.use(bodyParser.json());
const DEAFULT_ORT = 3003;
const blockchain = new Blockchain();
const newPubsub = new PubSub({ blockchain });
const ROOT_NODE_ADDRESS = `http://localhost:${DEAFULT_ORT}`;
let PEER_PORT;

app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/api/mine', (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  newPubsub.broadcastChain();

  res.redirect('/api/blocks');
});

const synceChains = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);
        console.log('replace root chain', rootChain);
        blockchain.replaceChain(rootChain);
      }
    },
  );
};

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEAFULT_ORT + Math.ceil(Math.random() * 1000);
}
const PORT = PEER_PORT || DEAFULT_ORT;
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
  if (PORT !== DEAFULT_ORT) synceChains();
});
