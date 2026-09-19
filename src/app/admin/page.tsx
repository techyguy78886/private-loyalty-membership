"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function AdminPage() {
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

  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);
  const isLoading = loadingReset || loadingMerchant || loadingRevoke || loadingSession;

  const handleSetMerchant = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingMerchant(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [ZK WITNESS] merchantSigningKey() — derived from private key, never disclosed", "info");
      addLog(`> [CIRCUIT] Executing setMerchantCommitment(Uint<32>) — minPoints=${merchantMinPoints}...`, "info");
      const client = getClient();
      client.setMerchantKey(merchantKey || "merchant_default_signing_key");
      const res = await client.setMerchantCommitment(merchantMinPoints);
      setResult({ ...res, circuit: "setMerchantCommitment(Uint<32>)" });
      addLog(`> [SUCCESS] Merchant commitment anchored on-chain!`, "success");
      addLog(`> [COMMITMENT] ${res.merchantCommitment}`, "success");
      addLog(`> [THRESHOLD] minimumTierPoints set to ${res.newMinimumPoints.toLocaleString()} pts`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingMerchant(false); }
  };

  const handleRevoke = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingRevoke(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [ZK WITNESS] merchantSigningKey() — authorization proof generated locally", "info");
      addLog(`> [CIRCUIT] Executing revokeMembership(Bytes<32>) — commitment: ${revokeCommitment.substring(0, 20)}...`, "info");
      const res = await getClient().revokeMembership(revokeCommitment);
      setResult({ ...res, circuit: "revokeMembership(Bytes<32>)" });
      addLog(`> [SUCCESS] Commitment revoked on-chain!`, "success");
      addLog(`> [REVOKED] ${res.revokedCommitment}`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingRevoke(false); }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault(); setLoadingReset(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog(`> [CIRCUIT] Executing resetProgram("${programId}", minPoints=${resetMinPoints})...`, "info");
      const res = await getClient().resetProgram(programId, resetMinPoints);
      setResult({ ...res, circuit: "resetProgram(Bytes<32>, Uint<32>)" });
      addLog(`> [SUCCESS] Program reset! New Program ID: ${res.newProgramId}`, "success");
      addLog(`> [THRESHOLD] New minimum tier points: ${res.newMinimumPoints.toLocaleString()} pts`, "success");
      addLog(`> [TXHASH] ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingReset(false); }
  };

  const handleIncrement = async () => {
    setLoadingSession(true); setLogs([]); setResult(null);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      addLog("> [CIRCUIT] Executing incrementSession() — invalidating stale proofs...", "info");
      const res = await getClient().incrementSession();
      setResult({ ...res, circuit: "incrementSession()" });
      addLog(`> [SUCCESS] Session incremented! TxHash: ${res.txHash}`, "success");
    } catch (err: any) { addLog(`> [ERROR] ${err?.message || err}`, "error"); }
    finally { setLoadingSession(false); }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge badge-amber">Admin</span>
            <span className="badge badge-purple">Merchant Authority</span>
            <span className="badge badge-green">Midnight Preview</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#f8fafc" }}>Merchant Administration Console</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "0.3rem" }}>
            Execute merchant governance circuits on the Midnight contract: configure tier requirements, anchor authority, revoke fraudulent memberships, or rotate programs.
          </p>
        </div>

        {/* Panel 1: Set Merchant Commitment */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #8b5cf6" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚡ Panel 1 — setMerchantCommitment(Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            Anchors the merchant authority commitment on-chain using <code>merchantSigningKey()</code> witness and updates the VIP tier point requirement.
          </p>
          <form onSubmit={handleSetMerchant} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                Merchant Private Key (never disclosed)
              </label>
              <input type="password" id="merchantKey" value={merchantKey} onChange={e => setMerchantKey(e.target.value)}
                placeholder="Enter merchant private signing key..." autoComplete="off" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                Minimum Tier Points Required: <span style={{ color: "#a78bfa", fontWeight: 700 }}>{merchantMinPoints.toLocaleString()} pts</span>
              </label>
              <input type="range" min={1000} max={25000} step={500} value={merchantMinPoints}
                onChange={e => setMerchantMinPoints(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#8b5cf6" }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} id="setMerchantBtn"
              style={{ alignSelf: "flex-start", marginTop: "0.25rem" }}>
              {loadingMerchant ? <><span className="spinner" /> Anchoring...</> : "Anchor Merchant Commitment (ZK)"}
            </button>
          </form>
        </div>

        {/* Panel 2: Revoke Membership */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #ef4444" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#ef4444", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚡ Panel 2 — revokeMembership(Bytes&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            Revoke a fraudulent or expired membership commitment hash on-chain. Requires merchant cryptographic authorization.
          </p>
          <form onSubmit={handleRevoke} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                Commitment Hash to Revoke *
              </label>
              <input type="text" id="revokeCommitment" value={revokeCommitment}
                onChange={e => setRevokeCommitment(e.target.value)}
                placeholder="0x... membership commitment hash to void" required />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading || !revokeCommitment} id="revokeBtn"
              style={{ alignSelf: "flex-start", background: "rgba(239,68,68,0.2)", borderColor: "rgba(239,68,68,0.5)", marginTop: "0.25rem" }}>
              {loadingRevoke ? <><span className="spinner" /> Revoking...</> : "Revoke Membership (ZK Auth)"}
            </button>
          </form>
        </div>

        {/* Panel 3: Reset Program Tier */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f59e0b", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚡ Panel 3 — resetProgram(Bytes&lt;32&gt;, Uint&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            Register a new loyalty program identifier and set baseline qualifying points for the new program season.
          </p>
          <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                New Program Identifier *
              </label>
              <input type="text" id="newProgramId" value={programId} onChange={e => setProgramId(e.target.value)}
                placeholder="program_gold_tier_2026" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.4rem" }}>
                New Minimum Points: <span style={{ color: "#f59e0b", fontWeight: 700 }}>{resetMinPoints.toLocaleString()} pts</span>
              </label>
              <input type="range" min={1000} max={25000} step={500} value={resetMinPoints}
                onChange={e => setResetMinPoints(Number(e.target.value))}
                style={{ width: "100%", accentColor: "#f59e0b" }} />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} id="resetBtn"
              style={{ alignSelf: "flex-start", background: "rgba(245,158,11,0.2)", borderColor: "rgba(245,158,11,0.5)", marginTop: "0.25rem" }}>
              {loadingReset ? <><span className="spinner" /> Updating...</> : "Update Program Tier & Threshold"}
            </button>
          </form>
        </div>

        {/* Panel 4: Increment Session Epoch */}
        <div className="glass-card" style={{ padding: "1.75rem", marginBottom: "1.5rem", borderLeft: "3px solid #06b6d4" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ⚡ Panel 4 — incrementSession()
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.25rem" }}>
            Bumps the <code>activeSession</code> nonce counter to prevent replay of proofs from previous reward periods.
          </p>
          <button onClick={handleIncrement} className="btn-secondary" disabled={isLoading} id="sessionBtn">
            {loadingSession ? <><span className="spinner" /> Incrementing...</> : "Increment Session Epoch Nonce"}
          </button>
        </div>

        {/* Activity Logs */}
        {logs.length > 0 && (
          <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>Activity Log</div>
            <div className="log-box">
              {logs.map((l, i) => <div key={i} className={`log-${l.type}`}>{l.msg}</div>)}
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
            <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>✓ Transaction Confirmed On-Chain</p>
            {Object.entries(result).map(([k, v]) => v !== undefined && (
              <div key={k} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", minWidth: 160 }}>{k}:</span>
                <span style={{ fontSize: "0.8rem", color: "#f1f5f9", fontFamily: "monospace", wordBreak: "break-all" }}>{String(v)}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <Link href="/" className="btn-secondary">Back to Dashboard</Link>
              <Link href="/explorer" className="btn-secondary">View in Explorer</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}