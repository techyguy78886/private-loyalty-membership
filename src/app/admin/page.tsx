"use client";
import React, { useState } from "react";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../../lib/contract";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function AdminPage() {
  const [activeModule, setActiveModule] = useState<"authority" | "revoke" | "reset" | "session">("authority");

  const [programId, setProgramId] = useState("program_gold_tier_2026");
  const [resetMinPoints, setResetMinPoints] = useState(5000);
  const [loadingReset, setLoadingReset] = useState(false);

  const [merchantKey, setMerchantKey] = useState("");
  const [merchantMinPoints, setMerchantMinPoints] = useState(5000);
  const [loadingMerchant, setLoadingMerchant] = useState(false);

  const [revokeCommitment, setRevokeCommitment] = useState("");
  const [loadingRevoke, setLoadingRevoke] = useState(false);

  const [loadingSession, setLoadingSession] = useState(false);

  const [result, setResult] = useState<any>(null);
  const [logs, setLogs] = useState<{ msg: string; type: string }[]>([]);

  const addLog = (msg: string, type = "info") => setLogs((l) => [...l, { msg, type }]);
  const isLoading = loadingReset || loadingMerchant || loadingRevoke || loadingSession;

  const handleSetMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingMerchant(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet (Merchant Enclave)...", "info");
      addLog("> [ZK WITNESS] Generating merchantSigningKey() witness in private memory enclave...", "info");
      addLog(`> [CIRCUIT] Executing setMerchantCommitment(Uint<32>) on Midnight Preview with minPoints=${merchantMinPoints}...`, "info");
      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_signing_key");
      const res = await client.setMerchantCommitment(merchantMinPoints);
      setResult({ ...res, circuit: "setMerchantCommitment(Uint<32>)" });
      addLog(`> [SUCCESS] Merchant authority commitment anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] Public Authority Anchor: ${res.merchantCommitment}`, "success");
      addLog(`> [THRESHOLD] Updated minimumTierPoints to ${res.newMinimumPoints.toLocaleString()} pts`, "success");
      addLog(`> [TXHASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingMerchant(false);
    }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingRevoke(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Verifying merchant cryptographic credentials...", "info");
      addLog("> [ZK WITNESS] Compiling merchantSigningKey() witness to authorize revocation...", "info");
      addLog(`> [CIRCUIT] Executing revokeMembership(Bytes<32>) — target: ${revokeCommitment.substring(0, 18)}...`, "info");
      const res = await getClient().revokeMembership(revokeCommitment);
      setResult({ ...res, circuit: "revokeMembership(Bytes<32>)" });
      addLog(`> [SUCCESS] Commitment permanently revoked on Midnight Preview ledger!`, "success");
      addLog(`> [REVOKED TARGET] ${res.revokedCommitment}`, "success");
      addLog(`> [TXHASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingRevoke(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingReset(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Network...", "info");
      addLog(`> [CIRCUIT] Executing resetProgram("${programId}", minPoints=${resetMinPoints})...`, "info");
      const res = await getClient().resetProgram(programId, resetMinPoints);
      setResult({ ...res, circuit: "resetProgram(Bytes<32>, Uint<32>)" });
      addLog(`> [SUCCESS] Loyalty Program re-initialized!`, "success");
      addLog(`> [PROGRAM ID] ${res.newProgramId}`, "success");
      addLog(`> [THRESHOLD] Baseline qualifying points: ${res.newMinimumPoints.toLocaleString()} pts`, "success");
      addLog(`> [TXHASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingReset(false);
    }
  };

  const handleIncrement = async () => {
    setLoadingSession(true);
    setLogs([]);
    setResult(null);
    try {
      addLog("> [WALLET] Requesting session nonce bump...", "info");
      addLog("> [CIRCUIT] Executing incrementSession() to advance anti-replay epoch...", "info");
      const res = await getClient().incrementSession();
      setResult({ ...res, circuit: "incrementSession()" });
      addLog(`> [SUCCESS] Active session epoch bumped on-chain!`, "success");
      addLog(`> [TXHASH] Finalized block: ${res.txHash}`, "success");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message || err}`, "error");
    } finally {
      setLoadingSession(false);
    }
  };

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
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, rgba(139, 92, 246, 0.08) 60%, transparent 80%)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        <div style={{ maxWidth: "960px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "inline-flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
              <span className="badge badge-amber">Merchant Authority</span>
              <span className="badge badge-purple">On-Chain Governance</span>
              <span className="badge badge-green">Midnight Preview</span>
            </div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 2.75rem)", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.02em" }}>
              Merchant Governance Center
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "1rem", maxWidth: "660px", margin: "0.5rem auto 0" }}>
              Control policy thresholds, anchor authority commitments, invalidate fraudulent tokens, and rotate loyalty seasons via Midnight smart contract circuits.
            </p>

            {/* Navigation Tabs for Modules */}
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
              {[
                { id: "authority", label: "👑 Anchor Authority", color: "#8b5cf6" },
                { id: "revoke", label: "🚫 Revoke Pass", color: "#ef4444" },
                { id: "reset", label: "🔄 Program Epoch", color: "#f59e0b" },
                { id: "session", label: "⏱️ Anti-Replay", color: "#06b6d4" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveModule(tab.id as any);
                    setResult(null);
                  }}
                  style={{
                    padding: "0.55rem 1.4rem",
                    borderRadius: "50px",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    border: "none",
                    transition: "all 0.25s ease",
                    background: activeModule === tab.id ? `${tab.color}35` : "transparent",
                    color: activeModule === tab.id ? "#ffffff" : "#94a3b8",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: activeModule === tab.id ? tab.color : "transparent",
                    boxShadow: activeModule === tab.id ? `0 4px 15px ${tab.color}30` : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Module 1: Anchor Authority */}
          {activeModule === "authority" && (
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.75rem" }}>👑</span>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                    Anchor Merchant Commitment & VIP Threshold
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Circuit: <code>setMerchantCommitment(Uint&lt;32&gt;)</code> — Requires <code>merchantSigningKey</code> witness
                  </p>
                </div>
              </div>

              <form onSubmit={handleSetMerchant} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                    Merchant Private Signing Key (Protected in Local Memory) *
                  </label>
                  <input
                    type="password"
                    id="merchantKey"
                    value={merchantKey}
                    onChange={(e) => setMerchantKey(e.target.value)}
                    placeholder="Enter merchant enclave signing key..."
                    autoComplete="off"
                    style={{ width: "100%" }}
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                    Generates the zero-knowledge authorization proof without disclosing the private root key.
                  </p>
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "1.25rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1" }}>
                      New Qualifying Point Threshold
                    </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#c084fc", fontFamily: "var(--font-mono)" }}>
                      {merchantMinPoints.toLocaleString()} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={30000}
                    step={500}
                    value={merchantMinPoints}
                    onChange={(e) => setMerchantMinPoints(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#8b5cf6", cursor: "pointer" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  id="setMerchantBtn"
                  style={{ alignSelf: "flex-start", padding: "0.85rem 2rem" }}
                >
                  {loadingMerchant ? (
                    <>
                      <span className="spinner" /> Anchoring Authority...
                    </>
                  ) : (
                    "Anchor Authority & Update Policy (ZK)"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Module 2: Revocation */}
          {activeModule === "revoke" && (
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1px solid rgba(239, 68, 68, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.75rem" }}>🚫</span>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                    Revoke Membership Commitment
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Circuit: <code>revokeMembership(Bytes&lt;32&gt;)</code> — Instantly voids a compromised or refunded pass
                  </p>
                </div>
              </div>

              <form onSubmit={handleRevoke} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                    Commitment Hash to Revoke *
                  </label>
                  <input
                    type="text"
                    id="revokeCommitment"
                    value={revokeCommitment}
                    onChange={(e) => setRevokeCommitment(e.target.value)}
                    placeholder="0x... 32-byte hexadecimal commitment to invalidate"
                    required
                    style={{ width: "100%" }}
                  />
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "0.4rem" }}>
                    Once revoked on-chain, all future reward claims and check-ins using this commitment will be permanently rejected.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setRevokeCommitment("0x5e6d68d8256c168f30bb2c1c4f604b50a5542569cc3f6876d71954c1e15047e8")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#f87171",
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontSize: "0.75rem",
                    }}
                  >
                    Load Target Test Commitment
                  </button>
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading || !revokeCommitment}
                  id="revokeBtn"
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(239, 68, 68, 0.25)",
                    borderColor: "rgba(239, 68, 68, 0.6)",
                    color: "#fca5a5",
                    padding: "0.85rem 2rem",
                  }}
                >
                  {loadingRevoke ? (
                    <>
                      <span className="spinner" /> Processing Revocation...
                    </>
                  ) : (
                    "Execute On-Chain Revocation"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Module 3: Program Reset / Season Rotation */}
          {activeModule === "reset" && (
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1px solid rgba(245, 158, 11, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.75rem" }}>🔄</span>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                    Rotate Loyalty Program Season
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Circuit: <code>resetProgram(Bytes&lt;32&gt;, Uint&lt;32&gt;)</code> — Initiates a new annual or seasonal epoch
                  </p>
                </div>
              </div>

              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.5rem" }}>
                    New Program Identifier (String/Bytes) *
                  </label>
                  <input
                    type="text"
                    id="newProgramId"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    placeholder="program_gold_tier_2026"
                    required
                    style={{ width: "100%" }}
                  />
                </div>

                <div
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    padding: "1.25rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1" }}>
                      Baseline Season Qualifying Threshold
                    </span>
                    <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fbbf24", fontFamily: "var(--font-mono)" }}>
                      {resetMinPoints.toLocaleString()} pts
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={25000}
                    step={500}
                    value={resetMinPoints}
                    onChange={(e) => setResetMinPoints(Number(e.target.value))}
                    style={{ width: "100%", accentColor: "#f59e0b", cursor: "pointer" }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isLoading}
                  id="resetBtn"
                  style={{
                    alignSelf: "flex-start",
                    background: "rgba(245, 158, 11, 0.25)",
                    borderColor: "rgba(245, 158, 11, 0.6)",
                    color: "#fde68a",
                    padding: "0.85rem 2rem",
                  }}
                >
                  {loadingReset ? (
                    <>
                      <span className="spinner" /> Rotating Season...
                    </>
                  ) : (
                    "Rotate Program Season & Epoch"
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Module 4: Anti-Replay Session Bump */}
          {activeModule === "session" && (
            <div
              className="glass-card"
              style={{
                padding: "2.25rem",
                marginBottom: "2rem",
                border: "1px solid rgba(6, 182, 212, 0.3)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "1.75rem" }}>⏱️</span>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f8fafc" }}>
                    Increment Session Epoch Nonce
                  </h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                    Circuit: <code>incrementSession()</code> — Invalidate stale ZK proofs from prior verification periods
                  </p>
                </div>
              </div>

              <p style={{ fontSize: "0.88rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Advancing the on-chain session nonce forces all future proof evaluations to bind to the newest epoch. This prevents replay attacks where a member attempts to recycle a previously accepted proof.
              </p>

              <button
                onClick={handleIncrement}
                className="btn-primary"
                disabled={isLoading}
                id="sessionBtn"
                style={{
                  background: "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
                  padding: "0.85rem 2rem",
                }}
              >
                {loadingSession ? (
                  <>
                    <span className="spinner" /> Advancing Nonce...
                  </>
                ) : (
                  "Increment Session Nonce Counter"
                )}
              </button>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div
              className="glass-card fade-in"
              style={{
                padding: "2rem",
                marginBottom: "1.75rem",
                border: "1.5px solid rgba(16, 185, 129, 0.4)",
                background: "rgba(16, 185, 129, 0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "1.5rem", color: "#10b981" }}>✓</span>
                <h4 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f8fafc" }}>
                  Governance Circuit Finalized On-Chain
                </h4>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {Object.entries(result).map(
                  ([k, v]) =>
                    v !== undefined && (
                      <div key={k} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.82rem", color: "#64748b", minWidth: 170, textTransform: "capitalize" }}>
                          {k}:
                        </span>
                        <span style={{ fontSize: "0.82rem", color: "#e2e8f0", fontFamily: "var(--font-mono)", wordBreak: "break-all" }}>
                          {String(v)}
                        </span>
                      </div>
                    )
                )}
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                <Link href="/explorer" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}>
                  Inspect in Explorer ↗
                </Link>
                <Link href="/" className="btn-secondary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.82rem" }}>
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}

          {/* Activity Logs */}
          {logs.length > 0 && (
            <div
              className="glass-card"
              style={{
                padding: "1.5rem",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Governance Execution Logs
                </span>
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
                  Clear Logs
                </button>
              </div>

              <div className="log-box" style={{ maxHeight: "200px" }}>
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