# Solana Bot Examples Library

This document curates high‑quality references and maps them to implementation points in this codebase. Use it to extend or harden features (bundles, swaps, pump.fun client, LUTs, mempool streaming, distribution).

## Jito bundles, searcher, relayer

- Reference
  - Jito Searcher Examples (Rust): https://github.com/jito-labs/searcher-examples
  - Jito Relayer (Rust): https://github.com/jito-foundation/jito-relayer
  - Jito Solana (bundle SDK): https://github.com/jito-foundation/jito-solana
- Maps to this repo
  - `executor/jito.ts`: multi-endpoint bundle POST + signature confirm
  - `index.ts:createTokenTx()`: include validator tip as last instruction
- Notes
  - Place tip as the last instruction in the last transaction of a bundle
  - Confirm by the first tx signature and latest blockhash

## Jupiter swaps (v0 transactions)

- Reference
  - API client and examples (TS): https://github.com/jup-ag/jupiter-quote-api-node
  - Send Swap Transaction doc: https://dev.jup.ag/docs/swap-api/send-swap-transaction
  - Instruction Parser (TS): https://github.com/jup-ag/instruction-parser
- Maps to this repo
  - `utils/swapOnlyAmm.ts`: buy path implemented; mirror for sell with `/swap`
- Notes
  - Use `dynamicComputeUnitLimit` and `prioritizationFeeLamports`
  - For composition, prefer `/swap-instructions` to embed with your own ix

## Address Lookup Tables (LUTs)

- Reference
  - Solana DevRel Examples (TS): https://github.com/solana-developers/web3-examples/tree/main/address-lookup-tables/tests
  - LUT program/clients: https://github.com/solana-program/address-lookup-table
- Maps to this repo
  - `index.ts:addAddressesToTable()` and `closeLut.ts`
- Notes
  - Flow: create → extend (batch addresses) → use in v0 message → close
  - Validate LUT not modified in the same bundle if using Jito

## Yellowstone gRPC (Geyser) streaming

- Reference
  - Yellowstone gRPC plugin + clients: https://github.com/rpcpool/yellowstone-grpc
  - Geyser connector (multiplex/reconnect): https://github.com/blockworks-foundation/geyser-grpc-connector
- Suggested integration
  - Add a small subscriber that filters Pump.fun program tx and enqueues actions
  - Useful for triggering buys/bundles on live events

## pump.fun client, IDL, events

- Reference
  - Pumpfun Rust SDK: https://docs.rs/pumpfun/latest/pumpfun/
  - Community HTTP bridge: https://github.com/thetateman/Pump-Fun-API
- Maps to this repo
  - `src/pumpfun.ts` and `src/IDL/*`: create/buy/sell scaffolding and IDL
  - `index.ts:createTokenTx()`: uses `sdk.getCreateInstructions`
- Notes
  - Implement buy/sell helpers mirroring SDK logic (slippage basis points)
  - Add event listener patterns to react to trades/completion

## Token distribution (SPL)

- Reference
  - SolDisperse (UI patterns): https://github.com/SolWorks-Dev/soldisperse
  - Simple airdrop scripts: https://github.com/CreatorOS/airdrop-spl-token
- Maps to this repo
  - `src/util.ts:newSendToken()`: batching, CU budget, ATA creation + transfers
- Notes
  - Batch ~10–12 instructions per transaction, set compute unit limit/price

---

### Quick tasks to level up this repo

- Jupiter sell path: implement `getSellTxWithJupiter` in `utils/swapOnlyAmm.ts` using `/swap`
- pump.fun helpers: fill `getBuyIxs*` and `getSellInstructions*` in `src/pumpfun.ts`
- LUT flow: wire a create/extend/close CLI and link from README
- Optional: add a Yellowstone subscriber service for live triggers

### Mapping table

- Bundles/tips → `executor/jito.ts`, `index.ts:createTokenTx()`
- Jupiter buy/sell → `utils/swapOnlyAmm.ts`
- pump.fun create/buy/sell → `src/pumpfun.ts`, `src/IDL/*`
- LUTs → `index.ts:addAddressesToTable()`, `closeLut.ts`
- Distribution → `src/util.ts:newSendToken()`

## Additional high-quality references

### QuickNode Solana examples

- Jupiter swap bot (TS)
  - Path: `qn-guide-examples/solana/jupiter-bot/bot.ts`
  - Why: Clean quote → swap → deserialize → sign → send flow with Jupiter v6.
  - Map: Use to finish `utils/swapOnlyAmm.ts` sell path and include `dynamicComputeUnitLimit` and `prioritizationFeeLamports`.
  - Link: https://github.com/quiknode-labs/qn-guide-examples/tree/main/solana

- Mint NFT (Token Metadata basics)
  - Path: `qn-guide-examples/solana/mint-nft/app.ts`
  - Why: Demonstrates connection, keypairs, PDAs, metadata URI handling consistent with MPL Token Metadata.
  - Map: Cross-check PDA derivation and metadata wiring in `src/pumpfun.ts:getCreateInstructions`.
  - Link: https://github.com/quiknode-labs/qn-guide-examples/tree/main/solana

### Multi-platform sniper bot (Pump.fun / Pumpswap / Raydium)

- Repo: coffellas-cto/Solana-Pumpfun-Pumpswap-Raydium-Copy-Sniper-Trading-Bot
  - Features: Shredstream integration, copy-trading, bundling for Raydium & Pump.fun
  - Why: Good reference for end-to-end bot orchestration across venues
  - Map:
    - Shredstream subscriber → integrate with Yellowstone/Shredstream notes above
    - Bundling flow → align with `executor/jito.ts` patterns
    - Pump.fun integration → compare instruction building with `src/pumpfun.ts`
  - Link: https://github.com/coffellas-cto/Solana-Pumpfun-Pumpswap-Raydium-Copy-Sniper-Trading-Bot