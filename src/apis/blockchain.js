import "react-native-get-random-values";
import "@ethersproject/shims";
import { ethers } from "ethers";

export const getInfuraProvider = (apiKey) => {
  return new ethers.providers.InfuraProvider(
    ethers.providers.getNetwork("kovan"),
    apiKey
  );
};

export const createWallet = (privateKey, provider) => {
  return new ethers.Wallet(privateKey, provider);
};

export const createRandomWallet = () => {
  return ethers.Wallet.createRandom();
};

export const fromEncryptedWallet = async (json, password) => {
  return await ethers.Wallet.fromEncryptedJson(json, password);
};

export const fromEncryptedJsonSync = (json, password) => {
  return ethers.Wallet.fromEncryptedJsonSync(json, password);
};

export const onAccountChange = (provider, callback) => {
  provider.on("accountsChanged", callback);
};

export const isMetamaskEnabled = async (provider) => {
  return await provider.isConnected();
};

export const getAccounts = async (provider) => {
  return await provider.listAccounts();
};

export const getSigner = async (provider) => {
  return await provider.getSigner();
};

export const createContractFromAddress = (address, abi, signer) => {
  return new ethers.Contract(address, abi, signer);
};

export const weiToEth = (wei) => {
  return ethers.utils.formatEther(wei);
};

export const ethToWei = (eth) => {
  return ethers.utils.parseEther(eth);
};

export const connectToMetamask = async (provider) => {
  return await provider.request({ method: "eth_requestAccounts" });
};
