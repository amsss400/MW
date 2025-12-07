# MalinWallet - The Ultimate Multi-chain Wallet

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
![](https://img.shields.io/github/license/BlueWallet/BlueWallet.svg)

**MalinWallet** is a powerful, secure, and feature-rich wallet designed for the modern crypto user.
Built with React Native, it combines the best features of top-tier wallets into a single, unified experience.

**Key Features:**
* **Multi-chain Support:** Manage Bitcoin, Ethereum (ETH + ERC20), and Solana (SOL) in one place.
* **DApps Browser:** Integrated Web3 browser to access decentralized applications seamlessly.
* **Security:** Plausible deniability, encryption, and self-custody. Your private keys never leave your device.
* **Lightning Network:** Fast and cheap Bitcoin transactions.
* **User-Friendly:** Clean, "Gold" themed interface designed for ease of use.

## Inspiration

MalinWallet is inspired by the best in the industry, including BlueWallet, AlphaWallet, and Mycelium. We aim to bring together their strongest features to create the ultimate wallet experience.

## BUILD & RUN IT

Please refer to the engines field in package.json file for the minimum required versions of Node and npm. It is preferred that you use an even-numbered version of Node as these are LTS versions.

To view the version of Node and npm in your environment, run the following in your console:

```
node --version && npm --version
```

* In your console:

```
git clone <your-repo-url>
cd MalinWallet
npm install
```

* To run on Android:

1. Connect an Android device or start an emulator.
2. Run:
```
npx react-native run-android
```

* To run on iOS:

```
npx pod-install
npm start
```

In another terminal window within the folder:
```
npx react-native run-ios
```

* To run on Web:

*(Web support is currently in development)*

## TESTS

```bash
npm run test
```

## LICENSE

MIT
