"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../lib/contract";

interface Tier {
  id: string;
  name: string;
  minPoints: number;
  badge: string;
  color: string;
  accentGradient: string;
  cardBg: string;
  benefits: string[];
  multiplier: string;
}

const TIERS: Tier[] = [
  {
    id: "silver",
    name: "Silver Privilege",
    minPoints: 1000,
    badge: "TIER I",
    color: "#94a3b8",
    accentGradient: "linear-gradient(135deg, #64748b 0%, #cbd5e1 50%, #475569 100%)",
    cardBg: "linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)",
    multiplier: "1.2x ZK Rewards",
    benefits: ["Anonymous Base Perks", "Zero-Knowledge Check-In", "Encrypted Receipts"],
  },
  {
    id: "gold",
    name: "Gold Sovereign",
    minPoints: 5000,
    badge: "TIER II",
    color: "#f59e0b",
    accentGradient: "linear-gradient(135deg, #f59e0b 0%, #fef08a 50%, #b45309 100%)",
    cardBg: "linear-gradient(135deg, rgba(69, 26, 3, 0.85) 0%, rgba(26, 16, 5, 0.95) 100%)",
    multiplier: "2.5x ZK Rewards",
    benefits: ["Priority Concierge", "Private Lounge Access", "Blind Voucher Redemption"],
  },
  {
    id: "platinum",
    name: "Platinum Elite",
    minPoints: 15000,
    badge: "TIER III",
    color: "#06b6d4",
    accentGradient: "linear-gradient(135deg, #06b6d4 0%, #a5f3fc 50%, #0891b2 100%)",
    cardBg: "linear-gradient(135deg, rgba(8, 51, 68, 0.85) 0%, rgba(4, 25, 34, 0.95) 100%)",
    multiplier: "5.0x ZK Rewards",
    benefits: ["Global VIP Stash", "Zero-Knowledge Hotel Escapes", "Private Jet Charter Proofs"],
  },
  {
    id: "obsidian",
    name: "Obsidian Black VIP",
    minPoints: 50000,
    badge: "TITANIUM ELITE",
    color: "#a855f7",
    accentGradient: "linear-gradient(135deg, #c084fc 0%, #e879f9 50%, #7e22ce 100%)",
    cardBg: "linear-gradient(135deg, rgba(30, 10, 45, 0.95) 0%, rgba(10, 3, 18, 0.98) 100%)",
    multiplier: "10.0x ZK Rewards",
    benefits: ["Unlimited Zero-Proof Vault", "Dedicated Midnight Node", "Instant On-Chain Sovereign Settlement"],
  },
];

export default function HomePage() {
  const [selectedTier, setSelectedTier] = useState<Tier>(TIERS[2]); // Default Platinum
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const perks = [
    {
      title: "Private Lounge Sovereign Pass",
      tier: "Gold Sovereign (5,000+ pts)",
      desc: "Instant airport & boutique lounge access via zero-knowledge QR proof. No name, no card swipe, no balance revealed.",
      tag: "Hospitality",
      icon: "🍸",
      color: "#f59e0b",
      minTier: "gold",
    },
    {
      title: "Luxury Concierge & Flight Escapes",
      tier: "Platinum Elite (15,000+ pts)",
      desc: "Redeem complimentary flight upgrades & private hotel suites with zero-knowledge voucher tokens on Midnight Preview.",
      tag: "Travel",
      icon: "✈️",
      color: "#06b6d4",
      minTier: "platinum",
    },
    {
      title: "Obsidian Vault Sovereign Reserve",
      tier: "Obsidian Black (50,000+ pts)",
      desc: "Top-tier exclusive private mint allocation and encrypted merchant settlement with zero transaction linkability.",
      tag: "Sovereign VIP",
      icon: "👑",
      color: "#a855f7",
      minTier: "obsidian",
    },
    {
      title: "Zero-Knowledge Retail Rebates",
      tier: "Silver Privilege (1,000+ pts)",
      desc: "Prove qualifying member status at merchant checkouts to claim instant discounts without giving phone numbers or emails.",
      tag: "Shopping",
      icon: "💎",
      color: "#10b981",
      minTier: "silver",
    },
  ];

  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh", position: "relative", overflowX: "hidden" }}>
        {/* Glow ambient background elements */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.08) 50%, transparent 70%)",
            filter: "blur(70px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Hero Section */}
        <section style={{ position: "relative", zIndex: 1, padding: "3.5rem 1.5rem 2rem", textAlign: "center" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <div className="hero-badge" style={{ marginBottom: "1.25rem" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#10b981",
                  boxShadow: "0 0 10px #10b981",
                  display: "inline-block",
                }}
              />
              <span style={{ fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: "0.76rem" }}>
                Midnight Network • Level 3 ZK dApp Architecture
              </span>
            </div>

            <h1
              style={{
                fontSize: "clamp(2.3rem, 5.5vw, 3.8rem)",
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem",
              }}
            >
              Prove VIP Status.{" "}
              <span className="text-gradient-purple">Disclose Zero Data.</span>
            </h1>

            <p
              style={{
                fontSize: "1.1rem",
                color: "#94a3b8",
                maxWidth: "680px",
                margin: "0 auto 2.25rem",
                lineHeight: 1.65,
              }}
            >
              The world’s first executive-grade loyalty dApp powered by{" "}
              <strong style={{ color: "#f1f5f9" }}>Compact Zero-Knowledge smart contracts</strong>.
              Prove point thresholds, unlock tier privileges, and claim rewards without ever exposing your balance, identity, or purchase history on-chain.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
              <Link href="/claim" className="btn-primary" style={{ padding: "0.85rem 2rem", fontSize: "0.95rem" }}>
                ✨ Claim VIP Reward (ZK Proof) →
              </Link>
              <Link href="/admin" className="btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem" }}>
                🛡️ Merchant Governance
              </Link>
              <Link href="/explorer" className="btn-secondary" style={{ padding: "0.85rem 1.75rem", fontSize: "0.95rem" }}>
                🔍 Live State Explorer
              </Link>
            </div>
          </div>
        </section>

        {/* 3D Holographic VIP Membership Card & Tier Switcher */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 3.5rem", position: "relative", zIndex: 1 }}>
          <div
            className="glass-card"
            style={{
              padding: "2.5rem 2rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              background: "rgba(15, 23, 42, 0.7)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Header info */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <span className="badge badge-purple" style={{ marginBottom: "0.5rem" }}>
                Interactive VIP Pass Generator
              </span>
              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
                Digital Zero-Knowledge Membership Card
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.3rem" }}>
                Select a VIP tier below to preview how your confidential credentials compile into on-chain cryptographic proofs.
              </p>

              {/* Tier selector pills */}
              <div
                style={{
                  display: "inline-flex",
                  background: "rgba(0, 0, 0, 0.4)",
                  padding: "0.35rem",
                  borderRadius: "50px",
                  gap: "0.35rem",
                  marginTop: "1.25rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier);
                      setIsFlipped(false);
                    }}
                    style={{
                      padding: "0.5rem 1.25rem",
                      borderRadius: "50px",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                      transition: "all 0.25s ease",
                      background: selectedTier.id === tier.id ? tier.accentGradient : "transparent",
                      color: selectedTier.id === tier.id ? "#0f172a" : "#94a3b8",
                      boxShadow: selectedTier.id === tier.id ? `0 4px 15px ${tier.color}40` : "none",
                    }}
                  >
                    {tier.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Card Presentation & Details Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
              {/* Left Column: 3D Holographic Virtual Card */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", perspective: "1000px" }}>
                <div
                  className="vip-card"
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{
                    background: selectedTier.cardBg,
                    border: `1.5px solid ${selectedTier.color}50`,
                    boxShadow: `0 20px 40px -15px ${selectedTier.color}35, inset 0 1px 1px rgba(255, 255, 255, 0.3)`,
                    cursor: "pointer",
                    position: "relative",
                  }}
                  title="Click to inspect cryptographic witness fields"
                >
                  {!isFlipped ? (
                    /* Front of card */
                    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{ fontSize: "1.75rem" }}>💎</span>
                          <div>
                            <div style={{ fontSize: "0.95rem", fontWeight: 800, letterSpacing: "0.08em", color: "#f8fafc" }}>
                              PLM VIP
                            </div>
                            <div style={{ fontSize: "0.65rem", color: "#94a3b8", letterSpacing: "0.1em" }}>
                              MIDNIGHT ZK PASS
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.1em",
                            padding: "0.25rem 0.65rem",
                            borderRadius: "6px",
                            background: `${selectedTier.color}25`,
                            color: selectedTier.color,
                            border: `1px solid ${selectedTier.color}40`,
                          }}
                        >
                          {selectedTier.badge}
                        </span>
                      </div>

                      {/* Chip & NFC symbol */}
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem", margin: "1rem 0" }}>
                        <div
                          style={{
                            width: "44px",
                            height: "32px",
                            borderRadius: "6px",
                            background: "linear-gradient(135deg, #d4af37 0%, #fef08a 50%, #996515 100%)",
                            border: "1px solid #78350f",
                            boxShadow: "inset 0 0 5px rgba(0,0,0,0.5)",
                            position: "relative",
                          }}
                        >
                          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(0,0,0,0.4)" }} />
                          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1px", background: "rgba(0,0,0,0.4)" }} />
                        </div>
                        <span style={{ fontSize: "1.1rem", opacity: 0.6, transform: "rotate(90deg)" }}>📶</span>
                      </div>

                      {/* Member Hash & Threshold */}
                      <div>
                        <div style={{ fontSize: "0.7rem", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "0.25rem" }}>
                          ZK PROOF COMMITMENT IDENTIFIER
                        </div>
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "1.05rem",
                            letterSpacing: "0.15em",
                            color: "#f8fafc",
                            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                          }}
                        >
                          0x7A3F •••• •••• 9B2C
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                          paddingTop: "0.75rem",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase" }}>
                            Cardholder
                          </div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#e2e8f0" }}>
                            ANONYMOUS SOVEREIGN
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.62rem", color: "#64748b", textTransform: "uppercase" }}>
                            Minimum Threshold
                          </div>
                          <div style={{ fontSize: "0.85rem", fontWeight: 800, color: selectedTier.color }}>
                            ≥ {selectedTier.minPoints.toLocaleString()} PTS
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Back of card: Cryptographic Witness Breakdown */
                    <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", fontSize: "0.78rem" }}>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                          <span style={{ fontWeight: 800, color: selectedTier.color }}>ZK WITNESS DECRYPTOR</span>
                          <span style={{ fontSize: "0.68rem", color: "#10b981" }}>● LOCAL ENCLAVE ONLY</span>
                        </div>
                        <div style={{ background: "rgba(0,0,0,0.5)", padding: "0.6rem 0.8rem", borderRadius: "8px", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                          <div>▸ memberSecretKey: [HIDDEN]</div>
                          <div>▸ loyaltyProofNonce: 0x9e4a...f721</div>
                          <div>▸ purchaseHash: SHA256(item_receipts)</div>
                          <div>▸ pointProof: {selectedTier.minPoints}+ pts verified</div>
                        </div>
                      </div>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "0.6rem", color: "#94a3b8", fontSize: "0.7rem", lineHeight: 1.4 }}>
                        * Zero disclosure to validator nodes. Only the 32-byte Pedersen commitment is broadcast to the Midnight Preview Ledger.
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "1rem", fontSize: "0.78rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <span>🔄 Click card to {isFlipped ? "view front design" : "inspect zero-knowledge witness"}</span>
                </div>
              </div>

              {/* Right Column: Selected Tier Privileges & Actions */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "50px",
                      background: `${selectedTier.color}20`,
                      color: selectedTier.color,
                      fontWeight: 800,
                      border: `1px solid ${selectedTier.color}40`,
                    }}
                  >
                    {selectedTier.multiplier}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
                    Qualification: {selectedTier.minPoints.toLocaleString()} points minimum
                  </span>
                </div>

                <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f8fafc", marginBottom: "0.75rem" }}>
                  {selectedTier.name} Privileges
                </h3>

                <p style={{ color: "#94a3b8", fontSize: "0.92rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                  Holding this membership tier grants instant cryptographic access to high-value rewards. Proof generation runs in-browser in under 2 seconds.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.75rem" }}>
                  {selectedTier.benefits.map((b, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        background: "rgba(255, 255, 255, 0.03)",
                        borderRadius: "10px",
                        border: "1px solid rgba(255, 255, 255, 0.05)",
                      }}
                    >
                      <span style={{ color: "#10b981", fontSize: "1.1rem" }}>✓</span>
                      <span style={{ fontSize: "0.9rem", color: "#e2e8f0", fontWeight: 600 }}>{b}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <Link
                    href={`/claim`}
                    className="btn-primary"
                    style={{
                      background: selectedTier.accentGradient,
                      color: "#0f172a",
                      fontWeight: 800,
                      padding: "0.75rem 1.75rem",
                      border: "none",
                    }}
                  >
                    Claim {selectedTier.name} Reward →
                  </Link>
                  <Link href="/explorer" className="btn-secondary" style={{ padding: "0.75rem 1.25rem" }}>
                    Verify Ledger State
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live On-Chain Telemetry & Metrics */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 3.5rem", position: "relative", zIndex: 1 }}>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value text-gradient-purple">6 Circuits</div>
              <div className="stat-label">Compact v0.23 ZK Proofs</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                claim, verify, revoke, authority, reset, epoch
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value" style={{ color: "#06b6d4" }}>
                8 Fields
              </div>
              <div className="stat-label">On-Chain Ledger State</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Counters, public hashes & program ID
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value" style={{ color: "#10b981" }}>
                5 Witnesses
              </div>
              <div className="stat-label">Zero-Leakage Private Inputs</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Point balance, key, record & entropy
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-value" style={{ color: "#f59e0b" }}>
                100% ZK
              </div>
              <div className="stat-label">Zero Linkability</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Pedersen commitment over Midnight
              </div>
            </div>
          </div>
        </section>

        {/* Selective Disclosure Privacy Matrix */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 3.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="badge badge-cyan" style={{ marginBottom: "0.5rem" }}>
              Level 3 Compliance Matrix
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
              Traditional Loyalty vs. Midnight ZK Membership
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", marginTop: "0.3rem" }}>
              Comparing data exposure vectors across retail loyalty models.
            </p>
          </div>

          <div
            className="glass-card"
            style={{
              padding: "1.75rem",
              overflowX: "auto",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
                  <th style={{ padding: "0.85rem 1rem", color: "#94a3b8", fontSize: "0.82rem", textTransform: "uppercase" }}>
                    Data Dimension
                  </th>
                  <th style={{ padding: "0.85rem 1rem", color: "#ef4444", fontSize: "0.82rem", textTransform: "uppercase" }}>
                    Traditional Web2 / Public Chains
                  </th>
                  <th style={{ padding: "0.85rem 1rem", color: "#10b981", fontSize: "0.82rem", textTransform: "uppercase" }}>
                    Midnight Private Loyalty (ZK)
                  </th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.88rem" }}>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                    Member Identity & Phone Number
                  </td>
                  <td style={{ padding: "1rem", color: "#fca5a5" }}>
                    🚨 Stored in centralized database, exposed to data breaches
                  </td>
                  <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                    🛡️ Anonymous key retained on local client device only
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                    Point Balance & Tier History
                  </td>
                  <td style={{ padding: "1rem", color: "#fca5a5" }}>
                    🚨 Public ledger value or tracked across all retail affiliates
                  </td>
                  <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                    🛡️ Zero points revealed; circuit asserts <code>balance &gt;= threshold</code>
                  </td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                  <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                    Purchase Records & Habits
                  </td>
                  <td style={{ padding: "1rem", color: "#fca5a5" }}>
                    🚨 Monetized & sold to 3rd-party ad brokers
                  </td>
                  <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                    🛡️ Blind SHA-256 witness hash; purchase details never leave enclave
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "1rem", color: "#f8fafc", fontWeight: 700 }}>
                    Fraud & Replay Protection
                  </td>
                  <td style={{ padding: "1rem", color: "#fca5a5" }}>
                    🚨 Requires invasive KYC and biometric identity sweeps
                  </td>
                  <td style={{ padding: "1rem", color: "#86efac", fontWeight: 600 }}>
                    🛡️ Cryptographic salt + on-chain epoch nonce counter
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* VIP Perks Catalog */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 3.5rem", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span className="badge badge-amber" style={{ marginBottom: "0.5rem" }}>
              Exclusive Rewards
            </span>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#f8fafc" }}>
              Privileges Catalog
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.92rem", marginTop: "0.3rem" }}>
              Redeemable immediately with valid zero-knowledge threshold proofs.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.25rem" }}>
            {perks.map((p) => (
              <div
                key={p.title}
                className="glass-card"
                style={{
                  padding: "1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <span style={{ fontSize: "2rem" }}>{p.icon}</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "99px",
                        background: `${p.color}20`,
                        color: p.color,
                        fontWeight: 700,
                        border: `1px solid ${p.color}40`,
                      }}
                    >
                      {p.tag}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.4rem" }}>
                    {p.title}
                  </h3>

                  <div style={{ fontSize: "0.75rem", color: p.color, fontWeight: 700, marginBottom: "0.75rem" }}>
                    {p.tier}
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.55 }}>
                    {p.desc}
                  </p>
                </div>

                <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }}>
                  <Link
                    href="/claim"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: p.color,
                      textDecoration: "none",
                    }}
                  >
                    <span>Claim via ZK Proof</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Verified Smart Contract Coordinates */}
        <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem 4rem", position: "relative", zIndex: 1 }}>
          <div
            className="glass-card"
            style={{
              padding: "2rem",
              border: "1px solid rgba(139, 92, 246, 0.3)",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "1.5rem" }}>📜</span>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f8fafc" }}>
                    Live Deployed Midnight Preview Smart Contract
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                    Compact v0.23 • Verified on Midnight Explorer • Zero-Knowledge Prover Enabled
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: "0.75rem",
                  padding: "0.35rem 0.85rem",
                  borderRadius: "99px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#34d399",
                  fontWeight: 800,
                  border: "1px solid rgba(16, 185, 129, 0.3)",
                  letterSpacing: "0.06em",
                }}
              >
                ● ACTIVE ON PREVIEW TESTNET
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "0.85rem 1.25rem",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1, minWidth: "260px" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                  Contract:
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "#c4b5fd",
                    wordBreak: "break-all",
                  }}
                >
                  {CONTRACT_ADDRESS}
                </span>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={copyAddress}
                  className="btn-secondary"
                  style={{ padding: "0.45rem 1rem", fontSize: "0.8rem" }}
                >
                  {copied ? "✓ Copied" : "Copy Address"}
                </button>
                <a
                  href={NETWORK_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: "0.45rem 1.15rem", fontSize: "0.8rem" }}
                >
                  Midnight Explorer ↗
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}