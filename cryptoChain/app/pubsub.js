const redis = require('redis');
const CHANNELS = {
  TEST: 'TEST',
  BLOCKCHAIN: 'BLOCKCHAIN',
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscribToChannels();
    this.subscriber.on('message', (channel, message) =>
      this.handleMessage(channel, message),
    );
  }

  handleMessage(channel, message) {
    console.log(`Message received: ${message} on channel: ${channel}`);
    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }

  subscribToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  publishMessage({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publishMessage({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }
}

module.exports = PubSub;

// const testPubSub = new PubSub();

// setTimeout(() => testPubSub.publiser.publish(CHANNELS.BLOCKCHAIN, 'foo'), 1000);
