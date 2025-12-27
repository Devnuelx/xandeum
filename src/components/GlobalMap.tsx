"use client";

import { useEffect, useState, useMemo } from "react";
import DottedMap from "dotted-map";
import { Node } from "@/lib/types";
import Loader from "@/components/Loader";
import styles from "./GlobalMap.module.css";

interface GlobalMapProps {
    nodes: Node[];
}

interface CountryStats {
    code: string;
    name: string;
    requests: number;
    rps: number;
    color: string;
}

// Colors for top countries
const COUNTRY_COLORS = [
    "#3b82f6", // Blue (US)
    "#eab308", // Yellow (DE/GB)
    "#f97316", // Orange (IN)
    "#ef4444", // Red (BR/JP)
    "#10b981", // Green (SG)
    "#8b5cf6", // Purple
    "#ec4899", // Pink
];

export default function GlobalMap({ nodes }: GlobalMapProps) {
    const [svgMap, setSvgMap] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);

    // Calculate statistics
    const stats = useMemo(() => {
        const totalRequests = nodes.reduce((acc, node) => acc + (node.requests || 0), 0);
        const totalRps = nodes.reduce((acc, node) => acc + (node.requestsPerSecond || 0), 0);

        // Group by country
        const countryMap = new Map<string, CountryStats>();

        nodes.forEach(node => {
            if (!node.country || node.status === 'offline' || node.country === 'Unknown') return;

            const country = node.country;
            const code = getCountryCode(country);

            if (countryMap.has(country)) {
                const stat = countryMap.get(country)!;
                stat.requests += node.requests || 0;
                stat.rps += node.requestsPerSecond || 0;
            } else {
                countryMap.set(country, {
                    code,
                    name: country,
                    requests: node.requests || 0,
                    rps: node.requestsPerSecond || 0,
                    color: "#64748b",
                });
            }
        });

        // Sort by requests and assign colors
        const topCountries = Array.from(countryMap.values())
            .sort((a, b) => b.requests - a.requests)
            .slice(0, 7)
            .map((country, idx) => ({
                ...country,
                color: COUNTRY_COLORS[idx % COUNTRY_COLORS.length]
            }));

        return { totalRequests, totalRps, topCountries };
    }, [nodes]);

    useEffect(() => {
        // Show loading if no valid nodes with location data
        const nodesWithLocation = nodes.filter(n =>
            n.latitude && n.longitude && n.status !== 'offline' && n.country !== 'Unknown'
        );

        if (nodesWithLocation.length === 0) {
            setIsLoading(true);
            return;
        }

        setIsLoading(false);

        // Create dotted map
        const map = new DottedMap({ height: 60, grid: "diagonal" });

        // Add one pin for EACH node with scatter offset for visibility
        nodesWithLocation.forEach((node, index) => {
            // Find country color - all nodes from same country get same color
            const countryStat = stats.topCountries.find(c => c.name === node.country);
            const color = countryStat ? countryStat.color : "#475569";

            // Add larger random offset to scatter nodes visibly across regions
            // ±3 degrees creates good distribution for 250+ nodes
            const offsetLat = (Math.random() - 0.5) * 10; // ±3 degrees latitude
            const offsetLng = (Math.random() - 0.5) * 6; // ±3 degrees longitude

            map.addPin({
                lat: node.latitude! + offsetLat,
                lng: node.longitude! + offsetLng,
                svgOptions: { color, radius: 0.5 }, // Larger dots for visibility
            });
        });

        // Generate SVG
        const svgString = map.getSVG({
            radius: 0.22,
            color: "#334155",
            shape: "circle",
            backgroundColor: "transparent",
        });

        setSvgMap(svgString);
    }, [nodes, stats.topCountries]);

    // Calculate locations and countries for bottom stats
    const uniqueLocations = new Set(nodes.filter(n => n.city && n.city !== 'Unknown').map(n => n.city));
    const uniqueCountries = new Set(nodes.filter(n => n.country && n.country !== 'Unknown').map(n => n.country));

    // Show loader if no data
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loaderWrapper}>
                    <Loader />
                    <p className={styles.loaderText}>Loading global network data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.subtitle}>GLOBAL NETWORK ACTIVITY</div>
                <div className={styles.totalRequests}>
                    {stats.totalRequests.toLocaleString()}
                </div>
                <div className={styles.totalRps}>
                    {stats.totalRps.toLocaleString()}/s
                </div>
            </div>

            <div className={styles.contentGrid}>
                {/* Left Side: Top Countries */}
                <div className={styles.statsColumn}>
                    <div className={styles.columnTitle}>TOP COUNTRIES BY REQUESTS</div>
                    <div className={styles.countryList}>
                        {stats.topCountries.length > 0 ? (
                            stats.topCountries.map((country, idx) => (
                                <div key={idx} className={styles.countryRow}>
                                    <span
                                        className={styles.countryIndicator}
                                        style={{ backgroundColor: country.color }}
                                    />
                                    <span className={styles.countryCode}>{country.code}</span>
                                    <span className={styles.countryRequests}>
                                        {country.requests.toLocaleString()}
                                    </span>
                                    <span className={styles.countryRps}>
                                        {country.rps.toLocaleString()}/s
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className={styles.noData}>No country data available</div>
                        )}
                    </div>
                    {stats.topCountries.length > 0 && (
                        <div className={styles.regionsNote}>
                            ▲ {stats.topCountries.length} Countries
                        </div>
                    )}
                </div>

                {/* Right Side: Map */}
                <div className={styles.mapColumn}>
                    <div
                        className={styles.mapWrapper}
                        dangerouslySetInnerHTML={{ __html: svgMap }}
                    />
                </div>
            </div>

            {/* Bottom Stats */}
            <div className={styles.bottomStats}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>TOTAL NODES</div>
                    <div className={styles.statValue}>{nodes.length.toLocaleString()}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>ONLINE NODES</div>
                    <div className={styles.statValue}>
                        {nodes.filter(n => n.status === 'active').length.toLocaleString()}
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>LOCATIONS</div>
                    <div className={styles.statValue}>{uniqueLocations.size}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>COUNTRIES</div>
                    <div className={styles.statValue}>{uniqueCountries.size}</div>
                </div>
            </div>
        </div>
    );
}

function getCountryCode(country: string): string {
    const codes: Record<string, string> = {
        "United States": "US",
        "United Kingdom": "GB",
        "Germany": "DE",
        "India": "IN",
        "Brazil": "BR",
        "Singapore": "SG",
        "Japan": "JP",
        "France": "FR",
        "Australia": "AU",
        "Canada": "CA",
        "Ireland": "IE",
    };
    return codes[country] || country.substring(0, 2).toUpperCase();
}
