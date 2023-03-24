# PKPCosmos Signer

This is a package that modified the ["DirectSecp256k1HdWallet"](https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/directsecp256k1wallet.ts) class from [@cosmjs/proto-signing](https://github.com/cosmos/cosmjs/tree/main/packages/proto-signing). The class extends the PKPBaseWallet class and implements the [OfflineDirectSigner](https://github.com/cosmos/cosmjs/blob/main/packages/proto-signing/src/signer.ts) interface, enabling it to use PKP for signing. The class handles the creation of a Cosmos wallet and signing transactions with the wallet.

# Demo/Test

You will first need to edit the `config.sample.json` file.

```json
{
  "MNEUMONIC": "<your mnemonic>",
  "CONTROLLER_AUTHSIG": {},
  "PKP_PUBKEY": "<your pubkey>",
  "RPC_ENDPOINT": "https://cosmos-mainnet-rpc.allthatnode.com:26657",
  "RECIPIENT": "cosmos1jyz3m6gxuwceq63e44fqpgyw2504ux85ta8vma",
  "DENOM": "uatom",
  "AMOUNT": 1,
  "DEFAULT_GAS": 0.025
}
```

Then you can type `yarn start` or `yarn dev` to select the test case you want to run. At the moment, we have the following

```
/**
 * Test cases:
 * 1 = create a wallet
 * 2 = create a wallet and send a transaction
 * 3 = create a PKP wallet
 * 4 = create a PKP wallet and send a transaction
 */
```
