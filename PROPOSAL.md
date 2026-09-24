# Project Proposal: Private Loyalty Membership (PLM)

> **Zero-Knowledge VIP Loyalty Tier Verification & Reward Redemption Protocol on Midnight Network**

[![Midnight Network](https://img.shields.io/badge/Network-Midnight_Preview-8b5cf6?style=flat-square)](https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8)
[![Compact Language](https://img.shields.io/badge/Compact-v0.23-06b6d4?style=flat-square)](https://midnight.network)
[![Framework](https://img.shields.io/badge/Framework-Next.js_14-black?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

---

## Question 1: What is the project about?

**Private Loyalty Membership (PLM)** is a privacy-preserving decentralized application (dApp) built on the **Midnight Network** using **Compact zero-knowledge (ZK) smart contracts**. It enables consumers to prove VIP loyalty status, qualify for tier rewards, and redeem points — **without disclosing their actual point balance, purchase history, or personal identity** to merchants, third-party aggregators, or on-chain observers.

Traditional loyalty programs are surveillance systems: they accumulate detailed spending behavior, sell data to brokers, and expose user account balances to centralized servers prone to breach. PLM replaces this with a ZK architecture where:

- **Private proofs are generated client-side inside the member's browser**
- **Only a cryptographic commitment hash is written to the Midnight chain**
- **No personal data, point total, or purchase record ever touches the network**

The smart contract (`contracts/private_loyalty_membership.compact`) implements 6 circuits that handle the full lifecycle: reward claiming, membership verification, revocation, merchant authority anchoring, program rotation, and session management.

---

## Question 2: What problem does it solve?

### The Privacy Crisis in Loyalty Programs

1. **Pervasive Consumer Profiling**: Traditional loyalty programs aggregate detailed purchase histories and sell behavioral data to data brokers, enabling comprehensive profiling without explicit consent.
2. **Centralized Database Vulnerabilities**: Merchant databases storing customer emails, phone numbers, tier levels, and point balances are prime targets for data breaches and account takeover attacks.
3. **Identity Leakage for Status Verification**: Demonstrating VIP or high-net-worth tier status requires disclosing complete account balances and transaction histories to merchants — creating unnecessary privacy exposure.
4. **Replay & Fraud Attacks**: Without ZK commitment binding and session nonces, fraudulent members can reuse or forge loyalty proofs across merchants.
5. **No Trustless Revocation**: Existing systems cannot revoke fraudulent memberships without centralized authority intervention — creating disputes and fraud.

### How PLM Solves This

| Problem | PLM Solution |
|---|---|
| Identity exposure | `memberSecretKey()` witness — never leaves the device |
| Point balance disclosure | `memberPointBalance()` witness — compared privately to threshold (`assert(balance >= minimumTierPoints)`) |
| Purchase history leak | `membershipRecordHash()` — SHA-256 hashed locally before ZK proof |
| Replay fraud | `loyaltyProofNonce()` + `activeSession` epoch counter |
| Revocation | `revokeMembership()` circuit with ZK merchant authority proof |
| Merchant impersonation | `merchantCommitment` anchor — `setMerchantCommitment()` circuit |

---

## Question 3: Technical Architecture & Smart Contract Design

### Dual-State Model on Midnight

```
┌─────────────────────────────────────────────────────────────┐
│                       Midnight Ledger                       │
│  memberCount (Counter)       merchantCommitment (Bytes<32>) │
│  revokedCount (Counter)      lastRewardCommitment (Bytes<32>)│
│  activeSession (Counter)     lastRevokedCommitment (Bytes<32>)│
│  programId (Bytes<32>)       minimumTierPoints (Uint<32>)   │
└──────────────────────────────▲──────────────────────────────┘
                               │
               ZK Proof / Public Inputs only
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                  Client-Side Private State                  │
│  memberSecretKey: Bytes<32>    (never leaves browser)       │
│  loyaltyProofNonce: Bytes<32>  (entropy salt)               │
│  membershipRecordHash: Bytes<32>(SHA-256 hashed payload)    │
│  memberPointBalance: Uint<32>  (proved >= minimumTierPoints)│
└─────────────────────────────────────────────────────────────┘
```

---

## Live Deployment & Verification

- **Contract Address**: `0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8`
- **Midnight Explorer**: [https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8](https://preview.midnightexplorer.com/contracts/0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8)
- **GitHub Repository**: [https://github.com/techyguy78886/private-loyalty-membership](https://github.com/techyguy78886/private-loyalty-membership)
- **Live Demo Video**: [https://youtu.be/yE9w3OS1pso](https://youtu.be/yE9w3OS1pso)
- **Live Application**: [https://private-loyalty-membership.vercel.app/](https://private-loyalty-membership.vercel.app/)

---

## Verification Checklist

- [x] **Zero-Knowledge Privacy**: Point balances and member identities remain client-side
- [x] **Compact Circuits**: 6 functional circuits compiled and validated
- [x] **Midnight.js Integration**: DApp Connector API for Midnight Lace wallet connection
- [x] **Test Coverage**: 35/35 Vitest unit tests passing across contract and client suites
- [x] **Production Ready**: Next.js 14 App Router static build verified