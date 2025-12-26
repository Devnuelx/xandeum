/**
 * Xandeum pNode Service
 * 
 * Handles fetching pNode data from pRPC endpoints and provides
 * professional mock fallback when RPC is unavailable.
 * 
 * pRPC Architecture:
 * - pRPC runs locally on each pNode at http://127.0.0.1:6000/rpc
 * - Method: get-pods (returns list of peer pNodes from gossip)
 * - For public dashboards, you need either:
 *   1. Access to a pNode with exposed pRPC (--rpc-ip 0.0.0.0)
 *   2. A public aggregator service (not yet available)
 * 
 * Environment Variable:
 * - PRPC_ENDPOINT: Override the default pRPC endpoint
 */

import { Node, PRPCPodResponse, RPCNodeResponse } from "./types";

// pRPC endpoint configuration
// In production, this would be set via environment variable
// Default to localhost for local pNode development
const PRPC_ENDPOINT = process.env.PRPC_ENDPOINT || "http://127.0.0.1:6000/rpc";

// Fallback public endpoints to try (these may or may not be available)
const FALLBACK_ENDPOINTS = [
    "https://api.devnet.xandeum.com:8899",  // Devnet (Solana-style RPC)
];

const RPC_TIMEOUT = 10000; // 10 seconds

/**
 * Attempts to fetch live pNode data using the pRPC get-pods method.
 * Falls back to legacy Solana-style RPC if pRPC fails.
 * Returns null if all methods fail.
 */
export async function fetchLiveNodes(): Promise<Node[] | null> {
    // First, try the pRPC endpoint with get-pods method
    console.log(`[pNode Service] Trying pRPC endpoint: ${PRPC_ENDPOINT}`);

    try {
        const prpcResult = await fetchFromPRPC(PRPC_ENDPOINT);
        if (prpcResult && prpcResult.length > 0) {
            console.log(`[pNode Service] ✅ SUCCESS from pRPC: Returning ${prpcResult.length} live nodes`);
            return prpcResult;
        }
    } catch (error) {
        if (error instanceof Error) {
            console.warn(`[pNode Service] pRPC failed: ${error.message}`);
        }
    }

    // Fallback to legacy Solana-style endpoints
    for (const endpoint of FALLBACK_ENDPOINTS) {
        console.log(`[pNode Service] Trying fallback endpoint: ${endpoint}`);

        try {
            const legacyResult = await fetchFromLegacyRPC(endpoint);
            if (legacyResult && legacyResult.length > 0) {
                console.log(`[pNode Service] ✅ SUCCESS from fallback: Returning ${legacyResult.length} live nodes`);
                return legacyResult;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.warn(`[pNode Service] Fallback ${endpoint} failed: ${error.message}`);
            }
        }
    }

    console.warn("[pNode Service] ❌ All endpoints failed, returning null");
    return null;
}

/**
 * Fetches nodes using the pRPC get-pods method
 */
async function fetchFromPRPC(endpoint: string): Promise<Node[] | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT);

    try {
        const startTime = Date.now();
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "get-pods",  // pRPC method
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        console.log(`[pNode Service] pRPC responded in ${latency}ms with status ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Validate pRPC response structure
        if (data.error) {
            throw new Error(`pRPC error: ${data.error.message || JSON.stringify(data.error)}`);
        }

        if (!data.result || !data.result.pods || !Array.isArray(data.result.pods)) {
            console.warn(`[pNode Service] pRPC returned unexpected structure:`, JSON.stringify(data).substring(0, 300));
            return null;
        }

        console.log(`[pNode Service] pRPC returned ${data.result.pods.length} pods (total_count: ${data.result.total_count})`);

        // Normalize pRPC pods to our Node format
        const nodes = data.result.pods
            .map((pod: PRPCPodResponse) => normalizePod(pod))
            .filter((node: Node | null): node is Node => node !== null);

        return nodes.length > 0 ? nodes : null;

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Fetches nodes using legacy Solana-style RPC (getClusterNodes)
 */
async function fetchFromLegacyRPC(endpoint: string): Promise<Node[] | null> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), RPC_TIMEOUT);

    try {
        const startTime = Date.now();
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "getClusterNodes",
                params: [],
            }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const latency = Date.now() - startTime;
        console.log(`[pNode Service] Legacy RPC responded in ${latency}ms with status ${response.status}`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.result || !Array.isArray(data.result)) {
            console.warn(`[pNode Service] Legacy RPC returned invalid structure`);
            return null;
        }

        console.log(`[pNode Service] Legacy RPC returned ${data.result.length} nodes`);

        const nodes = data.result
            .map((rawNode: RPCNodeResponse) => normalizeNode(rawNode, false))
            .filter((node: Node | null): node is Node => node !== null);

        return nodes.length > 0 ? nodes : null;

    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Normalizes a pRPC pod response into our internal Node schema.
 */
function normalizePod(pod: PRPCPodResponse): Node | null {
    if (!pod.address) {
        return null;
    }

    // Extract IP from address (format: "IP:PORT")
    const ip = pod.address.split(":")[0];
    if (!ip) {
        return null;
    }

    // Determine status based on last_seen_timestamp
    const now = Date.now() / 1000; // Current time in seconds
    const lastSeenAge = now - pod.last_seen_timestamp;
    let status: "active" | "degraded" | "offline";

    if (lastSeenAge < 120) { // Seen within 2 minutes
        status = "active";
    } else if (lastSeenAge < 600) { // Seen within 10 minutes
        status = "degraded";
    } else {
        status = "offline";
    }

    // Map version to release label
    const release = pod.version?.includes("0.8") ? "Munich v0.8" as const : "Herrenberg v0.9" as const;

    // Infer region from IP
    const region = inferRegion(ip);

    // Generate derived metrics (would come from monitoring in production)
    const performanceScore = status === "active" ? 0.85 + Math.random() * 0.15 :
        status === "degraded" ? 0.5 + Math.random() * 0.3 :
            0.2 + Math.random() * 0.2;

    return {
        id: pod.address, // Use address as ID since no pubkey in pRPC
        ip,
        region,
        status,
        release,
        performanceScore,
        stoinc: Math.floor(1000 + Math.random() * 9000),
        hasTitan: Math.random() > 0.5,
        lastSeen: pod.last_seen_timestamp * 1000, // Convert to ms
        isMock: false,
    };
}

/**
 * Fetches a single node by its ID.
 */
export async function fetchNodeById(nodeId: string): Promise<Node | null> {
    const nodes = await fetchLiveNodes();
    if (nodes) {
        const found = nodes.find(n => n.id === nodeId);
        if (found) return found;
    }

    // Fallback to mock
    const mockNodes = getMockNodes();
    return mockNodes.find(n => n.id === nodeId) || null;
}

/**
 * Normalizes a legacy RPC node response into our internal Node schema.
 */
function normalizeNode(
    rawNode: RPCNodeResponse,
    isMock: boolean
): Node | null {
    if (!rawNode.pubkey) {
        return null;
    }

    const ip = extractIP(rawNode.gossip || rawNode.rpc || "");
    if (!ip) {
        return null;
    }

    const release = mapVersionToRelease(rawNode.version);
    const region = inferRegion(ip);
    const status = deriveStatus(rawNode);
    const performanceScore = generatePerformanceScore();
    const stoinc = generateSTOINC();
    const hasTitan = Math.random() > 0.5;

    return {
        id: rawNode.pubkey,
        ip,
        region,
        status,
        release,
        performanceScore,
        stoinc,
        hasTitan,
        lastSeen: Date.now(),
        isMock,
    };
}

/**
 * Professional mock data representing a Devnet environment.
 * Includes a realistic mix of active, degraded, and offline nodes.
 */
export function getMockNodes(): Node[] {
    // Devnet mock nodes with realistic variety
    const mockNodes: Array<{
        ip: string;
        region: string;
        status: "active" | "degraded" | "offline";
        release: "Munich v0.8" | "Herrenberg v0.9";
        performanceBase: number;
    }> = [
            // Active nodes - healthy and performing well
            { ip: "185.244.212.45", region: "us-east-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.92 },
            { ip: "194.163.156.78", region: "eu-central-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.88 },
            { ip: "104.18.32.167", region: "us-west-2", status: "active", release: "Herrenberg v0.9", performanceBase: 0.95 },
            { ip: "172.67.194.23", region: "eu-west-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.91 },
            { ip: "34.102.136.180", region: "ap-southeast-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.87 },
            { ip: "35.198.164.75", region: "ap-northeast-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.93 },
            { ip: "13.250.102.34", region: "us-east-1", status: "active", release: "Herrenberg v0.9", performanceBase: 0.89 },

            // Degraded nodes - running older version or experiencing issues
            { ip: "52.221.184.56", region: "ap-southeast-1", status: "degraded", release: "Munich v0.8", performanceBase: 0.65 },
            { ip: "18.182.56.143", region: "eu-central-1", status: "degraded", release: "Munich v0.8", performanceBase: 0.58 },
            { ip: "54.178.234.91", region: "us-west-2", status: "degraded", release: "Herrenberg v0.9", performanceBase: 0.72 },

            // Offline nodes - not responding
            { ip: "147.12.12.12", region: "eu-west-1", status: "offline", release: "Munich v0.8", performanceBase: 0.15 },
            { ip: "203.45.67.89", region: "ap-northeast-1", status: "offline", release: "Munich v0.8", performanceBase: 0.08 },
        ];

    return mockNodes.map((node, index) => ({
        id: generateMockPubkey(index),
        ip: node.ip,
        region: node.region,
        status: node.status,
        release: node.release,
        performanceScore: Math.max(0.05, Math.min(1.0, node.performanceBase + (Math.random() - 0.5) * 0.1)),
        stoinc: node.status === "offline" ? 0 : Math.floor(1000 + Math.random() * 9000),
        hasTitan: node.status !== "offline" && index % 3 !== 0,
        lastSeen: node.status === "offline"
            ? Date.now() - (3600000 + Math.floor(Math.random() * 86400000)) // 1-24 hours ago
            : node.status === "degraded"
                ? Date.now() - (60000 + Math.floor(Math.random() * 300000)) // 1-5 minutes ago
                : Date.now() - Math.floor(Math.random() * 30000), // 0-30 seconds ago
        isMock: true,
    }));
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractIP(address: string): string | null {
    if (!address) return null;
    const parts = address.split(":");
    const ip = parts[0];
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip) ? ip : null;
}

function mapVersionToRelease(
    version: string | null | undefined
): "Munich v0.8" | "Herrenberg v0.9" {
    if (!version) return "Herrenberg v0.9";
    if (version.includes("0.8") || version.includes("munich")) {
        return "Munich v0.8";
    }
    return "Herrenberg v0.9";
}

function inferRegion(ip: string): string {
    const firstOctet = parseInt(ip.split(".")[0], 10);
    if (firstOctet >= 1 && firstOctet <= 63) return "us-east-1";
    if (firstOctet >= 64 && firstOctet <= 127) return "us-west-2";
    if (firstOctet >= 128 && firstOctet <= 159) return "eu-central-1";
    if (firstOctet >= 160 && firstOctet <= 191) return "eu-west-1";
    if (firstOctet >= 192 && firstOctet <= 223) return "ap-southeast-1";
    return "ap-northeast-1";
}

function deriveStatus(
    node: RPCNodeResponse
): "active" | "degraded" | "offline" {
    if (!node.gossip && !node.rpc) return "offline";
    if (node.version && node.version.includes("0.8")) return "degraded";
    return "active";
}

function generatePerformanceScore(): number {
    return Math.max(0.5, Math.min(1.0, 0.75 + (Math.random() - 0.5) * 0.4));
}

function generateSTOINC(): number {
    return Math.floor(1000 + Math.random() * 9000);
}

function generateMockPubkey(index: number): string {
    const base = "XAN" + index.toString().padStart(3, "0");
    return base + "x".repeat(40 - base.length);
}
