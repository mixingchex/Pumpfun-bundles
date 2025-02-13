import { VersionedTransaction, Keypair, SystemProgram, Transaction, Connection, ComputeBudgetProgram, TransactionInstruction, TransactionMessage, AddressLookupTableProgram, PublicKey, SYSVAR_RENT_PUBKEY, sendAndConfirmTransaction } from "@solana/web3.js"
import { ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountIdempotentInstruction, createCloseAccountInstruction, getAssociatedTokenAddressSync, NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { AnchorProvider } from "@coral-xyz/anchor";
import { openAsBlob } from "fs";
import base58 from "bs58"

import { DESCRIPTION, DISTRIBUTION_WALLETNUM, FILE, global_mint, JITO_FEE, PRIVATE_KEY, PUMP_PROGRAM, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT, SWAP_AMOUNT, TELEGRAM, TOKEN_CREATE_ON, TOKEN_NAME, TOKEN_SHOW_NAME, TOKEN_SYMBOL, TWITTER, WEBSITE } from "./constants"
import { readJson, saveDataToFile, sleep } from "./utils"
import { createAndSendV0Tx, execute } from "./executor/legacy"
import { PumpFunSDK } from "./src/pumpfun";
import { executeJitoTx } from "./executor/jito";
import { displayStatus } from "./status"

const commitment = "confirmed"

const connection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment
})
const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY))

let kps: Keypair[] = []
const transactions: VersionedTransaction[] = []
const mintKp = Keypair.generate()

// const mintKp = Keypair.fromSecretKey(base58.decode("LHkkEvTRv4k8f5c8x8GZPuRieQLSVWZj7t6FvWs5mFwaVCmTjkNTf7a6yELGR1E5mB1fZkBm9XVeoZi2vAQP1bG"))
// const mintAddress = new PublicKey("ATyeiG6GGXQjHzG3MuNTTMRaZiDTSCxpSjNuAbaUpump")

const mintAddress = mintKp.publicKey

let sdk = new PumpFunSDK(new AnchorProvider(connection, new NodeWallet(new Keypair()), { commitment }));

const main = async () => {

  const message = " Welcome to Trading Bot Service's Pumpfun Bundler Service ";
  const topBottomBorder = "╔" + "═".repeat(message.length) + "╗";
  const middle = "║" + message + "║";
  const bottomBorder = "╚" + "═".repeat(message.length) + "╝";

  console.log("\x1b[3y5m\x1b[1m"); // Purple + Bold
  console.log(topBottomBorder);
  console.log(middle);
  console.log(bottomBorder);
  console.log("\x1b[0m"); // Reset styles


  console.log(await connection.getBalance(mainKp.publicKey) / 10 ** 9, "SOL in main keypair")

  saveDataToFile([base58.encode(mintKp.secretKey)], "mint.json")

  const tokenCreationIxs = await createTokenTx()
  // Used Lookup Table for distribution
}


const distributeSol = async (connection: Connection, mainKp: Keypair, distritbutionNum: number) => {
  try {
    // Sol Airdrop
  } catch (error) {
    console.log(`Failed to transfer SOL`, error)
    return null
  }
}

// create token instructions
const createTokenTx = async () => {
  const tokenInfo = {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    description: DESCRIPTION,
    showName: TOKEN_SHOW_NAME,
    createOn: TOKEN_CREATE_ON,
    twitter: TWITTER,
    telegram: TELEGRAM,
    website: WEBSITE,
    file: await openAsBlob(FILE),
  };
  let tokenMetadata = await sdk.createTokenMetadata(tokenInfo);

  let createIx = await sdk.getCreateInstructions(
    mainKp.publicKey,
    tokenInfo.name,
    tokenInfo.symbol,
    tokenMetadata.metadataUri,
    mintKp
  );

  const tipAccounts = [
    // 'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  ];
  const jitoFeeWallet = new PublicKey(tipAccounts[Math.floor(tipAccounts.length * Math.random())])
  return [
    SystemProgram.transfer({
      fromPubkey: mainKp.publicKey,
      toPubkey: jitoFeeWallet,
      lamports: Math.floor(JITO_FEE * 10 ** 9),
    }),
    createIx
  ]
}

// make buy instructions
const makeBuyIx = async (kp: Keypair, buyAmount: number) => {
  // buy transaction
}

async function addAddressesToTable(lutAddress: PublicKey, mint: PublicKey, walletKPs: Keypair[]) {

  const walletPKs: PublicKey[] = walletKPs.map(wallet => wallet.publicKey);

  try {
    // Step 3 - Adding wallets' wsol ata
    // while (true) {
    // Step 3 - Adding wallets' wsol ata
    // while (true) {
    //   if (i > 5) {
    //     console.log("Extending LUT failed, Exiting...")
    //     return
    //   }
    //   const quoteAtas: PublicKey[] = []
    //   for (const wallet of walletKPs) {
    //     const quoteAta = getAssociatedTokenAddressSync(NATIVE_MINT, wallet.publicKey)
    //     quoteAtas.push(quoteAta);
    //   }
    //   const addAddressesInstruction2 = AddressLookupTableProgram.extendLookupTable({
    //     payer: mainKp.publicKey,
    //     authority: mainKp.publicKey,
    //     lookupTable: lutAddress,
    //     addresses: quoteAtas,
    //   });
    //   const result = await createAndSendV0Tx([addAddressesInstruction2], mainKp, connection);

    //   if (result) {
    //     console.log("Successfully added WSOL ata addresses.")
    //     i = 0
    //     break
    //   } else {
    //     console.log("Trying again with step 3")
    //   }
    // }
    // await sleep(3000)

    // Step 4 - Adding main wallet and static keys


    console.log("Lookup Table Address extended successfully!")
    console.log(`Lookup Table Entries: `, `https://explorer.solana.com/address/${lutAddress.toString()}/entries`)
  }
  catch (err) {
    console.log("There is an error in adding addresses in LUT. Please retry it.")
    return;
  }
}


main()

