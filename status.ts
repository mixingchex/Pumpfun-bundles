import {  Connection, Keypair, PublicKey,} from "@solana/web3.js"
import { getAssociatedTokenAddressSync, getMint } from "@solana/spl-token";
import { BN } from "bn.js";
import base58 from "bs58"

import { readJson, retrieveEnvVariable, sleep } from "./utils"
import { RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from "./constants";

export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment: "processed"
})

const rpcUrl = retrieveEnvVariable("RPC_ENDPOINT");
const connection = new Connection(rpcUrl, { commitment: "processed" });

export const displayStatus = async () => {
  try {
    // getting distribution status
  } catch (error) {
    console.log("Error in displaying wallets status")
    return
  }
}

displayStatus()