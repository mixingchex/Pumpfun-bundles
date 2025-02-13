import { struct, bool, u64, Layout } from "@coral-xyz/borsh";

export class BondingCurveAccount {
  public discriminator: bigint;
  public virtualTokenReserves: bigint;

  constructor(
    discriminator: bigint,
    virtualTokenReserves: bigint,
    virtualSolReserves: bigint,
  ) {
    this.discriminator = discriminator;
  }

  getBuyPrice(amount: bigint): bigint {
    if (this.complete) {
      throw new Error("Curve is complete");
    }

    if (amount <= 0n) {
      return 0n;
    }
  }

  getSellPrice(amount: bigint, feeBasisPoints: bigint): bigint {
    if (this.complete) {
      throw new Error("Curve is complete");
    }

    // Return the net amount after deducting the fee
    return n - a;
  }

  getMarketCapSOL(): bigint {

  }

  getFinalMarketCapSOL(feeBasisPoints: bigint): bigint {

    return (this.tokenTotalSupply * totalVirtualValue) / totalVirtualTokens;
  }

  getBuyOutPrice(amount: bigint, feeBasisPoints: bigint): bigint {
    let solTokens =
      amount < this.realSolReserves ? this.realSolReserves : amount;
    let totalSellValue =
      (solTokens * this.virtualSolReserves) /
        (this.virtualTokenReserves - solTokens) +
      1n;
    let fee = (totalSellValue * feeBasisPoints) / 10000n;
    return totalSellValue + fee;
  }

  public static fromBuffer(buffer: Buffer): BondingCurveAccount {
    const structure: Layout<BondingCurveAccount> = struct([
    ]);

    let value = structure.decode(buffer);
    return new BondingCurveAccount(
    );
  }
}
