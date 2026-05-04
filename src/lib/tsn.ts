/**
 * Troptions Settlement Network (TSN) — TypeScript client layer
 *
 * Mirrors the official TROPTIONS Rust L1 crate definitions:
 *   C:\Users\Kevan\troptions\troptions-rust-l1\crates\
 *
 * TSN is currently devnet/simulation-only (in-process JSON-RPC 2.0).
 * When the TSN HTTP node comes online, set TSN_NODE_URL in .env.local.
 * Until then, all operations return simulation receipts with hashes.
 */

import { createHash } from "crypto";

// ── Connection ────────────────────────────────────────────────────────────────
const TSN_NODE_URL = process.env.TSN_NODE_URL ?? null; // null = simulation mode

export const TSN_CHAIN_ID  = "tsn-devnet";
export const TSN_SIMULATION = true; // matches SIMULATION_ONLY in Rust

// ── Namespace Registry (mirrors crates/namespaces/src/lib.rs) ─────────────────
export type NamespaceStatus  = "active" | "reserved" | "evidence_required" | "blocked" | "retired";
export type NamespaceKind    = "root" | "brand" | "token" | "payment" | "commodity" |
                               "media" | "nil" | "rwa" | "merchant" | "charity" |
                               "compliance" | "settlement" | "education" | "legacy" | "carbon";

export interface TsnNamespace {
  name: string;
  kind: NamespaceKind;
  status: NamespaceStatus;
  controller?: string;
  note?: string;
}

/** Official TROPTIONS namespace registry — matches NamespaceRegistry::initialize() in Rust */
export const TSN_NAMESPACES: TsnNamespace[] = [
  { name: "troptions.root",        kind: "root",        status: "active",            controller: "troptions-core" },
  { name: "troptions.org",         kind: "brand",       status: "active" },
  { name: "troptions.xchange",     kind: "token",       status: "blocked",           note: "legacy exchange claims require evidence and provider approval" },
  { name: "troptions.pay",         kind: "payment",     status: "blocked",           note: "requires provider agreement and compliance gate" },
  { name: "troptions.unity",       kind: "payment",     status: "blocked",           note: "legacy payment namespace" },
  { name: "troptions.gold",        kind: "commodity",   status: "evidence_required", note: "commodity claims require regulatory approval" },
  { name: "troptions.aus",         kind: "commodity",   status: "evidence_required", note: "asset claims under review" },
  { name: "troptions.university",  kind: "education",   status: "active" },
  { name: "troptions.tv",          kind: "media",       status: "active" },
  { name: "troptions.nil",         kind: "nil",         status: "active",            note: "NIL athlete deal protocol — simulation only" },
  { name: "troptions.rwa",         kind: "rwa",         status: "reserved",          note: "real world asset namespace" },
  { name: "troptions.merchant",    kind: "merchant",    status: "reserved" },
  { name: "troptions.givbux",      kind: "charity",     status: "reserved" },
  { name: "troptions.compliance",  kind: "compliance",  status: "active" },
  { name: "troptions.settlement",  kind: "settlement",  status: "blocked",           note: "settlement requires Control Hub approval" },
];

// ── Hashing (mirrors crates/crypto/src/lib.rs sha256_hex) ─────────────────────
export function tsnSha256Hex(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

// ── NFT Receipt (mirrors crates/nft/src/lib.rs + crates/nil/src/receipt.rs) ───
export interface TsnNftReceipt {
  receipt_id: string;
  receipt_type: "listing_fill" | "option_exercise" | "nil_deal";
  subject_hash: string;       // sha256 of canonical payload
  holder_id: string;          // buyer/athlete address
  issuer_id: string;          // platform / seller address
  metadata_hash: string;
  chain_target: string;       // "tsn-devnet" | "xrpl" | "stellar"
  simulation_only: true;
  issued_at: string;          // ISO 8601
  disclaimer: string;
}

const RECEIPT_DISCLAIMER =
  "This receipt is an unsigned simulation record from the Troptions Settlement Network devnet. " +
  "No live settlement, token transfer, or NFT issuance is enabled. " +
  "Production activity requires Control Hub approval and legal review.";

/** Issue a simulation NFT receipt for a market listing fill */
export function issueListingReceipt(params: {
  cardName: string;
  price: number;
  currency: string;
  buyerAddress: string;
  sellerAddress: string;
  listingId: string;
}): TsnNftReceipt {
  const canonical = JSON.stringify({
    listing_id: params.listingId,
    card_name:  params.cardName,
    price:      params.price,
    currency:   params.currency,
    buyer:      params.buyerAddress,
    seller:     params.sellerAddress,
  });
  const hash = tsnSha256Hex(canonical);
  return {
    receipt_id:    tsnSha256Hex(`listing-${params.listingId}-${Date.now()}`).slice(0, 16),
    receipt_type:  "listing_fill",
    subject_hash:  hash,
    holder_id:     params.buyerAddress,
    issuer_id:     params.sellerAddress,
    metadata_hash: tsnSha256Hex(params.cardName + params.listingId),
    chain_target:  "tsn-devnet",
    simulation_only: true,
    issued_at:     new Date().toISOString(),
    disclaimer:    RECEIPT_DISCLAIMER,
  };
}

/** Issue a simulation NFT receipt for an options exercise (NIL deal path) */
export function issueOptionReceipt(params: {
  cardName: string;
  strikePrice: number;
  contractType: string;
  buyerAddress: string;
  sellerAddress: string;
  contractId: string;
}): TsnNftReceipt {
  const canonical = JSON.stringify({
    contract_id:   params.contractId,
    card_name:     params.cardName,
    contract_type: params.contractType,
    strike_price:  params.strikePrice,
    buyer:         params.buyerAddress,
    seller:        params.sellerAddress,
    // NIL protocol: sport = "soccer", vertical = "team_sport"
    tsn_nil_sport: "soccer",
    tsn_namespace: "troptions.nil",
  });
  const hash = tsnSha256Hex(canonical);
  return {
    receipt_id:    tsnSha256Hex(`option-${params.contractId}-${Date.now()}`).slice(0, 16),
    receipt_type:  "option_exercise",
    subject_hash:  hash,
    holder_id:     params.buyerAddress,
    issuer_id:     params.sellerAddress,
    metadata_hash: tsnSha256Hex(params.cardName + params.contractId),
    chain_target:  "tsn-devnet",
    simulation_only: true,
    issued_at:     new Date().toISOString(),
    disclaimer:    RECEIPT_DISCLAIMER,
  };
}

// ── JSON-RPC 2.0 (when TSN HTTP node is live) ──────────────────────────────────
export async function tsnRpcCall(method: string, params?: unknown): Promise<unknown> {
  if (!TSN_NODE_URL) {
    // Simulation: return devnet stub responses
    if (method === "tsn_ping")       return { pong: true, timestamp: new Date().toISOString(), simulation_only: true };
    if (method === "tsn_getVersion") return { version: "0.1.0", network: TSN_CHAIN_ID, simulation_only: true, live_execution_enabled: false };
    if (method === "tsn_getStatus")  return { network: TSN_CHAIN_ID, simulation_only: true, namespaces: TSN_NAMESPACES.length, all_online: false };
    return null;
  }
  const res = await fetch(TSN_NODE_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params: params ?? null, id: 1 }),
    cache: "no-store",
  });
  const data = await res.json();
  if (data.error) throw new Error(`TSN RPC ${method}: ${data.error.message}`);
  return data.result;
}
