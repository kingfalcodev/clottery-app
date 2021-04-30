import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  getDefaultProvider,
  createWallet,
  createRandomWallet,
  createContractFromAddress,
  weiToEth,
} from "../apis/blockchain";
import { abi } from "../abis/Lottery.json";
import { abi as FLAbi } from "../abis/Falco.json";
import { LOTTERY_ADDRESS, FALCO_ADDRESS } from "../constants/kovan.json";
import { storeData, retrieveData } from "../utils/asyncStorage";
import { WALLET_STORE_KEY } from "../../secret";

const LotteryContext = createContext();

const lotteryReducer = (state, action) => {
  switch (action.type) {
    case "setProvider": {
      return {
        ...state,
        provider: action.provider,
        wallet: action.wallet,
        contract: action.contract,
        manager: action.manager,
        balance: action.balance,
        walletBalance: action.walletBalance,
        flBalance: action.flBalance,
        lastDrawTimestamp: action.lastDrawTimestamp,
        coinContract: action.coinContract,
      };
    }
    case "setError": {
      return {
        ...state,
        errorMessage: action.errorMessage,
      };
    }
    case "setBalance": {
      return {
        ...state,
        balance: action.balance,
      };
    }
    case "setLastDrawTimestamp": {
      return {
        ...state,
        lastDrawTimestamp: action.lastDrawTimestamp,
      };
    }
    default: {
      throw new Error(
        `Unhandled action type: ${action.type} for 'lotteryReducer'`
      );
    }
  }
};

const LotteryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(lotteryReducer, {
    provider: null,
    wallet: null,
    balance: "0",
    walletBalance: "0",
    lastDrawTimestamp: 0,
    errorMessage: "",
  });

  useEffect(() => {
    const getProvider = async () => {
      try {
        const provider = getDefaultProvider();
        let wallet;

        const privateKey = await retrieveData(WALLET_STORE_KEY);

        if (privateKey) {
          // The data store should be encrypted and retrieved like so (Note: speed might suffer with encryption):
          // wallet = fromEncryptedJsonSync(
          //   JSON.parse(walletJsonS),
          //   WALLET_STORE_PASSWORD
          // );
          wallet = createWallet(privateKey, provider);
        } else {
          wallet = createRandomWallet();
          // This is bad, should encrypt the data (Note: speed might suffer with encryption)
          // const walletJson = await wallet.encrypt(WALLET_STORE_PASSWORD);
          await storeData(WALLET_STORE_KEY, wallet.privateKey);
        }

        // Provider must be added after if encrypted
        // wallet = wallet.connect(provider);

        const walletBalance = weiToEth(await wallet.getBalance()).toString();

        const contract = createContractFromAddress(
          LOTTERY_ADDRESS,
          abi,
          wallet
        );
        const manager = await contract.manager();

        const balance = weiToEth(await contract.getBalance()).toString();
        const lastDrawTimestamp = parseInt(await contract.lastDrawTimestamp());

        const coinContract = createContractFromAddress(
          FALCO_ADDRESS,
          FLAbi,
          wallet
        );

        const flBalance = weiToEth(
          await coinContract.balanceOf(wallet.address)
        ).toString();

        dispatch({
          type: "setProvider",
          provider,
          wallet,
          contract,
          manager,
          balance,
          walletBalance,
          flBalance,
          lastDrawTimestamp,
          coinContract,
        });
      } catch (err) {
        let errorMessage = "An error occurred, try again later.";
        dispatch({
          type: "setError",
          errorMessage,
        });
      }
    };
    getProvider();
  }, []);

  const value = { state, dispatch };
  return (
    <LotteryContext.Provider value={value}>{children}</LotteryContext.Provider>
  );
};

const useLottery = () => {
  const context = useContext(LotteryContext);

  if (context === undefined) {
    throw new Error("useLottery must be used whin a LotteryProvider");
  }
  return context;
};

export { LotteryProvider, useLottery };
