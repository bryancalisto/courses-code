const HdWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, evm } = require('./compile');
require('dotenv').config();

// All env vars required
if (!process.env.MNEMOTECNIC) {
  throw new Error('MNEMOTECNIC not found in .env');
}

const provider = new HdWalletProvider(
  process.env.MNEMOTECNIC,
  'https://rinkeby.infura.io/v3/efee60774c844b508bdd1c895e9ab5a3'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from accounts', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({ data: evm.bytecode.object, arguments: ['HELLO WORLD'] })
    .send({ gas: 1000000, from: accounts[0] });

  console.log('Contract deployed to ', result.options.address);
  provider.engine.stop();
};

deploy();