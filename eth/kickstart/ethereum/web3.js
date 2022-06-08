import Web3 from 'web3';

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.ethereum);
} else {
  // We are on the server or the user is not running metamask
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/efee60774c844b508bdd1c895e9ab5a3');
  web3 = new Web3(provider);
}

export default web3;