const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/campaignFactory.sol.json');
const compiledCampaign = require('../ethereum/build/campaign.sol.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = web3.eth.getAccounts();

  factory = web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploye({ data: compiledFactory.bytecode })
    .send({ from: address[0], gas: '1000000' });

  await factory.methods.createCampaign('100')
    .send({
      from: address[0],
      gas: '1000000'
    });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
})