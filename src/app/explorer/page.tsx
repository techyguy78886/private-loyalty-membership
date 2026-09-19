"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";

export default function ExplorerPage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ledgerFields = [
    { field: "memberCount: Counter", desc: "Total reward claims made on-chain", color: "#8b5cf6" },
    { field: "revokedCount: Counter", desc: "Total revoked memberships", color: "#ef4444" },
    { field: "activeSession: Counter", desc: "Epoch nonce for replay protection", color: "#06b6d4" },
    { field: "programId: Bytes<32>", desc: "Active loyalty program identifier", color: "#10b981" },
    { field: "merchantCommitment: Bytes<32>", desc: "Merchant public authority anchor", color: "#f59e0b" },
    { field: "lastRewardCommitment: Bytes<32>", desc: "Most recent member ZK reward hash", color: "#8b5cf6" },
    { field: "lastRevokedCommitment: Bytes<32>", desc: "Most recent revoked commitment", color: "#ef4444" },
    { field: "minimumTierPoints: Uint<32>", desc: "Minimum qualifying point threshold", color: "#06b6d4" },
  ];

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span className="badge badge-cyan">Midnight Explorer</span>
            <span className="badge badge-green">Preview Network</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#f8fafc" }}>Contract Explorer</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "0.3rem" }}>
            Live on-chain state of the Private Loyalty Membership ZK contract on Midnight Preview.
          </p>
        </div>

        {/* Contract Address Card */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Deployed Contract Address
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", background: "rgba(0,0,0,0.35)", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <code style={{ fontSize: "0.83rem", color: "#a78bfa", wordBreak: "break-all", flex: 1 }}>{CONTRACT_ADDRESS}</code>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button onClick={copyAddress} className="btn-secondary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.75rem" }}>
                {copied ? "✓ Copied!" : "Copy Address"}
              </button>
              <a href={NETWORK_CONFIG.explorerUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: "0.35rem 0.85rem", fontSize: "0.75rem" }}>
                View in Explorer ↗
              </a>
            </div>
          </div>
        </div>

        {/* Public Ledger Fields Card */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748b", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Public Ledger Fields (8)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {ledgerFields.map(f => (
              <div key={f.field} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem",
                padding: "0.75rem 1rem", background: "rgba(255,255,255,0.025)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)"
              }}>
                <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: f.color, fontWeight: 700 }}>{f.field}</span>
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Actions */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Link href="/claim" className="btn-primary">Claim Reward</Link>
          <Link href="/admin" className="btn-secondary">Merchant Admin</Link>
          <Link href="/" className="btn-secondary">Back to Dashboard</Link>
        </div>
      </div>
    </>
  );
}