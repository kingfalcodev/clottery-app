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
import { setPrivateKey, getPrivateKey } from "../utils/keychain";
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

        const privateKey = await getPrivateKey();

        if (privateKey) {
          wallet = createWallet(privateKey, provider);
        } else {
          wallet = createRandomWallet();
          await setPrivateKey(wallet.privateKey);
        }

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
