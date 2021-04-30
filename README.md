# ethersjs with React Native

## Shims

Before `ethers` can be used, `@ethersproject/shims` (and `react-native-get-random-values` recommended) needs to be imported. This

```sh
yarn add @ethersproject/shims react-native-get-random-values
```

Then imported before importing `ethers`

```js
// Import the crypto getRandomValues shim (**BEFORE** the shims)
import "react-native-get-random-values";

// Import the the ethers shims (**BEFORE** ethers)
import "@ethersproject/shims";

// Import the ethers library
import { ethers } from "ethers";
```

For more info see: https://docs.ethers.io/v5/cookbook/react-native/

## Account Encryption

Accounts can be encrypted using `wallet.encrypt` and later built back using `Wallet.fromEncryptedJson`.

However, this turned out to be extremely slow in react native (takes about 3min per function). The speed reduction comes from the security of the algorithm, which can be reduced but of cause then security will suffer.

Better solution would be to use a server or a serverless function (e.g. Cloud Function) to encrypt and decrypt the private key.

## Provider

Since extensions such as MetaMask can't be used on the phone, the provider has to be set manually. Luckily `ethers` provides interface to connect to a node. There are several way to do that, such as Etherscan, Infura, or with a RPC URL.

`ethers` also provides `getDefaultProvider` function that returns a provider which will use INFURA and will fall back to Etherscan if INFURA is down. It is recommended to use `getDefaultProvider`.

For more info see: https://docs.ethers.io/v5/api/providers/
