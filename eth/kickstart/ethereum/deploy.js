const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
require('dotenv').config();
const { MNEMONIC, INFURA_PATH } = process.env;
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(MNEMONIC, INFURA_PATH);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: '14521822', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
// DEPLOYED TO 0x25A486836b5f562339224335ccc2FE93D8354FF4
// DEPLOYED TO 0x685cbd1F32B7C8FC535f7e1A6c7A0875b65a5a7b
