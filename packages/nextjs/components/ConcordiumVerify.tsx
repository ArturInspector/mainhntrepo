"use client";

import React, { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import styles from "./ConcordiumVerify.module.css";

const CONCORDIUM_ADAPTER_ABI = [
  {
    name: "verifyAndRegister",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "user", type: "address" },
      { name: "proof", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

type Step = "idle" | "connecting" | "signing" | "submitting" | "done" | "error";

interface Props {
  concordiumAdapterAddress: `0x${string}`;
  backendUrl?: string;
}

export function ConcordiumVerify({
  concordiumAdapterAddress,
  backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3001",
}: Props) {
  const { address: evmAddress } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [step, setStep] = useState<Step>("idle");
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const getConcordiumAccount = useCallback(async (): Promise<string> => {
    if (typeof window === "undefined" || !("concordium" in window)) {
      throw new Error("Concordium Browser Wallet not found. Install it from the Chrome Web Store.");
    }

    const provider = (window as any).concordium;
    const accounts: string[] = await provider.requestAccounts();

    if (!accounts || accounts.length === 0) {
      throw new Error("No Concordium account found. Please create one in the wallet.");
    }

    return accounts[0];
  }, []);

  const handleVerify = useCallback(async () => {
    if (!evmAddress) {
      setError("Connect your EVM wallet first.");
      return;
    }

    setError(null);
    setStep("connecting");

    try {
      const concordiumAccount = await getConcordiumAccount();

      setStep("signing");

      const response = await fetch(`${backendUrl}/api/concordium/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: evmAddress, concordiumAccount }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error ?? "Backend verification failed");
      }

      const { data } = await response.json();

      const proof = encodeAbiParameters(
        parseAbiParameters("bytes32"),
        [data.uid as `0x${string}`]
      );

      setStep("submitting");

      const hash = await writeContractAsync({
        address: concordiumAdapterAddress,
        abi: CONCORDIUM_ADAPTER_ABI,
        functionName: "verifyAndRegister",
        args: [evmAddress, proof],
      });

      setTxHash(hash);
      setStep("done");
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
      setStep("error");
    }
  }, [evmAddress, getConcordiumAccount, backendUrl, writeContractAsync, concordiumAdapterAddress]);

  return (
    <div className={styles.concordiumVerify}>
      <div className={styles.header}>
        <span className={styles.badge}>CONCORDIUM</span>
        <span className={`${styles.badge} ${styles.badgeKyc}`}>KYC</span>
      </div>

      <p className={styles.description}>
        Verify your identity using Concordium&apos;s built-in KYC layer.
        Your personal data is never revealed — only a ZK proof of verification.
      </p>

      {step === "idle" && (
        <button
          className={styles.btn}
          onClick={handleVerify}
          disabled={!evmAddress}
        >
          {evmAddress ? "Connect Concordium Wallet" : "Connect EVM wallet first"}
        </button>
      )}

      {(step === "connecting" || step === "signing" || step === "submitting") && (
        <div className={styles.status}>
          {step === "connecting" && "Requesting Concordium account..."}
          {step === "signing" && "Verifying with oracle..."}
          {step === "submitting" && "Submitting proof on-chain..."}
        </div>
      )}

      {step === "done" && (
        <div className={styles.success}>
          <span>Verified via Concordium</span>
          {txHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tx}
            >
              View tx
            </a>
          )}
        </div>
      )}

      {step === "error" && (
        <div className={styles.errorBox}>
          <span>{error}</span>
          <button
            className={`${styles.btn} ${styles.btnRetry}`}
            onClick={() => { setStep("idle"); setError(null); }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
