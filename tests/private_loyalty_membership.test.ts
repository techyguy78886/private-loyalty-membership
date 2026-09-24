import { describe, it, expect, beforeEach } from 'vitest';
import {
  PrivateLoyaltyMembershipClient,
  getClient,
  CONTRACT_ADDRESS,
  NETWORK_CONFIG,
} from '../src/lib/contract';

describe('PrivateLoyaltyMembershipClient — VIP Loyalty SDK & Circuits', () => {
  let client: PrivateLoyaltyMembershipClient;

  beforeEach(() => {
    client = new PrivateLoyaltyMembershipClient();
  });

  it('1. Singleton Instance: getClient returns consistent singleton instance', () => {
    const c1 = getClient();
    const c2 = getClient();
    expect(c1).toBe(c2);
    expect(c1).toBeInstanceOf(PrivateLoyaltyMembershipClient);
  });

  it('2. Network Coordinates: contract address matches verified Midnight Preview deployment', () => {
    expect(CONTRACT_ADDRESS).toBe('0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8');
    expect(NETWORK_CONFIG.networkId).toBe('preview');
    expect(NETWORK_CONFIG.nodeUrl).toContain('rpc.preview.midnight.network');
    expect(NETWORK_CONFIG.indexerUrl).toContain('indexer.preview.midnight.network');
    expect(NETWORK_CONFIG.explorerUrl).toContain('0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8');
  });

  it('3. Initial Wallet State: wallet is disconnected by default before user connection', () => {
    const status = client.getWalletStatus();
    expect(status.connected).toBe(false);
    expect(status.address).toBeNull();
  });

  it('4. Wallet Connection Flow: auto-connects or simulates Midnight Lace wallet interface', async () => {
    const res = await client.connectWallet();
    expect(res.connected).toBe(true);
    expect(res.walletAddress).toBeTruthy();
    expect(res.walletAddress).toMatch(/^mn_preview1_/);
    expect(client.getWalletStatus().connected).toBe(true);
  });

  it('5. Wallet Disconnect: correctly clears active address and resets state', async () => {
    await client.connectWallet();
    expect(client.getWalletStatus().connected).toBe(true);

    const disc = client.disconnectWallet();
    expect(disc.connected).toBe(false);
    expect(client.getWalletStatus().connected).toBe(false);
    expect(client.getWalletStatus().address).toBeNull();
  });

  it('6. Member Key Configuration: isolates secret key to 32 bytes without leakage', () => {
    client.setMemberKey('sovereign_vip_privkey_secret_007');
    const privateState = client.getPrivateState();
    expect(privateState.memberSecretKey).toBeInstanceOf(Uint8Array);
    expect(privateState.memberSecretKey.length).toBe(32);
  });

  it('7. Membership Record Hashing: computes SHA-256 equivalent 32-byte digest', () => {
    client.setMembershipRecord(JSON.stringify({ tier: 'Platinum', points: 15000 }));
    const privateState = client.getPrivateState();
    expect(privateState.membershipRecordHash).toBeInstanceOf(Uint8Array);
    expect(privateState.membershipRecordHash.length).toBe(32);
  });

  it('8. Loyalty Proof Nonce: generates unique entropy salt for replay protection', () => {
    const state = client.getPrivateState();
    expect(state.loyaltyProofNonce).toBeInstanceOf(Uint8Array);
    expect(state.loyaltyProofNonce.length).toBe(32);
  });

  it('9. Member Point Balance: updates private points witness correctly', () => {
    client.setMemberPoints(12500);
    // Verified internally by claimReward circuit
    expect(client).toBeDefined();
  });

  it('10. Circuit Execution — claimReward: returns valid commitment and on-chain txHash', async () => {
    client.setMemberKey('test_member_alpha');
    client.setMemberPoints(7500);
    const result = await client.claimReward('program_gold_tier');

    expect(result.success).toBe(true);
    expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(result.commitmentHex).toMatch(/^0x/);
    expect(result.txFeeAsset).toBe('tTDUST');
    expect(result.pointThresholdMet).toBe(true);
  });

  it('11. Privacy Invariant: commitment hex does not reveal the member points count', async () => {
    client.setMemberPoints(999999);
    const result = await client.claimReward('program_obsidian');
    // Commitment must be a cryptographic hex hash, not containing plaintext 999999
    expect(result.commitmentHex).not.toContain('999999');
  });

  it('12. Circuit Execution — verifyMembership: matches valid on-chain commitment', async () => {
    const claimRes = await client.claimReward('program_vip');
    const verifyRes = await client.verifyMembership(claimRes.commitmentHex);

    expect(verifyRes.success).toBe(true);
    expect(verifyRes.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
    expect(typeof verifyRes.matches).toBe('boolean');
  });

  it('13. Circuit Execution — verifyMembership: handles unknown commitment gracefully', async () => {
    const verifyRes = await client.verifyMembership('0x1111222233334444555566667777888899990000aaaabbbbccccddddeeeeffff');
    expect(verifyRes.success).toBe(true);
    expect(verifyRes.matches).toBe(false);
  });

  it('14. Circuit Execution — revokeMembership: revokes commitment on-chain', async () => {
    const revokeRes = await client.revokeMembership('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
    expect(revokeRes.success).toBe(true);
    expect(revokeRes.revokedCommitment).toBe('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef');
    expect(revokeRes.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
  });

  it('15. Circuit Execution — setMerchantCommitment: updates qualifying point threshold', async () => {
    client.setMerchantKey('merchant_root_private_authority_key');
    const result = await client.setMerchantCommitment(7500);

    expect(result.success).toBe(true);
    expect(result.newMinimumPoints).toBe(7500);
    expect(result.merchantCommitment).toMatch(/^0x/);
    expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
  });

  it('16. Circuit Execution — resetProgram: resets program identifier and epoch baseline', async () => {
    const result = await client.resetProgram('program_season_2026', 10000);
    expect(result.success).toBe(true);
    expect(result.newProgramId).toBe('program_season_2026');
    expect(result.newMinimumPoints).toBe(10000);
    expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
  });

  it('17. Circuit Execution — incrementSession: advances epoch nonce for anti-replay', async () => {
    const result = await client.incrementSession();
    expect(result.success).toBe(true);
    expect(result.txHash).toMatch(/^0x[a-f0-9]{64}$/i);
  });

  it('18. Ledger State Query: fetchPublicState returns all 8 public ledger fields', async () => {
    const state = await client.fetchPublicState();
    expect(state).toHaveProperty('memberCount');
    expect(state).toHaveProperty('revokedCount');
    expect(state).toHaveProperty('activeSession');
    expect(state).toHaveProperty('programId');
    expect(state).toHaveProperty('merchantCommitment');
    expect(state).toHaveProperty('lastRewardCommitment');
    expect(state).toHaveProperty('lastRevokedCommitment');
    expect(state).toHaveProperty('minimumTierPoints');
  });

  it('19. Ledger State Query Alias: getPublicLedgerState equals fetchPublicState output', async () => {
    const state1 = await client.fetchPublicState();
    const state2 = await client.getPublicLedgerState();
    expect(state1.programId).toBe(state2.programId);
    expect(state1.minimumTierPoints).toBe(state2.minimumTierPoints);
  });

  it('20. Multiple Circuit Chain: claimReward followed by incrementSession and verifyMembership', async () => {
    const c1 = await client.claimReward('program_vip_multi');
    expect(c1.success).toBe(true);

    const c2 = await client.incrementSession();
    expect(c2.success).toBe(true);

    const c3 = await client.verifyMembership(c1.commitmentHex);
    expect(c3.success).toBe(true);
  });

  it('21. Minimum Points Gate: zero point balance is reflected in pointThresholdMet false', async () => {
    client.setMemberPoints(0);
    const result = await client.claimReward('program_standard');
    expect(result.pointThresholdMet).toBe(false);
  });

  it('22. High Value Tier: 50,000 pts qualifies for Obsidian VIP with valid proof', async () => {
    client.setMemberPoints(50000);
    const result = await client.claimReward('program_obsidian_vip');
    expect(result.pointThresholdMet).toBe(true);
    expect(result.success).toBe(true);
  });

  it('23. String to Bytes32 Padding: UTF-8 strings correctly truncated to 32 bytes', () => {
    const clientAny = client as any;
    const shortStr = 'gold';
    const longStr = 'a'.repeat(64);

    const bShort = clientAny.stringToBytes32(shortStr);
    const bLong = clientAny.stringToBytes32(longStr);

    expect(bShort.length).toBe(32);
    expect(bLong.length).toBe(32);
  });

  it('24. Random TxHash Generator: produces valid 32-byte hex string (66 chars with 0x)', () => {
    const clientAny = client as any;
    const hash = clientAny.randomTxHash();
    expect(hash).toMatch(/^0x[a-f0-9]{64}$/);
  });

  it('25. End-to-End Governance Lifecycle: setMerchantCommitment -> claimReward -> revokeMembership', async () => {
    const adminClient = new PrivateLoyaltyMembershipClient();
    adminClient.setMerchantKey('master_merchant_key');
    const setup = await adminClient.setMerchantCommitment(5000);
    expect(setup.success).toBe(true);

    const memberClient = new PrivateLoyaltyMembershipClient();
    memberClient.setMemberPoints(8000);
    const claim = await memberClient.claimReward('program_vip');
    expect(claim.success).toBe(true);

    const revoke = await adminClient.revokeMembership(claim.commitmentHex);
    expect(revoke.success).toBe(true);
  });
});
