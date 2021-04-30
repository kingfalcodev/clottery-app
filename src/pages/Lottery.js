import React, { useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { useLottery } from "../context/lotteryContext";
import { ethToWei, weiToEth } from "../apis/blockchain";

const Lottery = () => {
  const {
    state: {
      wallet,
      balance,
      walletBalance,
      flBalance,
      contract,
      coinContract,
      provider,
    },
    dispatch,
  } = useLottery();

  const [state, setState] = useState({
    action: "",
    inProgress: false,
  });

  const buyTicket = async () => {
    setState({
      ...state,
      action: "Approving the spender!",
      inProgress: true,
    });

    const tr1 = await coinContract.approve(contract.address, ethToWei("20"));

    console.log("tr1", tr1);

    setState({
      ...state,
      action: "Waiting for approval transaction!",
    });

    await provider.waitForTransaction(tr1.hash);

    setState({
      ...state,
      action: "Entering the Lottery!",
    });

    const tr2 = await contract.enter();

    console.log("tr2", tr2);

    setState({
      ...state,
      action: "Waiting for enter transaction!",
    });

    await provider.waitForTransaction(tr2.hash);

    setState({
      ...state,
      action: "Getting the updated balance!",
    });

    const balance = weiToEth(await contract.getBalance()).toString();

    dispatch({ type: "setBalance", balance });

    setState({
      ...state,
      inProgress: false,
    });
  };

  const truncate = (str, n) => {
    return str.length > 2 * n
      ? str.substr(0, n) + " ... " + str.substr(str.length - n, str.length)
      : str;
  };

  return (
    <View style={[styles.container]}>
      <View style={[styles.subcontainer]}>
        <View style={[styles.container]}>
          <Text style={[]}>
            Wallet Address: {wallet && truncate(wallet.address, 5)}
          </Text>
          <Text style={[]}>Wallet Balance: {walletBalance}</Text>
          <Text style={[]}>Wallet FL Balance: {flBalance}</Text>
          <Text style={[]}>Lottery Balance: {balance} FL</Text>

          <Text style={[]}>
            {"\n"}
            {state.action && `Current Action: ${state.action} \n \n`}
          </Text>

          {wallet && <Button title="By Ticket" onPress={buyTicket} />}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  subcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
});

export default Lottery;
