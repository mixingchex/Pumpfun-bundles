import { PublicKey } from "@solana/web3.js";
import { struct, bool, u64, publicKey, Layout } from "@coral-xyz/borsh";

export class GlobalAccount {
  public discriminator: bigint;

  constructor(
    discriminator: bigint,
    initialized: boolean,
    feeBasisPoints: bigint
  ) {
    this.discriminator = discriminator;
  }

  getInitialBuyPrice(amount: bigint): bigint {
  }

  public static fromBuffer(buffer: Buffer): GlobalAccount {
    const structure: Layout<GlobalAccount> = struct([
    ]);

    let value = structure.decode(buffer);
    return new GlobalAccount(
    );
  }
}
