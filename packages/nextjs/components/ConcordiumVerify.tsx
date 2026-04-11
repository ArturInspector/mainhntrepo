"use client";

import React, { useState, useCallback } from "react";
import { useAccount, useWriteContract } from "wagmi";

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

  const detectWallet = useCallback((): boolean => {
    return typeof window !== "undefined" && "concordiumSDK" in window;
  }, []);

  const getConcordiumAccount = useCallback(async (): Promise<string> => {
    if (!detectWallet()) {
      throw new Error("Concordium Browser Wallet not found. Install it from the Chrome Web Store.");
    }

    const provider = (window as any).concordiumSDK;
    const accounts: string[] = await provider.requestAccounts();

    if (!accounts || accounts.length === 0) {
      throw new Error("No Concordium account found. Please create one in the wallet.");
    }

    return accounts[0];
  }, [detectWallet]);

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

      const proof = encodeProof(data.concordiumAccountHash, data.timestamp, data.signature);

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
    <div className="concordium-verify">
      <div className="concordium-verify__header">
        <span className="concordium-verify__badge">CONCORDIUM</span>
        <span className="concordium-verify__badge concordium-verify__badge--kyc">KYC</span>
      </div>

      <p className="concordium-verify__description">
        Verify your identity using Concordium&apos;s built-in KYC layer.
        Your personal data is never revealed — only a ZK proof of verification.
      </p>

      {step === "idle" && (
        <button
          className="concordium-verify__btn"
          onClick={handleVerify}
          disabled={!evmAddress}
        >
          {evmAddress ? "Connect Concordium Wallet" : "Connect EVM wallet first"}
        </button>
      )}

      {step === "connecting" && (
        <div className="concordium-verify__status">
          Requesting Concordium account...
        </div>
      )}

      {step === "signing" && (
        <div className="concordium-verify__status">
          Verifying with oracle...
        </div>
      )}

      {step === "submitting" && (
        <div className="concordium-verify__status">
          Submitting proof on-chain...
        </div>
      )}

      {step === "done" && (
        <div className="concordium-verify__success">
          <span>Verified via Concordium</span>
          {txHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="concordium-verify__tx"
            >
              View tx
            </a>
          )}
        </div>
      )}

      {step === "error" && (
        <div className="concordium-verify__error">
          <span>{error}</span>
          <button
            className="concordium-verify__btn concordium-verify__btn--retry"
            onClick={() => { setStep("idle"); setError(null); }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}

function encodeProof(accountHash: string, timestamp: number, signature: string): `0x${string}` {
  const { AbiCoder } = require("ethers");
  const coder = AbiCoder.defaultAbiCoder();
  return coder.encode(
    ["bytes32", "uint256", "bytes"],
    [accountHash, timestamp, signature]
  ) as `0x${string}`;
}
