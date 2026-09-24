"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getClient, CONTRACT_ADDRESS, NETWORK_CONFIG } from "../lib/contract";
import WalletConnectModal from "./WalletConnectModal";

export default function Navbar() {
  const pathname = usePathname();
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string>("Midnight Lace");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const client = getClient();
    const status = client.getWalletStatus();
    if (status.connected && status.address) {
      setConnected(true);
      setAddress(status.address);
    }
  }, []);

  const handleDisconnect = () => {
    const client = getClient();
    client.disconnectWallet();
    setConnected(false);
    setAddress(null);
  };

  const formatAddr = (addr: string) => {
    if (addr.length <= 16) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "rgba(3, 7, 18, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "0.85rem 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(245, 158, 11, 0.2) 100%)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.35rem",
              boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
            }}
          >
            💎
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#f8fafc", letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span>PLM</span>
              <span style={{ color: "#f59e0b", fontSize: "0.75rem", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "4px", padding: "1px 5px" }}>
                VIP.ZK
              </span>
            </div>
            <div style={{ fontSize: "0.68rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Private Loyalty Membership
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
          <Link
            href="/"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: pathname === "/" ? "#f59e0b" : "#94a3b8",
              background: pathname === "/" ? "rgba(245, 158, 11, 0.12)" : "transparent",
              border: pathname === "/" ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Overview
          </Link>
          <Link
            href="/claim"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: pathname === "/claim" ? "#a78bfa" : "#94a3b8",
              background: pathname === "/claim" ? "rgba(139, 92, 246, 0.12)" : "transparent",
              border: pathname === "/claim" ? "1px solid rgba(139, 92, 246, 0.3)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Claim Rewards
          </Link>
          <Link
            href="/admin"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: pathname === "/admin" ? "#22d3ee" : "#94a3b8",
              background: pathname === "/admin" ? "rgba(6, 182, 212, 0.12)" : "transparent",
              border: pathname === "/admin" ? "1px solid rgba(6, 182, 212, 0.3)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Merchant Admin
          </Link>
          <Link
            href="/explorer"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.88rem",
              fontWeight: 600,
              color: pathname === "/explorer" ? "#34d399" : "#94a3b8",
              background: pathname === "/explorer" ? "rgba(16, 185, 129, 0.12)" : "transparent",
              border: pathname === "/explorer" ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
          >
            Explorer
          </Link>
        </nav>

        {/* Right Actions: Network & Wallet */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          {/* Midnight Network Heartbeat Indicator */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              padding: "0.35rem 0.85rem",
              borderRadius: "50px",
              fontSize: "0.78rem",
              color: "#34d399",
              fontWeight: 600,
            }}
          >
            <span
              className="pulse-indicator"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 8px #10b981",
              }}
            />
            <span>Midnight Preview</span>
          </div>

          {connected && address ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  background: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "#fbbf24",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span>🔑</span>
                <span>{formatAddr(address)}</span>
              </div>
              <button
                onClick={handleDisconnect}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  color: "#94a3b8",
                  padding: "0.4rem 0.75rem",
                  borderRadius: "8px",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#f87171";
                  e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#94a3b8";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{
                fontSize: "0.85rem",
                padding: "0.5rem 1.15rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#030712",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.35)",
              }}
            >
              <span>🌙</span> Connect Wallet
            </button>
          )}
        </div>
      </header>

      <WalletConnectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnected={(addr, name) => {
          setConnected(true);
          setAddress(addr);
          setWalletName(name);
        }}
      />
    </>
  );
}