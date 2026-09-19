import Navbar from '../components/Navbar';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from '../lib/contract';

export const metadata: Metadata = {
  title: 'Private Loyalty Membership | ZK Loyalty dApp on Midnight',
  description: 'Prove VIP loyalty status and claim rewards without revealing identity or point balances. ZK smart contracts on Midnight Network.',
};

export default function HomePage() {
  const stats = [
    { value: '6', label: 'ZK Circuits', color: '#8b5cf6' },
    { value: '8', label: 'Ledger Fields', color: '#06b6d4' },
    { value: '5', label: 'Private Witnesses', color: '#10b981' },
    { value: '10/10', label: 'Unit Tests Passing', color: '#f59e0b' },
  ];

  const features = [
    {
      icon: '🛡️',
      title: 'Zero-Knowledge Point Proofs',
      desc: 'Prove your loyalty point balance meets or exceeds VIP tier requirements without ever revealing your actual point count.',
      badge: 'Privacy-First',
      color: '#8b5cf6',
    },
    {
      icon: '👤',
      title: 'Anonymous Member Identity',
      desc: 'Member private keys and purchase records remain on your local device. Only a cryptographic commitment hash is anchored on-chain.',
      badge: 'Confidential',
      color: '#06b6d4',
    },
    {
      icon: '⚡',
      title: 'Midnight Compact Circuits',
      desc: 'Built with Compact v0.23 smart contracts deployed on Midnight Preview Testnet, verified via Midnight.js SDK integration.',
      badge: 'On-Chain ZK',
      color: '#10b981',
    },
    {
      icon: '👑',
      title: 'Merchant Authority & Revocation',
      desc: 'Merchants anchor program commitments and can revoke fraudulent or expired memberships using zero-knowledge authority proofs.',
      badge: 'Governance',
      color: '#f59e0b',
    },
  ];

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section */}
        <div className="hero">
          <div className="hero-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
            <span>Midnight Network • Preview Testnet</span>
          </div>
          <h1>Private Loyalty Membership</h1>
          <p>
            Prove VIP status, qualify for tier rewards, and redeem points with <strong>zero-knowledge proofs</strong> — without revealing your point balance, purchase history, or personal identity on-chain.
          </p>
          <div className="hero-actions">
            <Link href="/claim" className="btn-primary" style={{ padding: '0.75rem 2rem', borderRadius: '50px' }}>
              💎 Claim Reward (ZK Proof) →
            </Link>
            <Link href="/admin" className="btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '50px' }}>
              ⚙️ Merchant Admin
            </Link>
            <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ padding: '0.75rem 1.75rem', borderRadius: '50px', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }}>
              🚀 Explorer ↗
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 1.5rem 2.5rem' }}>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            {stats.map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* On-Chain Contract Card */}
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem', border: '1px solid rgba(139,92,246,0.25)', background: 'rgba(139,92,246,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📜</span>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f1f5f9' }}>Deployed Midnight Smart Contract</h2>
              </div>
              <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)' }}>
                VERIFIED ON PREVIEW
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', background: 'rgba(0,0,0,0.35)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '0.82rem', color: '#c4b5fd', wordBreak: 'break-all', flex: 1 }}>{CONTRACT_ADDRESS}</span>
              <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
                View in Explorer ↗
              </a>
            </div>
          </div>

          {/* Feature Cards */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                Why Private Loyalty Membership?
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                VIP tier qualification with mathematical certainty and absolute data confidentiality.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {features.map(f => (
                <div key={f.title} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.6rem' }}>{f.icon}</span>
                    <span style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '99px', background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30`, fontWeight: 700 }}>
                      {f.badge}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Circuit Architecture */}
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span className="badge badge-purple">Compact v0.23</span>
                <span className="badge badge-cyan">Midnight Preview</span>
                <span className="badge badge-green">6 Circuits</span>
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f1f5f9' }}>ZK Contract Architecture (v2)</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem' }}>
                contracts/private_loyalty_membership.compact — 8 ledger fields, 5 witnesses, 6 circuits
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              {[
                { circuit: 'claimReward(Bytes<32>)', witnesses: '4 witnesses', desc: 'ZK reward claim with private point threshold enforcement', color: '#8b5cf6' },
                { circuit: 'verifyMembership(Bytes<32>)', witnesses: '0 witnesses', desc: 'Public on-chain commitment verification against ledger', color: '#06b6d4' },
                { circuit: 'revokeMembership(Bytes<32>)', witnesses: 'merchantSigningKey', desc: 'Merchant revokes a fraudulent commitment with ZK auth', color: '#ef4444' },
                { circuit: 'setMerchantCommitment(Uint<32>)', witnesses: 'merchantSigningKey', desc: 'Anchor merchant authority and update point threshold', color: '#f59e0b' },
                { circuit: 'resetProgram(Bytes<32>, Uint<32>)', witnesses: '—', desc: 'New loyalty epoch with updated minimum qualifying threshold', color: '#10b981' },
                { circuit: 'incrementSession()', witnesses: '—', desc: 'Bump session nonce counter for replay attack protection', color: '#64748b' },
              ].map(c => (
                <div key={c.circuit} style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '10px', padding: '1rem', border: `1px solid ${c.color}33` }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: c.color, marginBottom: '0.35rem', fontWeight: 700 }}>{c.circuit}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '0.4rem' }}>Witnesses: {c.witnesses}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.5 }}>{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}