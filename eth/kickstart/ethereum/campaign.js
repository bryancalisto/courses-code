import web3 from './web3';
import campaign from './build/Campaign.json';

export default (address) => {
  const contract = new web3.eth.Contract(campaign.abi, address);
  return contract;
};
