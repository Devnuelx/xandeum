/**
 * Core Data Types for Xandeum pNode Dashboard
 * 
 * This schema represents the normalized view of pNode data.
 * All nodes (live or mock) conform to this structure.
 */

/**
 * Normalized pNode structure
 * 
 * Fields:
 * - id: Node public key (from RPC: pubkey)
 * - ip: Node IP address (extracted from gossip or rpc)
 * - region: Inferred geographic region (derived via GeoIP logic)
 * - status: Health status (derived from presence in gossip response)
 * - release: Version label (mapped from version string in RPC)
 * - performanceScore: Synthetic metric 0.0-1.0 (derived/simulated)
 * - stoinc: STOINC value (derived/simulated, no guaranteed RPC endpoint)
 * - hasTitan: Titan support flag (derived/simulated)
 * - lastSeen: Unix timestamp of last observation
 * - isMock: Internal flag indicating if this is mock data (not exposed to UI directly)
 */
export interface Node {
    id: string;
    ip: string;
    region: string;
    status: "active" | "degraded" | "offline";
    release: "Munich v0.8" | "Herrenberg v0.9";
    performanceScore: number; // 0.0 - 1.0
    stoinc: number;
    hasTitan: boolean;
    lastSeen: number;
    isMock: boolean;
}

/**
 * Raw pRPC response structure from get-pods method
 * This is what we expect from http://<pnode-ip>:6000/rpc
 */
export interface PRPCPodResponse {
    address: string;           // IP:port format e.g. "192.168.1.100:9001"
    version: string;           // Software version e.g. "1.0.0"
    last_seen: string;         // Human-readable timestamp
    last_seen_timestamp: number; // Unix timestamp
}

/**
 * Full pRPC get-pods response wrapper
 */
export interface PRPCGetPodsResponse {
    jsonrpc: string;
    result: {
        pods: PRPCPodResponse[];
        total_count: number;
    };
    id: number;
}

/**
 * Legacy RPC response structure (Solana-style getClusterNodes)
 * Kept for compatibility if ever used
 */
export interface RPCNodeResponse {
    pubkey?: string;
    gossip?: string | null;
    rpc?: string | null;
    version?: string | null;
    featureSet?: number | null;
    shredVersion?: number | null;
}

/**
 * Response wrapper for the /api/nodes endpoint
 */
export interface NodesAPIResponse {
    nodes: Node[];
    meta: {
        source: "live" | "devnet" | "mock";
        timestamp: number;
        count: number;
    };
}
