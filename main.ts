import { DirectSecp256k1HdWallet, OfflineSigner } from "@cosmjs/proto-signing";
import {
  assertIsDeliverTxSuccess,
  SigningStargateClient,
  StdFee,
  calculateFee,
  GasPrice,
  coins,
} from "@cosmjs/stargate";
import { PKPCosmosWallet } from "@lit-protocol/pkp-cosmos";
import { LitLogger } from "./utils";
import {
  MNEUMONIC,
  RPC_ENDPOINT,
  RECIPIENT,
  DENOM,
  AMOUNT,
  DEFAULT_GAS,
  CONTROLLER_AUTHSIG,
  PKP_PUBKEY,
} from "./config.json";

const logger = new LitLogger("[CosmosTest/main.ts]", true);

// get arguments from command line
const args = process.argv.slice(2);

/**
 * Test cases:
 * 1 = create a wallet
 * 2 = create a wallet and send a transaction
 * 3 = create a PKP wallet
 * 4 = create a PKP wallet and send a transaction
 */
if (args.length === 0) {
  console.log("\nUsage: node main.js <test case number>\n");
  console.log(" Test cases:");
  console.log(" 1 = create a wallet");
  console.log(" 2 = create a wallet and send a transaction");
  console.log(" 3 = create a PKP wallet");
  console.log(" 4 = create a PKP wallet and send a transaction");
  console.log("");
  process.exit(0);
}

// const TEST_CASE = 1;
const TEST_CASE = parseInt(args[0]);

const testCaseMap = {
  1: testMneumonicWallet,
  2: testMneumonicWalletAndSendTransaction,
  3: testPKPWallet,
  4: testPKPWalletAndSendTransaction,
};

async function testMneumonicWallet() {
  const wallet = await createAddress();
  console.log("Mnemonic Wallet:", wallet);
}

async function testMneumonicWalletAndSendTransaction() {
  const wallet = await createAddress();
  const tx = await sendTransaction(wallet);

  console.log("Mnemonic Wallet:", wallet);
  console.log("Transaction:", tx);
  printExplorerLink(tx);
}

async function testPKPWallet() {
  const wallet = await createPKPWallet();
  logger.log("wallet:", wallet);
  const [firstAccount] = await wallet.getAccounts();
  logger.log("firstAccount:", firstAccount);
  await wallet.init();
}

async function testPKPWalletAndSendTransaction() {
  const wallet = await createPKPWallet();
  logger.log("wallet:", wallet);

  const [firstAccount] = await wallet.getAccounts();
  logger.log("firstAccount:", firstAccount);
  const tx = await sendTransaction(wallet);

  console.log("Mnemonic Wallet:", wallet);
  console.log("Transaction:", tx);
  printExplorerLink(tx);
}

/**
 * ========== STARTS HERE ==========
 * Main function to create a wallet and send a transaction
 */
(async () => {
  try {
    await testCaseMap[TEST_CASE]();
  } catch (e) {
    logger.throwError(e.message);
  }
})();

/**
 * Creates a new address from a mnemonic
 * @returns
 */
async function createAddress(): Promise<OfflineSigner> {
  const mnemonic = MNEUMONIC;
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
  return wallet;
}

/**
 * sends a transaction to the blockchain using the wallet
 * @param { OfflineSigner } wallet
 */
async function sendTransaction(wallet: OfflineSigner) {
  const rpcEndpoint = RPC_ENDPOINT;
  const client = await SigningStargateClient.connectWithSigner(
    rpcEndpoint,
    wallet
  );

  const recipient = RECIPIENT;
  const amount = coins(AMOUNT, DENOM);

  const [firstAccount] = await wallet.getAccounts();

  const defaultGasPrice = GasPrice.fromString(`${DEFAULT_GAS}${DENOM}`);
  const defaultSendFee: StdFee = calculateFee(80_000, defaultGasPrice);

  logger.log("sender", firstAccount.address);
  logger.log("transactionFee", defaultSendFee);
  logger.log("amount", amount);
  const transaction = await client.sendTokens(
    firstAccount.address,
    recipient,
    amount,
    defaultSendFee,
    "Transaction"
  );

  assertIsDeliverTxSuccess(transaction);
  logger.log("Successfully broadcasted:", transaction);

  return transaction;
}

/**
 * Creates a PKP wallet
 * @returns { PKPCosmosWallet } wallet
 */
async function createPKPWallet() {
  logger.log("...creating a PKP Wallet");

  const wallet = new PKPCosmosWallet({
    controllerAuthSig: CONTROLLER_AUTHSIG,
    pkpPubKey: PKP_PUBKEY,
    rpc: RPC_ENDPOINT,
    debug: true,
    addressPrefix: "cosmos",
  });

  return wallet;
}

/**
 * Prints the explorer link for the transaction
 * @param { any } transaction
 * @returns { void }
 */
async function printExplorerLink(transaction: any): Promise<void> {
  const explorerLink = `https://www.mintscan.io/cosmos/txs/${transaction.transactionHash}`;
  console.log("Explorer link:", explorerLink);
}
