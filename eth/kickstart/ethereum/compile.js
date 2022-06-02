const solc = require('solc');
const path = require('path');
const fs = require('fs-extra');


const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'campaign.sol');
const campaignFactoryPath = path.resolve(__dirname, 'contracts', 'campaignFactory.sol');

const input = {
  language: 'Solidity',
  sources: {
    'campaign.sol': {
      content: fs.readFileSync(campaignPath, 'utf-8')
    },
    'campaignFactory.sol': {
      content: fs.readFileSync(campaignFactoryPath, 'utf-8')
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}

const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(path.resolve(buildPath, contract + '.json'), output[contract]);
}
