# PKPCosmos Signer

NOTE: This repo has been integrated into the [JS-SDK](https://github.com/LIT-Protocol/js-sdk)

# Demo/Test for [PR#56](https://github.com/LIT-Protocol/js-sdk/pull/56)

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

Then you can type `yarn start <test-number>` or `yarn dev <test-number>` to select the test case you want to run. At the moment, we have the following

```
/**
 * Test cases:
 * 1 = create a wallet
 * 2 = create a wallet and send a transaction
 * 3 = create a PKP wallet
 * 4 = create a PKP wallet and send a transaction
 */
```
