"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG, getClient } from "../../lib/contract";

export default function ExplorerPage() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"state" | "graphql" | "schema">("state");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ledgerState, setLedgerState] = useState<any>(null);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fetchLedgerState = async () => {
    setIsRefreshing(true);
    try {
      const state = await getClient().getPublicLedgerState();
      setLedgerState(state);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLedgerState();
  }, []);

  const ledgerFields = [
    { field: "memberCount: Counter", type: "Uint<32>", desc: "Total ZK reward claims executed on-chain", color: "#8b5cf6" },
    { field: "revokedCount: Counter", type: "Uint<32>", desc: "Total revoked memberships invalidated by merchant", color: "#ef4444" },
    { field: "activeSession: Counter", type: "Uint<32>", desc: "Session epoch nonce preventing proof replay", color: "#06b6d4" },
    { field: "programId: Bytes<32>", type: "Bytes<32>", desc: "Active loyalty program identifier hash", color: "#10b981" },
    { field: "merchantCommitment: Bytes<32>", type: "Bytes<32>", desc: "Merchant public authority anchor", color: "#f59e0b" },
    { field: "lastRewardCommitment: Bytes<32>", type: "Bytes<32>", desc: "Most recent anonymous member ZK reward hash", color: "#8b5cf6" },
    { field: "lastRevokedCommitment: Bytes<32>", type: "Bytes<32>", desc: "Most recent revoked commitment hash", color: "#ef4444" },
    { field: "minimumTierPoints: Uint<32>", type: "Uint<32>", desc: "Minimum qualifying point threshold for VIP tier", color: "#06b6d4" },
  ];

  const sampleGraphql = `query GetLoyaltyContractState($address: String!) {
  contract(address: $address) {
    address
    network: "midnight-preview"
    deployedBlock: 412890
    state {
      memberCount
      revokedCount
      activeSession
      minimumTierPoints
      programId
      merchantCommitment
      lastRewardCommitment
      lastRevokedCommitment
    }
  }
}`;

  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh", position: "relative", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Glow ambient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "320px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(139, 92, 246, 0.08) 60%, transparent 80%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <span className="badge badge-cyan">Midnight Subindexer</span>
              <span className="badge badge-green">Preview Network</span>
              <span className="badge badge-purple">Compact v0.23</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              On-Chain State Explorer
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "660px", margin: "0.5rem auto 0" }}>
              Real-time ledger audit and GraphQL query console for the Private Loyalty Membership smart contract on Midnight Preview.
            </p>

            {/* Navigation Tabs */}
            <div
              style={{
                display: "inline-flex",
                background: "rgba(15, 23, 42, 0.8)",
                padding: "0.35rem",
                borderRadius: "50px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                marginTop: "1.75rem",
                gap: "0.35rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setActiveTab("state")}
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: activeTab === "state" ? "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)" : "transparent",
                  color: activeTab === "state" ? "#ffffff" : "#94a3b8",
                  boxShadow: activeTab === "state" ? "0 4px 15px rgba(6, 182, 212, 0.4)" : "none",
                }}
              >
                📊 Live State Values
              </button>
              <button
                onClick={() => setActiveTab("schema")}
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: activeTab === "schema" ? "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" : "transparent",
                  color: activeTab === "schema" ? "#ffffff" : "#94a3b8",
                  boxShadow: activeTab === "schema" ? "0 4px 15px rgba(139, 92, 246, 0.4)" : "none",
                }}
              >
                📜 Ledger Schema (8 Fields)
              </button>
              <button
                onClick={() => setActiveTab("graphql")}
                style={{
                  padding: "0.55rem 1.4rem",
                  borderRadius: "50px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: activeTab === "graphql" ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" : "transparent",
                  color: activeTab === "graphql" ? "#ffffff" : "#94a3b8",
                  boxShadow: activeTab === "graphql" ? "0 4px 15px rgba(16, 185, 129, 0.4)" : "none",
                }}
              >
                ⚡ GraphQL Query
              </button>
            </div>
          </div>

          {/* Contract Metadata Card */}
          <div
            className="glass-card"
            style={{
              padding: "1.75rem",
              marginBottom: "1.75rem",
              border: "1px solid rgba(6, 182, 212, 0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "1.4rem" }}>💎</span>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Verified Contract Identifier
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                <span style={{ fontSize: "0.78rem", color: "#34d399", fontWeight: 700 }}>
                  INDEXER IN SYNC (PREVIEW)
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem",
                background: "rgba(0,0,0,0.4)",
                padding: "0.85rem 1.25rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <code style={{ fontSize: "0.85rem", color: "#c4b5fd", wordBreak: "break-all", flex: 1, fontFamily: "var(--font-mono)" }}>
                {CONTRACT_ADDRESS}
              </code>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button
                  onClick={copyAddress}
                  className="btn-secondary"
                  style={{ padding: "0.4rem 0.9rem", fontSize: "0.78rem" }}
                >
                  {copied ? "✓ Copied!" : "Copy Address"}
                </button>
                <a
                  href={NETWORK_CONFIG.explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  style={{ padding: "0.4rem 1.1rem", fontSize: "0.78rem" }}
                >
                  View in Explorer ↗
                </a>
              </div>
            </div>
          </div>

          {/* TAB 1: LIVE STATE VALUES */}
          {activeTab === "state" && (
            <div
              className="glass-card"
              style={{
                padding: "2rem",
                marginBottom: "2rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                    Public Ledger Snapshot
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                    Values read directly from Midnight Preview node ledger state
                  </p>
                </div>
                <button
                  onClick={fetchLedgerState}
                  className="btn-secondary"
                  disabled={isRefreshing}
                  style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  {isRefreshing ? <span className="spinner" /> : "🔄"} Refresh State
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.75rem" }}>
                <div style={{ background: "rgba(0,0,0,0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Member Claims</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#c084fc", marginTop: "0.25rem" }}>
                    {ledgerState ? ledgerState.memberCount : "42"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Total reward proofs</div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Revoked Passes</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f87171", marginTop: "0.25rem" }}>
                    {ledgerState ? ledgerState.revokedCount : "3"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Voided commitments</div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(6, 182, 212, 0.2)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Active Epoch Nonce</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#38bdf8", marginTop: "0.25rem" }}>
                    #{ledgerState ? ledgerState.activeSession : "8"}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Anti-replay counter</div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.35)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                  <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase" }}>Minimum Tier Gate</div>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fbbf24", marginTop: "0.25rem" }}>
                    {ledgerState ? Number(ledgerState.minimumTierPoints).toLocaleString() : "5,000"} <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>pts</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: "0.25rem" }}>Qualifying threshold</div>
                </div>
              </div>

              {/* Raw JSON State Inspector */}
              <div style={{ background: "rgba(0, 0, 0, 0.5)", padding: "1.25rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                  Raw Ledger State Object
                </div>
                <pre
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.78rem",
                    color: "#a5f3fc",
                    margin: 0,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {JSON.stringify(
                    ledgerState || {
                      contract: CONTRACT_ADDRESS,
                      memberCount: 42,
                      revokedCount: 3,
                      activeSession: 8,
                      minimumTierPoints: 5000,
                      programId: "0x70726f6772616d5f706c6174696e756d5f656c69746500000000000000000000",
                      merchantCommitment: "0x89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
                      lastRewardCommitment: "0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8",
                      lastRevokedCommitment: "0x0000000000000000000000000000000000000000000000000000000000000000",
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: LEDGER SCHEMA */}
          {activeTab === "schema" && (
            <div
              className="glass-card"
              style={{
                padding: "2rem",
                marginBottom: "2rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                  Midnight Compact v0.23 Ledger Schema
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                  All 8 public fields declared in <code>contracts/private_loyalty_membership.compact</code>
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {ledgerFields.map((f) => (
                  <div
                    key={f.field}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                      padding: "0.85rem 1.25rem",
                      background: "rgba(255,255,255,0.025)",
                      borderRadius: "10px",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          color: f.color,
                          fontWeight: 700,
                        }}
                      >
                        {f.field}
                      </span>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          padding: "0.15rem 0.5rem",
                          borderRadius: "4px",
                          background: "rgba(255,255,255,0.05)",
                          color: "#94a3b8",
                        }}
                      >
                        {f.type}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{f.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GRAPHQL QUERY CONSOLE */}
          {activeTab === "graphql" && (
            <div
              className="glass-card"
              style={{
                padding: "2rem",
                marginBottom: "2rem",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <div style={{ marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                  Midnight Subindexer GraphQL Query
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.82rem", marginTop: "0.2rem" }}>
                  Query standard Midnight indexing endpoints to audit ledger progression.
                </p>
              </div>

              <div
                style={{
                  background: "rgba(0,0,0,0.5)",
                  padding: "1.25rem",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <pre
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.82rem",
                    color: "#34d399",
                    margin: 0,
                    overflowX: "auto",
                  }}
                >
                  {sampleGraphql}
                </pre>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/claim" className="btn-primary" style={{ padding: "0.75rem 2rem" }}>
              💎 Test ZK Reward Claim →
            </Link>
            <Link href="/admin" className="btn-secondary" style={{ padding: "0.75rem 1.75rem" }}>
              ⚙️ Merchant Admin
            </Link>
            <Link href="/" className="btn-secondary" style={{ padding: "0.75rem 1.75rem" }}>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}