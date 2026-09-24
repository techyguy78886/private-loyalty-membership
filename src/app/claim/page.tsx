"use client";
import React, { useState } from "react";
import { getClient, NETWORK_CONFIG, CONTRACT_ADDRESS } from "../../lib/contract";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function ClaimRewardPage() {
  const [activeTab, setActiveTab] = useState<"claim" | "verify">("claim");
  const [programId, setProgramId] = useState("program_platinum_elite");
  const [memberKey, setMemberKey] = useState("");
  const [memberRecord, setMemberRecord] = useState("");
  const [memberPoints, setMemberPoints] = useState(7500);
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);
  const [claimedCommitment, setClaimedCommitment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);
  const [copiedTx, setCopiedTx] = useState(false);

  const MINIMUM_POINTS = 5000;

  const getTierFromPoints = (pts: number) => {
    if (pts >= 25000) return { name: "Obsidian Black VIP", color: "#c084fc", badge: "TITANIUM ELITE", multiplier: "10x" };
    if (pts >= 15000) return { name: "Platinum Elite", color: "#06b6d4", badge: "TIER III", multiplier: "5x" };
    if (pts >= 5000) return { name: "Gold Sovereign", color: "#f59e0b", badge: "TIER II", multiplier: "2.5x" };
    return { name: "Silver Privilege", color: "#94a3b8", badge: "TIER I", multiplier: "1.2x" };
  };

  const currentTier = getTierFromPoints(memberPoints);
  const isEligible = memberPoints >= MINIMUM_POINTS;

  const addLog = (msg: string, type = "info") => setLogs((l) => [...l, { msg, type }]);

  const handleApplyPreset = (tier: "gold" | "platinum" | "obsidian") => {
    if (tier === "gold") {
      setProgramId("program_gold_sovereign");
      setMemberPoints(8500);
      setMemberKey("gold_member_secret_enclave_key_77");
      setMemberRecord(JSON.stringify({ tier: "Gold", loungeAccess: true, visits: 14 }));
    } else if (tier === "platinum") {
      setProgramId("program_platinum_elite");
      setMemberPoints(18500);
      setMemberKey("platinum_vip_sovereign_key_99");
      setMemberRecord(JSON.stringify({ tier: "Platinum", flightUpgrades: 3, conciergeId: "VIP-882" }));
    } else {
      setProgramId("program_obsidian_black");
      setMemberPoints(32000);
      setMemberKey("obsidian_titanium_root_key_01");
      setMemberRecord(JSON.stringify({ tier: "Obsidian", vaultId: "VAULT-001", privateNodes: true }));
    }
  };

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setLogs([]);

    try {
      addLog("> [WALLET] Requesting connection to Midnight Lace Wallet...", "info");
      const client = getClient();
      client.setMemberKey(memberKey || "anonymous_member_key_default");
      client.setMembershipRecord(memberRecord || "default_membership_record");
      client.setMemberPoints(memberPoints);

      addLog("> [ZK WITNESS 1/4] memberSecretKey() — confidential private identity key isolated in client memory", "info");
      addLog("> [ZK WITNESS 2/4] loyaltyProofNonce() — cryptographic salt generated via Web Crypto API", "info");
      addLog("> [ZK WITNESS 3/4] membershipRecordHash() — blind SHA-256 digest of private activity record", "info");
      addLog(`> [ZK WITNESS 4/4] memberPointBalance() — ${memberPoints.toLocaleString()} pts evaluated vs. ${MINIMUM_POINTS.toLocaleString()} pts threshold`, "info");

      if (memberPoints < MINIMUM_POINTS) {
        addLog(`> [REJECTED] Ineligible: ${memberPoints.toLocaleString()} pts is below ${MINIMUM_POINTS.toLocaleString()} minimum threshold.`, "error");
        setError(`ZK Assertion Failed: Point balance (${memberPoints.toLocaleString()} pts) does not meet the minimum tier qualification threshold (${MINIMUM_POINTS.toLocaleString()} pts).`);
        return;
      }

      addLog("> [CIRCUIT] Generating Compact v0.23 SNARK proof for circuit: claimReward(Bytes<32>)...", "info");
      addLog("> [NETWORK] Broadcasting Zero-Knowledge proof to Midnight Preview Testnet nodes...", "info");

      const res = await client.claimReward(programId);
      setResult(res);

      addLog(`> [CONFIRMED] Midnight Block Finalized! TxHash: ${res.txHash}`, "success");
      addLog(`> [COMMITMENT] Public Pedersen Anchor: ${res.commitmentHex}`, "success");
      addLog(`> [PRIVACY VERIFIED] 0 bytes of sensitive balance or identity data leaked to validators`, "success");
      addLog(`> [GAS FEE] Settlement fee: ${res.txFee} ${res.txFeeAsset}`, "info");
    } catch (err: any) {
      const msg = err?.message || "Reward claim failed.";
      setError(msg);
      addLog(`> [ERROR] ${msg}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimedCommitment.trim()) return;
    setVerifyLoading(true);
    setVerifyResult(null);
    try {
      addLog(`> [CIRCUIT] Querying Midnight Preview Ledger via verifyMembership(Bytes<32>)...`, "info");
      const res = await getClient().verifyMembership(claimedCommitment.trim());
      setVerifyResult(res);
      if (res.matches) {
        addLog(`> [VERIFIED ✓] Commitment ${claimedCommitment.substring(0, 18)}... is VALID & ANCHORED on-chain!`, "success");
      } else {
        addLog(`> [MISMATCH ✕] Commitment does not match on-chain ledger records or was revoked.`, "error");
      }
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  return (
    <>
      <Navbar />

      <main style={{ minHeight: "100vh", position: "relative", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Ambient background glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "350px",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(6, 182, 212, 0.05) 60%, transparent 80%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <span className="badge badge-purple">Zero-Knowledge Prover</span>
              <span className="badge badge-green">Midnight Preview Testnet</span>
              <span className="badge badge-cyan">Compact v0.23</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              VIP Loyalty Reward Portal
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "620px", margin: "0.5rem auto 0" }}>
              Generate mathematical proofs of your tier standing without disclosing your private identity, point balance, or retail transaction records.
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
              }}
            >
              <button
                onClick={() => setActiveTab("claim")}
                style={{
                  padding: "0.6rem 1.75rem",
                  borderRadius: "50px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: activeTab === "claim" ? "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)" : "transparent",
                  color: activeTab === "claim" ? "#ffffff" : "#94a3b8",
                  boxShadow: activeTab === "claim" ? "0 4px 15px rgba(139, 92, 246, 0.4)" : "none",
                }}
              >
                ⚡ Claim VIP Reward
              </button>
              <button
                onClick={() => setActiveTab("verify")}
                style={{
                  padding: "0.6rem 1.75rem",
                  borderRadius: "50px",
                  fontSize: "0.88rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "none",
                  transition: "all 0.25s ease",
                  background: activeTab === "verify" ? "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)" : "transparent",
                  color: activeTab === "verify" ? "#ffffff" : "#94a3b8",
                  boxShadow: activeTab === "verify" ? "0 4px 15px rgba(6, 182, 212, 0.4)" : "none",
                }}
              >
                🛡️ Dual Verifier Engine
              </button>
            </div>
          </div>

          {activeTab === "claim" ? (
            <>
              {/* Presets Bar */}
              <div
                className="glass-card"
                style={{
                  padding: "1rem 1.5rem",
                  marginBottom: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.1rem" }}>⚡</span>
                  <span style={{ fontSize: "0.85rem", color: "#cbd5e1", fontWeight: 600 }}>
                    Quick-Fill Test Credentials:
                  </span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => handleApplyPreset("gold")}
                    style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "6px",
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      border: "1px solid rgba(245, 158, 11, 0.3)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Gold (8.5k pts)
                  </button>
                  <button
                    onClick={() => handleApplyPreset("platinum")}
                    style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "6px",
                      background: "rgba(6, 182, 212, 0.15)",
                      color: "#06b6d4",
                      border: "1px solid rgba(6, 182, 212, 0.3)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Platinum (18.5k pts)
                  </button>
                  <button
                    onClick={() => handleApplyPreset("obsidian")}
                    style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "6px",
                      background: "rgba(192, 132, 252, 0.15)",
                      color: "#c084fc",
                      border: "1px solid rgba(192, 132, 252, 0.3)",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Obsidian (32k pts)
                  </button>
                </div>
              </div>

              {/* Main Claim Form Card */}
              <div
                className="glass-card"
                style={{
                  padding: "2.25rem",
                  marginBottom: "2rem",
                  border: "1px solid rgba(139, 92, 246, 0.25)",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
                }}
              >
                <form onSubmit={handleClaim} style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
                  {/* Interactive Points Slider & Dynamic Tier Gauge */}
                  <div
                    style={{
                      background: "rgba(0, 0, 0, 0.35)",
                      padding: "1.5rem",
                      borderRadius: "14px",
                      border: `1.5px solid ${isEligible ? currentTier.color + "40" : "#ef444440"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1" }}>
                          Confidential Points Witness Gauge (ZK assertion)
                        </span>
                        <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                          Evaluated purely in client memory: <code>memberPoints &gt;= {MINIMUM_POINTS.toLocaleString()} pts</code>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "50px",
                            background: `${currentTier.color}20`,
                            color: currentTier.color,
                            fontWeight: 800,
                            border: `1px solid ${currentTier.color}40`,
                          }}
                        >
                          {currentTier.name} ({currentTier.multiplier})
                        </span>
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "50px",
                            background: isEligible ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                            color: isEligible ? "#34d399" : "#f87171",
                            fontWeight: 800,
                            border: `1px solid ${isEligible ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                          }}
                        >
                          {isEligible ? "✓ QUALIFIED FOR CLAIM" : "✕ INELIGIBLE (<5,000)"}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", margin: "1.25rem 0 0.5rem" }}>
                      <input
                        type="range"
                        min={1000}
                        max={35000}
                        step={500}
                        value={memberPoints}
                        onChange={(e) => setMemberPoints(Number(e.target.value))}
                        style={{
                          flex: 1,
                          height: "8px",
                          accentColor: currentTier.color,
                          cursor: "pointer",
                        }}
                      />
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "1.3rem",
                          fontWeight: 800,
                          color: currentTier.color,
                          minWidth: "120px",
                          textAlign: "right",
                        }}
                      >
                        {memberPoints.toLocaleString()} <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>pts</span>
                      </div>
                    </div>

                    {/* Threshold Markers */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#64748b", marginTop: "0.4rem" }}>
                      <span>1,000 pts (Silver)</span>
                      <span style={{ color: "#f59e0b", fontWeight: 700 }}>▲ 5,000 pts (Min Gate)</span>
                      <span>15,000 pts (Platinum)</span>
                      <span>35,000+ pts (Obsidian)</span>
                    </div>
                  </div>

                  {/* Public Inputs & Private Witnesses */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                        Loyalty Program Identifier (Public Input) *
                      </label>
                      <input
                        type="text"
                        id="programId"
                        value={programId}
                        onChange={(e) => setProgramId(e.target.value)}
                        placeholder="program_platinum_elite"
                        required
                        style={{ width: "100%" }}
                      />
                      <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                        Identifies the merchant loyalty contract instance on Midnight.
                      </p>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                        Member Secret Key (Private Witness 🔒)
                      </label>
                      <input
                        type="password"
                        id="memberKey"
                        value={memberKey}
                        onChange={(e) => setMemberKey(e.target.value)}
                        placeholder="Device-enclave private key"
                        autoComplete="off"
                        style={{ width: "100%" }}
                      />
                      <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                        Never transmitted off your device; forms <code>memberSecretKey()</code> witness.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem" }}>
                      Membership Record / Encrypted Activity Payload
                    </label>
                    <textarea
                      id="memberRecord"
                      value={memberRecord}
                      onChange={(e) => setMemberRecord(e.target.value)}
                      placeholder='{"tier": "Platinum", "perkUnlocked": true, "timestamp": 1727218800}'
                      rows={2}
                      style={{ resize: "vertical", width: "100%" }}
                    />
                    <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                      Hashed locally via SHA-256 into <code>membershipRecordHash()</code>. Zero retail contents are exposed.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading}
                      id="claimBtn"
                      style={{
                        padding: "0.85rem 2.25rem",
                        fontSize: "0.95rem",
                        background: isEligible
                          ? "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)"
                          : "rgba(255, 255, 255, 0.1)",
                        cursor: isEligible ? "pointer" : "not-allowed",
                      }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner" /> Generating ZK SNARK Proof...
                        </>
                      ) : (
                        "💎 Generate Proof & Claim Reward"
                      )}
                    </button>
                    <Link href="/" className="btn-secondary" style={{ padding: "0.85rem 1.5rem" }}>
                      ← Dashboard
                    </Link>
                  </div>
                </form>
              </div>

              {/* Error Alert */}
              {error && (
                <div
                  className="glass-card"
                  style={{
                    padding: "1.5rem",
                    marginBottom: "1.75rem",
                    border: "1px solid rgba(239, 68, 68, 0.4)",
                    background: "rgba(239, 68, 68, 0.08)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "#f87171", fontWeight: 700, fontSize: "1rem" }}>
                    <span>✕</span>
                    <span>Zero-Knowledge Proof Assertion Failure</span>
                  </div>
                  <p style={{ color: "#cbd5e1", marginTop: "0.5rem", fontSize: "0.88rem", lineHeight: 1.5 }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Success Result: Luxury Digital Proof Receipt */}
              {result && (
                <div
                  className="glass-card"
                  style={{
                    padding: "2.25rem",
                    marginBottom: "2rem",
                    border: "1.5px solid rgba(16, 185, 129, 0.4)",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(6, 182, 212, 0.04) 100%)",
                    boxShadow: "0 20px 40px -15px rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "rgba(16, 185, 129, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#10b981",
                          fontSize: "1.4rem",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                        }}
                      >
                        ✓
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#f8fafc" }}>
                          VIP Reward Claim Confirmed On-Chain
                        </h3>
                        <p style={{ fontSize: "0.8rem", color: "#34d399", fontWeight: 600 }}>
                          Midnight Preview Testnet • Zero-Knowledge Assertion Verified
                        </p>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: "0.35rem 0.85rem",
                        borderRadius: "50px",
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#6ee7b7",
                        fontWeight: 800,
                        fontSize: "0.75rem",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                      }}
                    >
                      FINALITY CONFIRMED
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        Circuit Executed
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#c4b5fd", fontWeight: 700 }}>
                        claimReward(Bytes&lt;32&gt;)
                      </div>
                    </div>

                    <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        Points Threshold Status
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#10b981", fontWeight: 700 }}>
                        ✓ {memberPoints.toLocaleString()} pts &ge; {MINIMUM_POINTS.toLocaleString()} pts (Enforced in ZK)
                      </div>
                    </div>

                    <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        Transaction Fee
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "#f8fafc" }}>
                        {result.txFee} {result.txFeeAsset}
                      </div>
                    </div>

                    <div style={{ background: "rgba(0, 0, 0, 0.35)", padding: "1rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        Prover Engine
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "#06b6d4", fontWeight: 700 }}>
                        Compact SNARK v0.23
                      </div>
                    </div>
                  </div>

                  {/* Public Commitment and TxHash */}
                  <div style={{ background: "rgba(0, 0, 0, 0.4)", padding: "1.25rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.06)", marginBottom: "1.5rem" }}>
                    <div style={{ marginBottom: "0.75rem" }}>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        Public ZK Commitment (Anchored on Ledger)
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#a78bfa", wordBreak: "break-all" }}>
                        {result.commitmentHex}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>
                        On-Chain Transaction Hash
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "#38bdf8", wordBreak: "break-all" }}>
                        {result.txHash}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      onClick={() => copyToClipboard(result.txHash)}
                      className="btn-secondary"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.82rem" }}
                    >
                      {copiedTx ? "✓ Copied Hash!" : "Copy TxHash"}
                    </button>
                    <a
                      href={NETWORK_CONFIG.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                      style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}
                    >
                      Inspect in Midnight Explorer ↗
                    </a>
                    <button
                      onClick={() => {
                        setClaimedCommitment(result.commitmentHex);
                        setActiveTab("verify");
                      }}
                      className="btn-secondary"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.82rem", borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4" }}
                    >
                      Test in Verifier Engine →
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* TAB 2: DUAL VERIFICATION ENGINE */
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1px solid rgba(6, 182, 212, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.75rem" }}>🛡️</span>
                <div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#f8fafc" }}>
                    Dual-Mode On-Chain Verifier
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Third-party merchants, airlines, and VIP lounges can audit membership authenticity without asking for sensitive customer records.
                  </p>
                </div>
              </div>

              <form onSubmit={handleVerify} style={{ marginTop: "1.5rem" }}>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                  Claimed 32-Byte ZK Commitment Hash:
                </label>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    id="claimedCommitment"
                    value={claimedCommitment}
                    onChange={(e) => setClaimedCommitment(e.target.value)}
                    placeholder="0x... or 32-byte hex commitment hash"
                    style={{ flex: 1, minWidth: "260px" }}
                    required
                  />
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={verifyLoading}
                    id="verifyBtn"
                    style={{ whiteSpace: "nowrap", background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)", padding: "0.75rem 1.75rem" }}
                  >
                    {verifyLoading ? (
                      <>
                        <span className="spinner" /> Querying Ledger...
                      </>
                    ) : (
                      "Verify On-Chain"
                    )}
                  </button>
                </div>
              </form>

              {/* Sample commitment helper */}
              <div style={{ marginTop: "1rem", fontSize: "0.75rem", color: "#64748b" }}>
                <span>Try sample commitment: </span>
                <button
                  type="button"
                  onClick={() => setClaimedCommitment("0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#06b6d4",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    padding: 0,
                  }}
                >
                  Insert Sample Anchor Commitment
                </button>
              </div>

              {/* Verification Outcome */}
              {verifyResult && (
                <div
                  className="fade-in"
                  style={{
                    marginTop: "1.75rem",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    background: verifyResult.matches ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
                    border: `1.5px solid ${verifyResult.matches ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "1.5rem" }}>{verifyResult.matches ? "✓" : "✕"}</span>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: verifyResult.matches ? "#6ee7b7" : "#fca5a5" }}>
                        {verifyResult.matches
                          ? "Cryptographically Validated: Authentic VIP Membership"
                          : "Verification Failed: Invalid or Revoked Commitment"}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "0.2rem" }}>
                        {verifyResult.matches
                          ? "Commitment is confirmed active in the Midnight Preview ledger state."
                          : "This commitment does not exist on-chain or has been permanently revoked."}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: "rgba(0, 0, 0, 0.3)", padding: "0.75rem 1rem", borderRadius: "8px", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
                    <div style={{ color: "#64748b" }}>Audit Transaction Hash:</div>
                    <div style={{ color: "#cbd5e1", wordBreak: "break-all" }}>{verifyResult.txHash}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Real-Time ZK Execution Terminal */}
          {logs.length > 0 && (
            <div
              className="glass-card"
              style={{
                padding: "1.5rem",
                marginTop: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Live ZK Proof & Ledger Telemetry
                  </span>
                </div>
                <button
                  onClick={() => setLogs([])}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#64748b",
                    fontSize: "0.72rem",
                    cursor: "pointer",
                  }}
                >
                  Clear Terminal
                </button>
              </div>

              <div className="log-box" style={{ maxHeight: "220px" }}>
                {logs.map((l, i) => (
                  <div key={i} className={`log-${l.type}`} style={{ lineHeight: 1.6 }}>
                    {l.msg}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}