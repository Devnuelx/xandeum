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
 * Raw RPC response structure from getClusterNodes
 * This is what we expect from https://rpc.xandeum.network
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
        source: "live" | "mock";
        timestamp: number;
        count: number;
    };
}
