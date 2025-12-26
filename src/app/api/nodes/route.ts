/**
 * API Route: /api/nodes
 * 
 * Returns normalized pNode data using hybrid live/mock strategy.
 * 
 * Behavior:
 * 1. Attempts to fetch live data from Xandeum pRPC (getClusterNodes)
 * 2. Validates and normalizes response
 * 3. Falls back to mock data if RPC fails or returns invalid data
 * 4. Sets appropriate cache headers (short TTL for live data)
 */

import { NextResponse } from "next/server";
import { fetchLiveNodes, getMockNodes } from "@/lib/pnode-service";
import { NodesAPIResponse } from "@/lib/types";

export async function GET() {
    console.log("============================================================");
    console.log("[API /nodes] Request received at", new Date().toISOString());
    console.log("[API /nodes] About to call fetchLiveNodes()...");

    try {
        // Attempt to fetch live nodes
        const liveNodes = await fetchLiveNodes();
        console.log("[API /nodes] fetchLiveNodes() returned:", liveNodes ? `Array with ${liveNodes.length} items` : "null/undefined");

        if (liveNodes && liveNodes.length > 0) {
            // Live data successfully fetched
            console.log(`[API /nodes] ✅ Serving ${liveNodes.length} LIVE nodes`);
            const response: NodesAPIResponse = {
                nodes: liveNodes,
                meta: {
                    source: "live",
                    timestamp: Date.now(),
                    count: liveNodes.length,
                },
            };

            return NextResponse.json(response, {
                headers: {
                    "Cache-Control": "public, s-maxage=5, stale-while-revalidate=59",
                },
            });
        }

        // Fallback to mock data
        console.warn("[API /nodes] Live fetch failed or empty, falling back to MOCK data");
        const mockNodes = getMockNodes();
        const response: NodesAPIResponse = {
            nodes: mockNodes,
            meta: {
                source: "devnet",
                timestamp: Date.now(),
                count: mockNodes.length,
            },
        };

        return NextResponse.json(response, {
            headers: {
                "Cache-Control": "public, s-maxage=5, stale-while-revalidate=59",
            },
        });
    } catch (error) {
        console.error("[API /nodes] Unexpected error:", error);

        // Even on unexpected errors, return mock data
        const mockNodes = getMockNodes();
        const response: NodesAPIResponse = {
            nodes: mockNodes,
            meta: {
                source: "devnet",
                timestamp: Date.now(),
                count: mockNodes.length,
            },
        };

        return NextResponse.json(response, {
            status: 200, // Still return 200 to avoid breaking UI
            headers: {
                "Cache-Control": "public, s-maxage=5, stale-while-revalidate=59",
            },
        });
    }
}
