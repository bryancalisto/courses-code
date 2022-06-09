import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(campaignFactory.abi, '0x685cbd1F32B7C8FC535f7e1A6c7A0875b65a5a7b');

export default instance;
