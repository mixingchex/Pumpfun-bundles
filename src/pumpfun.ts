import {
  Commitment,
  Connection,
  Finality,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { Program, Provider } from "@coral-xyz/anchor";
import { setGlobalDispatcher, Agent } from 'undici'
import { GlobalAccount } from "./globalAccount";
import {
  CompleteEvent,
  CreateEvent,
  CreateTokenMetadata,
  PriorityFee,
  PumpFunEventHandlers,
  PumpFunEventType,
  SetParamsEvent,
  TradeEvent,
  TransactionResult,
} from "./types";
import {
  toCompleteEvent,
  toCreateEvent,
  toSetParamsEvent,
  toTradeEvent,
} from "./events";
import {
  createAssociatedTokenAccountInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { BondingCurveAccount } from "./bondingCurveAccount";
import { BN } from "bn.js";
import {
  DEFAULT_COMMITMENT,
  DEFAULT_FINALITY,
  buildTx,
  calculateWithSlippageBuy,
  calculateWithSlippageSell,
  getRandomInt,
  sendTx,
} from "./util";
import { PumpFun, IDL } from "./idl/index";
import { global_mint } from "../constants";
import { TransactionInstruction } from "@solana/web3.js";

const PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
const MPL_TOKEN_METADATA_PROGRAM_ID =
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

export const GLOBAL_ACCOUNT_SEED = "global";
export const MINT_AUTHORITY_SEED = "mint-authority";
export const BONDING_CURVE_SEED = "bonding-curve";
export const METADATA_SEED = "metadata";

export const DEFAULT_DECIMALS = 6;

export class PumpFunSDK {
  public program: Program<PumpFun>;
  public connection: Connection;
  constructor(provider?: Provider) {
    this.program = new Program<PumpFun>(IDL as PumpFun, provider);
    this.connection = this.program.provider.connection;
  }

  // async buy(
  //   buyer: Keypair,
  //   mint: PublicKey,
  //   buyAmountSol: bigint,
  //   slippageBasisPoints: bigint = BigInt(500),
  //   priorityFees?: PriorityFee,
  //   commitment: Commitment = DEFAULT_COMMITMENT,
  //   finality: Finality = DEFAULT_FINALITY
  // ): Promise<TransactionResult> {
  //   let buyTx = await this.getBuyInstructionsBySolAmount(
  //     buyer.publicKey,
  //     mint,
  //     buyAmountSol,
  //     slippageBasisPoints,
  //     commitment
  //   );

  //   let buyResults = await sendTx(
  //     this.connection,
  //     buyTx,
  //     buyer.publicKey,
  //     [buyer],
  //     priorityFees,
  //     commitment,
  //     finality
  //   );
  //   return buyResults;
  // }

  async sell(
    seller: Keypair,
    mint: PublicKey,
    sellTokenAmount: bigint,
    slippageBasisPoints: bigint = BigInt(500),
    priorityFees?: PriorityFee,
    commitment: Commitment = DEFAULT_COMMITMENT,
    finality: Finality = DEFAULT_FINALITY
  ): Promise<TransactionResult> {
    let sellTx = await this.getSellInstructionsByTokenAmount(
      seller.publicKey,
      mint,
      sellTokenAmount,
      slippageBasisPoints,
      commitment
    );

    let sellResults = await sendTx(
      this.connection,
      sellTx,
      seller.publicKey,
      [seller],
      priorityFees,
      commitment,
      finality
    );
    return sellResults;
  }

  //create token instructions
  async getCreateInstructions(
    creator: PublicKey,
    name: string,
    symbol: string,
    uri: string,
    mint: Keypair
  ) {
    const mplTokenMetadata = new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(METADATA_SEED),
        mplTokenMetadata.toBuffer(),
        mint.publicKey.toBuffer(),
      ],
      mplTokenMetadata
    );

    const associatedBondingCurve = await getAssociatedTokenAddress(
      mint.publicKey,
      this.getBondingCurvePDA(mint.publicKey),
      true
    );

    return this.program.methods
      .create(name, symbol, uri)
      .accounts({
        mint: mint.publicKey,
        associatedBondingCurve: associatedBondingCurve,
        metadata: metadataPDA,
        user: creator,
      })
      .signers([mint])
      .instruction();
  }

  async getBuyInstructionsBySolAmount(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = BigInt(500),
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    // buy instructions

    return await this.getBuyInstructions(
      buyer,
      mint,
      globalAccount.feeRecipient,
      buyAmount,
      buyAmountWithSlippage,
    );
  }

  //buy
  async getBuyInstructions(
    buyer: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: bigint,
    solAmount: bigint,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {

    // buy instructions

  }

  async getBuyIxsBySolAmount(
    buyer: PublicKey,
    mint: PublicKey,
    buyAmountSol: bigint,
    slippageBasisPoints: bigint = BigInt(500),
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    // buy instructions
  }

  //buy
  async getBuyIxs(
    buyer: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: bigint,
    solAmount: bigint,
    commitment: Commitment = DEFAULT_COMMITMENT,
  ) {
    // buy instructions
    return ixs;
  }

  //sell
  async getSellInstructionsByTokenAmount(
    seller: PublicKey,
    mint: PublicKey,
    sellTokenAmount: bigint,
    slippageBasisPoints: bigint = BigInt(500),
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    // sell instructions
  }

  async getSellInstructions(
    seller: PublicKey,
    mint: PublicKey,
    feeRecipient: PublicKey,
    amount: bigint,
    minSolOutput: bigint
  ) {
    // sell instructions

    return transaction;
  }

  async getBondingCurveAccount(
    mint: PublicKey,
    commitment: Commitment = DEFAULT_COMMITMENT
  ) {
    // bonding curve account
    return request.json();
  }

  //EVENTS
  addEventListener<T extends PumpFunEventType>(
    eventType: T,
    callback: (
      event: PumpFunEventHandlers[T],
      slot: number,
      signature: string
    ) => void
  ) {
    // events
  }

  removeEventListener(eventId: number) {
    // events
  }
}
