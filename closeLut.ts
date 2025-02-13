import { PublicKey, AddressLookupTableProgram, ComputeBudgetProgram, Transaction, sendAndConfirmTransaction, Connection } from "@solana/web3.js"
import { Keypair } from "@solana/web3.js/src/keypair"
import base58 from 'bs58'
import { readJson, sleep } from "./utils"
import { PRIVATE_KEY, RPC_ENDPOINT, RPC_WEBSOCKET_ENDPOINT } from "./constants"

const commitment = "confirmed"

const mainKp = Keypair.fromSecretKey(base58.decode(PRIVATE_KEY))
 const connection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT, commitment
})

const closeLut = async () => {
  
  const closeSig = await sendAndConfirmTransaction(connection, closeTx, [mainKp])
  console.log("Close LUT Sig:", closeSig)
}


closeLut()