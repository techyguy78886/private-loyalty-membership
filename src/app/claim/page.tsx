"use client";
import { useState } from "react";
import { getClient } from "../../lib/contract";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function ClaimRewardPage() {
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

  const MINIMUM_POINTS = 5000;
  const addLog = (msg: string, type = "info") => setLogs(l => [...l, { msg, type }]);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null); setLogs([]);
    try {
      addLog("> [WALLET] Connecting to Midnight Lace Wallet...", "info");
      const client = getClient();
      client.setMemberKey(memberKey || "anonymous_member_key_default");
      client.setMembershipRecord(memberRecord || "default_membership_record");
      client.setMemberPoints(memberPoints);

      addLog("> [ZK WITNESS] memberSecretKey() — private identity key, never leaves device", "info");
      addLog("> [ZK WITNESS] loyaltyProofNonce() — cryptographic entropy salt generated locally", "info");
      addLog("> [ZK WITNESS] membershipRecordHash() — SHA-256 of purchase record", "info");
      addLog(`> [ZK WITNESS] memberPointBalance() — ${memberPoints.toLocaleString()} pts checked privately vs. ${MINIMUM_POINTS.toLocaleString()} threshold`, "info");
      addLog("> [ZK THRESHOLD] Verifying memberPointBalance >= minimumTierPoints in Zero-Knowledge...", "info");

      if (memberPoints < MINIMUM_POINTS) {
        addLog(`> [REJECTED] ${memberPoints.toLocaleString()} pts < ${MINIMUM_POINTS.toLocaleString()} minimum — circuit would reject proof`, "error");
        setError(`Insufficient points: ${memberPoints.toLocaleString()} pts is below the ${MINIMUM_POINTS.toLocaleString()} minimum tier threshold.`);
        return;
      }

      addLog("> [CIRCUIT] Executing claimReward(Bytes<32>) on-chain circuit on Midnight Preview...", "info");
      const res = await client.claimReward(programId);
      setResult(res);
      addLog(`> [SUCCESS] Reward claimed! TxHash: ${res.txHash}`, "success");
      addLog(`> [COMMITMENT] ZK Commitment: ${res.commitmentHex}`, "success");
      addLog(`> [PRIVACY] Point balance, identity, purchase record — NEVER disclosed on-chain`, "success");
      addLog(`> [FEE] Transaction fee: ${res.txFee} ${res.txFeeAsset}`, "info");
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
    setVerifyLoading(true); setVerifyResult(null);
    try {
      addLog("> [CIRCUIT] Executing verifyMembership(Bytes<32>) on-chain...", "info");
      const res = await getClient().verifyMembership(claimedCommitment.trim());
      setVerifyResult(res);
      addLog(res.matches
        ? "> [VERIFIED] Commitment matches on-chain record — membership is VALID"
        : "> [MISMATCH] Commitment does NOT match — membership may be invalid or revoked",
        res.matches ? "success" : "error");
    } catch (err: any) {
      addLog(`> [ERROR] ${err?.message}`, "error");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge badge-purple">ZK Reward</span>
            <span className="badge badge-green">Midnight Preview</span>
            <span className="badge badge-amber">VIP Tier</span>
          </div>
          <h1 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#f8fafc" }}>Claim Loyalty Reward Anonymously</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginTop: "0.3rem" }}>
            Prove VIP tier qualification without exposing your point balance, identity, or purchase history on-chain.
          </p>
        </div>

        {/* ZK Architecture Info Card */}
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", borderLeft: "3px solid #8b5cf6" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#8b5cf6", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            ZK Circuit Architecture — claimReward(Bytes&lt;32&gt;)
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem" }}>
            {[
              { label: "memberSecretKey()", desc: "Private identity witness", color: "#ef4444" },
              { label: "loyaltyProofNonce()", desc: "Entropy/replay binding", color: "#f59e0b" },
              { label: "membershipRecordHash()", desc: "Hashed purchase record", color: "#06b6d4" },
              { label: "memberPointBalance()", desc: "Private points >= tier", color: "#10b981" },
            ].map(w => (
              <div key={w.label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", padding: "0.75rem", border: `1px solid ${w.color}33` }}>
                <div style={{ fontFamily: "monospace", fontSize: "0.75rem", color: w.color, marginBottom: "0.25rem" }}>{w.label}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>{w.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Claim Form */}
        <div className="glass-card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
          <form onSubmit={handleClaim} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Loyalty Program Identifier (Public Input) *
              </label>
              <input type="text" id="programId" value={programId} onChange={e => setProgramId(e.target.value)}
                placeholder="program_platinum_elite" required />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>Identifies which loyalty program tier is anchored on-chain</p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Member Secret Key — Private Witness
              </label>
              <input type="password" id="memberKey" value={memberKey} onChange={e => setMemberKey(e.target.value)}
                placeholder="Your private secret key (never transmitted to network)" autoComplete="off" />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Calculated locally on device to generate <code>memberSecretKey()</code> ZK witness — never leaves browser
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Loyalty Point Balance (Threshold Check in ZK): <span style={{ color: memberPoints >= MINIMUM_POINTS ? "#10b981" : "#ef4444", fontWeight: 700 }}>{memberPoints.toLocaleString()} pts</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input type="range" min={0} max={15000} step={250} value={memberPoints}
                  onChange={e => setMemberPoints(Number(e.target.value))}
                  style={{ flex: 1, accentColor: memberPoints >= MINIMUM_POINTS ? "#10b981" : "#ef4444" }} />
                <span style={{
                  fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "99px",
                  background: memberPoints >= MINIMUM_POINTS ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: memberPoints >= MINIMUM_POINTS ? "#10b981" : "#ef4444", fontWeight: 700
                }}>
                  {memberPoints >= MINIMUM_POINTS ? "✓ VIP QUALIFIED" : "✕ BELOW TIER MIN"}
                </span>
              </div>
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Privately verified in ZK: points &gt;= {MINIMUM_POINTS.toLocaleString()} pts. Actual point count is never revealed.
              </p>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.5rem" }}>
                Membership Record / Activity Payload
              </label>
              <textarea id="memberRecord" value={memberRecord} onChange={e => setMemberRecord(e.target.value)}
                placeholder="Paste purchase or membership activity record..."
                rows={3} style={{ resize: "vertical" }} />
              <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.4rem" }}>
                Hashed locally via SHA-256 into <code>membershipRecordHash()</code> — content never exposed
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              <button type="submit" className="btn-primary" disabled={loading} id="claimBtn">
                {loading ? <><span className="spinner" /> Generating ZK Proof...</> : "💎 Claim Reward (ZK Proof)"}
              </button>
              <Link href="/" className="btn-secondary">Back to Dashboard</Link>
            </div>
          </form>
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

        {/* Error Alert */}
        {error && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
            <p style={{ color: "#fca5a5", fontWeight: 600 }}>Error</p>
            <p style={{ color: "#94a3b8", marginTop: "0.5rem", fontSize: "0.9rem" }}>{error}</p>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div className="glass-card fade-in" style={{ padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
            <p style={{ color: "#6ee7b7", fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>✓ Loyalty Reward Claim Confirmed On-Chain!</p>
            {[
              { label: "Circuit", value: "claimReward(Bytes<32>)" },
              { label: "ZK Reward Commitment", value: result.commitmentHex },
              { label: "On-Chain TxHash", value: result.txHash },
              { label: "Point Threshold Met", value: result.pointThresholdMet ? "✓ Tier Requirement Satisfied (ZK)" : "✕ Threshold Not Met" },
              { label: "Signed By", value: result.signedBy },
              { label: "Tx Fee", value: `${result.txFee} ${result.txFeeAsset}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b", minWidth: 190 }}>{label}:</span>
                <span style={{ fontSize: "0.8rem", color: "#f1f5f9", fontFamily: "monospace", wordBreak: "break-all" }}>{value as string}</span>
              </div>
            ))}
            <p style={{ fontSize: "0.8rem", color: "#10b981", marginTop: "0.75rem", fontWeight: 600 }}>Status: CONFIRMED (Midnight Preview)</p>
          </div>
        )}

        {/* Verify Membership Panel */}
        <div className="glass-card" style={{ padding: "1.5rem", borderLeft: "3px solid #06b6d4" }}>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#06b6d4", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Verify Loyalty Membership — verifyMembership(Bytes&lt;32&gt;)
          </div>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1rem" }}>
            Merchants and services can publicly verify whether a claimed loyalty commitment matches a registered membership on-chain without exposing points or identity.
          </p>
          <form onSubmit={handleVerify} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <input type="text" id="claimedCommitment" value={claimedCommitment}
              onChange={e => setClaimedCommitment(e.target.value)}
              placeholder="0x... claimed loyalty commitment hash"
              style={{ flex: 1, minWidth: "240px" }} />
            <button type="submit" className="btn-secondary" disabled={verifyLoading} id="verifyBtn" style={{ whiteSpace: "nowrap" }}>
              {verifyLoading ? <><span className="spinner" /> Verifying...</> : "Verify On-Chain"}
            </button>
          </form>
          {verifyResult && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", borderRadius: "8px",
              background: verifyResult.matches ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${verifyResult.matches ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}` }}>
              <p style={{ color: verifyResult.matches ? "#6ee7b7" : "#fca5a5", fontWeight: 700, marginBottom: "0.5rem" }}>
                {verifyResult.matches ? "✓ VALID — Loyalty Membership Verified On-Chain" : "✕ INVALID — Commitment Mismatch"}
              </p>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>TxHash: <span style={{ color: "#f1f5f9", fontFamily: "monospace" }}>{verifyResult.txHash}</span></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}