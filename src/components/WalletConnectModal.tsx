"use client";

import React, { useState } from "react";
import { getClient } from "../lib/contract";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConnected: (address: string, walletName: string) => void;
}

export default function WalletConnectModal({ isOpen, onClose, onConnected }: Props) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async (walletType: "lace" | "oneam") => {
    setConnecting(walletType);
    setError(null);
    try {
      const client = getClient();
      const res = await client.connectWallet();
      onConnected(res.walletAddress, walletType === "oneam" ? "1AM Wallet" : "Midnight Lace");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to connect wallet.");
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2rem",
          background: "linear-gradient(135deg, #090d21 0%, #151036 100%)",
          border: "1px solid rgba(139, 92, 246, 0.3)",
          boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.5rem" }}>💎</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#f8fafc", letterSpacing: "-0.01em" }}>
                Connect VIP Wallet
              </h3>
              <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Private Loyalty Membership • Midnight Preview
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>

        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "1.5rem", lineHeight: 1.5 }}>
          Select your authorized Midnight wallet to authenticate confidential VIP sessions and generate zero-knowledge membership proofs.
        </p>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "10px",
            padding: "0.85rem",
            fontSize: "0.8rem",
            color: "#fca5a5",
            marginBottom: "1.25rem",
          }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <button
            onClick={() => handleConnect("lace")}
            disabled={connecting !== null}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "14px",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 92, 246, 0.12)";
              e.currentTarget.style.borderColor = "rgba(139, 92, 246, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span style={{ fontSize: "1.6rem" }}>🌙</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc" }}>Midnight Lace Wallet</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Official Chrome & Brave Extension</div>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#a78bfa", fontWeight: 600 }}>
              {connecting === "lace" ? "Connecting..." : "Preview →"}
            </span>
          </button>

          <button
            onClick={() => handleConnect("oneam")}
            disabled={connecting !== null}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "1rem 1.25rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "14px",
              color: "#f8fafc",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(6, 182, 212, 0.12)";
              e.currentTarget.style.borderColor = "rgba(6, 182, 212, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <span style={{ fontSize: "1.6rem" }}>⚡</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f8fafc" }}>1AM Wallet</div>
                <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Alternative Midnight DApp Provider</div>
              </div>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#22d3ee", fontWeight: 600 }}>
              {connecting === "oneam" ? "Connecting..." : "Preview →"}
            </span>
          </button>
        </div>

        <div style={{
          marginTop: "1.75rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.75rem",
          color: "#64748b",
        }}>
          <span>Target Network:</span>
          <span style={{ color: "#a78bfa", fontWeight: 600 }}>Midnight Preview Testnet</span>
        </div>
      </div>
    </div>
  );
}
