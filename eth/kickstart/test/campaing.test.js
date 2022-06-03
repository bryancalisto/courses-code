const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })

  factory = await factory.send({ from: accounts[0], gas: await factory.estimateGas() })

  await factory.methods.createCampaign('100')
    .send({
      from: accounts[0],
      gas: '1000000'
    });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('deploy a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('marks caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert(manager, accounts[0]);
  });

  it('allows people to contribute money to a campaign and includes them as approvers', async () => {
    // A person contributes
    await campaign.methods.contribute().send({ from: accounts[1], value: '101' });
    // Validate that person was marked as approver
    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert.ok(isContributor);
  });
});