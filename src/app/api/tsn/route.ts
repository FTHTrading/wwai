export const runtime = 'edge';

import { NextResponse } from "next/server";
import { TSN_NAMESPACES, TSN_CHAIN_ID, tsnRpcCall } from "@/lib/tsn";

export async function GET() {
  let nodeStatus: unknown = null;
  try {
    nodeStatus = await tsnRpcCall("tsn_getStatus");
  } catch {
    nodeStatus = null;
  }

  return NextResponse.json({
    network:         TSN_CHAIN_ID,
    simulation_only: true,
    node_online:     nodeStatus !== null,
    namespaces:      TSN_NAMESPACES,
    node_status:     nodeStatus,
    disclaimer:
      "Troptions Settlement Network is devnet/simulation-only. " +
      "No live chain, banking, token, or settlement execution is enabled.",
  });
}
