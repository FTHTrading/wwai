/**
 * Apostle Chain client — wraps :7332 REST API
 */
import { createHash, createPrivateKey, sign as cryptoSign } from "crypto";

const APOSTLE_URL = process.env.APOSTLE_URL ?? "http://localhost:7332";

export async function apostleGet(path: string) {
  const res = await fetch(`${APOSTLE_URL}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Apostle ${path} → ${res.status}`);
  return res.json();
}

export async function apostlePost(path: string, body: unknown) {
  const res = await fetch(`${APOSTLE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apostle ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

export async function getAgentBalance(agentId: string): Promise<number> {
  const data = await apostleGet(`/v1/agent/${agentId}/balance`);
  // Returns { balances: { ATP: "string_u128" } }
  const raw: string = data?.balances?.ATP ?? "0";
  return Number(BigInt(raw)) / 1e18;
}

export async function sendTransfer(params: {
  from: string;
  to: string;
  amount: string; // raw 1e18 string
  nonce: number;
  privateKeyHex: string;
}) {
  const timestamp = new Date().toISOString();
  const payload = {
    type: "transfer",
    to: params.to,
    asset: "ATP",
    amount: params.amount,
  };

  // Canonical message: deterministic serialisation of the envelope fields
  const canonical = `${params.from}:${params.nonce}:7332:${JSON.stringify(payload)}:${timestamp}`;
  const hashBytes = createHash("sha256").update(canonical).digest();
  const hashHex   = hashBytes.toString("hex"); // 64-char, no 0x prefix

  // Build a PKCS8 DER wrapper around the raw 32-byte Ed25519 private key
  // ASN.1: SEQUENCE { INTEGER 0, SEQUENCE { OID 1.3.101.112 }, OCTET STRING { OCTET STRING <key> } }
  const pkcs8Header = Buffer.from("302e020100300506032b657004220420", "hex");
  const keyBytes    = Buffer.from(params.privateKeyHex, "hex");
  const pkcs8Der    = Buffer.concat([pkcs8Header, keyBytes]);
  const privateKey  = createPrivateKey({ key: pkcs8Der, format: "der", type: "pkcs8" });

  // Ed25519 sign over the hash bytes (64 bytes → 128-char hex signature)
  const sigBytes = cryptoSign(null, hashBytes, privateKey);
  const sigHex   = sigBytes.toString("hex");

  return apostlePost("/v1/tx", {
    hash: hashHex,
    from: params.from,
    nonce: params.nonce,
    chain_id: 7332,
    payload,
    signature: sigHex,
    timestamp,
  });
}
