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
    try {
        // Attempt to fetch live nodes
        const liveNodes = await fetchLiveNodes();

        if (liveNodes && liveNodes.length > 0) {
            // Live data successfully fetched
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
        const mockNodes = getMockNodes();
        const response: NodesAPIResponse = {
            nodes: mockNodes,
            meta: {
                source: "mock",
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
                source: "mock",
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
