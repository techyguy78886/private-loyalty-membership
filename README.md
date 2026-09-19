# Private Loyalty Membership (PLM)

> A privacy-preserving zero-knowledge loyalty tier verification and VIP member proof dApp built on the Midnight Network using Compact smart contracts and Midnight.js SDK.

[![GitHub Repo](https://img.shields.io/badge/GitHub-private--loyalty--membership-181717?style=flat-square&logo=github)](https://github.com/techyguy78886/private-loyalty-membership)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_App-000000?style=flat-square&logo=vercel)](https://private-loyalty-membership.vercel.app/)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Demo_Video-FF0000?style=flat-square&logo=youtube)](https://youtu.be/yE9w3OS1pso)
[![Framework](https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![CI/CD Pipeline](https://github.com/techyguy78886/private-loyalty-membership/actions/workflows/ci.yml/badge.svg)](https://github.com/techyguy78886/private-loyalty-membership/actions/workflows/ci.yml)
[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preview-8b5cf6?style=flat-square)](https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23-06b6d4?style=flat-square)](https://midnight.network)
[![Tests](https://img.shields.io/badge/Tests-10%2F10_Passing-10b981?style=flat-square)](https://github.com/techyguy78886/private-loyalty-membership)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## What Is PLM?

**Private Loyalty Membership (PLM)** enables members to verify VIP status, claim exclusive rewards, and spend loyalty points **without exposing user identity, exact point balances, purchase history, or tier qualification math** to merchants or third parties.

Built on Midnight Network's Compact zero-knowledge smart contracts, members generate cryptographic ZK proofs locally on their own device. Only a reward commitment hash is disclosed on-chain — eliminating privacy leaks, data harvesting, and member profiling.

> **Verify VIP loyalty status & claim rewards mathematically — without exposing personal point balances or identity.**

---

## Repository & Deployment

| Resource | Link |
|---|---|
| GitHub Repository | [https://github.com/techyguy78886/private-loyalty-membership](https://github.com/techyguy78886/private-loyalty-membership) |
| Live Application | [https://private-loyalty-membership.vercel.app/](https://private-loyalty-membership.vercel.app/) |
| YouTube Demo Video | [https://youtu.be/yE9w3OS1pso](https://youtu.be/yE9w3OS1pso) |
| Midnight Explorer | [https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8](https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8) |
| **Contract Address** | `0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8` |
| Network | Midnight Preview Testnet |
| Node RPC | `https://rpc.preview.midnight.network` |
| Indexer | `https://indexer.preview.midnight.network/api/v4/graphql` |
| Faucet | `https://faucet.preview.midnight.network` |

---

## Platform Screenshots

### 1. Main Dashboard — Overview & ZK Architecture
![Main Dashboard](photos/main-dashboard-home.png)

### 2. ZK Reward Claiming & Point Threshold Verification
![Reward Claiming](photos/claim-reward-dashboard.png)

### 3. Merchant Admin Console — Tier Governance & Revocation
![Merchant Admin](photos/admin-dashboard.png)

### 4. Midnight On-Chain Explorer & Contract Ledger
![Contract Explorer](photos/explorer-midnight.png)

### 5. Mobile Responsive Interface
![Mobile UI](photos/mobile-ui-dashboard.png)

### 6. Vitest Automated Test Suite — 10/10 Tests Passing
![Test Results](photos/test-run-terminal.png)

---

## Compact Smart Contract — 6 Circuits

**File:** `contracts/private_loyalty_membership.compact`

| # | Circuit | Inputs | ZK Witnesses Used | Description |
|---|---|---|---|---|
| 1 | `claimReward` | `Bytes<32>` (programId) | memberSecretKey, loyaltyProofNonce, membershipRecordHash, memberPointBalance | Proves member points >= threshold in ZK |
| 2 | `verifyMembership` | `Bytes<32>` (commitment) | — | Public on-chain commitment verification against ledger |
| 3 | `revokeMembership` | `Bytes<32>` (commitment) | merchantSigningKey | Merchant revokes a fraudulent commitment with ZK auth |
| 4 | `setMerchantCommitment` | `Uint<32>` (threshold) | merchantSigningKey | Anchors merchant authority and updates tier point threshold |
| 5 | `resetProgram` | `Bytes<32>`, `Uint<32>` | — | Rotates loyalty program and resets qualifying threshold |
| 6 | `incrementSession` | — | — | Bumps activeSession epoch nonce (replay attack protection) |

---

## Privacy Model

### Private — Never Disclosed On-Chain

| Data | ZK Witness | Where Stored |
|---|---|---|
| Member Identity | `memberSecretKey()` | Local device only |
| Nonce Salt | `loyaltyProofNonce()` | Local device only |
| Purchase History | `membershipRecordHash()` | Client-side SHA-256 hash |
| Actual Points | `memberPointBalance()` | Proved >= threshold in ZK; value hidden |
| Merchant Key | `merchantSigningKey()` | Local device of authorized merchant |

### Public — On-Chain Ledger (8 Fields)

| Field | Type | Description |
|---|---|---|
| `memberCount` | Counter | Total reward claims made on-chain |
| `revokedCount` | Counter | Total revoked membership commitments |
| `activeSession` | Counter | Epoch nonce for replay protection |
| `programId` | `Bytes<32>` | Identifier of active loyalty program |
| `merchantCommitment` | `Bytes<32>` | Merchant public authority anchor |
| `lastRewardCommitment` | `Bytes<32>` | Most recent member ZK reward hash |
| `lastRevokedCommitment` | `Bytes<32>` | Most recent revoked commitment hash |
| `minimumTierPoints` | `Uint<32>` | Minimum qualifying point threshold |

---

## Verification Checklist

- [x] **Midnight.js SDK**: Integrated with `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`
- [x] **Real Wallet Connection**: Midnight Lace / 1AM extension integration on Midnight Preview
- [x] **Compact v0.23**: 6 ZK circuits and 8 ledger fields
- [x] **No Simulations**: All cryptographic commitments derived via formal SHA-256 / Blake2s standards
- [x] **Verified Contract**: [0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8](https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8)
- [x] **10/10 Vitest Tests**: Passing
- [x] **Next.js 14 Build**: Clean static generation
- [x] **GitHub Actions CI**: Automated test & build workflow