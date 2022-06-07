import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(campaignFactory.abi, '0x25A486836b5f562339224335ccc2FE93D8354FF4');

export default instance;
