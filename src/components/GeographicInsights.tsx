"use client";

import { Node } from "@/lib/types";
import styles from "./GeographicInsights.module.css";

interface GeographicInsightsProps {
    nodes: Node[];
}

export default function GeographicInsights({ nodes }: GeographicInsightsProps) {
    // Calculate locations and countries
    const locations = new Set(nodes.filter(n => n.city && n.city !== 'Unknown').map(n => n.city));
    const countries = new Set(nodes.filter(n => n.country && n.country !== 'Unknown').map(n => n.country));

    // Version distribution
    const versionMap = new Map<string, number>();
    nodes.forEach(node => {
        const version = node.release || 'Unknown';
        versionMap.set(version, (versionMap.get(version) || 0) + 1);
    });
    const versions = Array.from(versionMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    // Status distribution
    const statusCounts = {
        active: nodes.filter(n => n.status === 'active').length,
        degraded: nodes.filter(n => n.status === 'degraded').length,
        offline: nodes.filter(n => n.status === 'offline').length,
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Geographic Insights</h3>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{locations.size}</div>
                    <div className={styles.statLabel}>Locations</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{countries.size}</div>
                    <div className={styles.statLabel}>Countries</div>
                </div>
            </div>

            {/* Version Distribution */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Version Distribution</div>
                <div className={styles.list}>
                    {versions.map(([version, count]) => (
                        <div key={version} className={styles.listItem}>
                            <span className={styles.listLabel}>{version}</span>
                            <span className={styles.listValue}>{count}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Distribution */}
            <div className={styles.section}>
                <div className={styles.sectionTitle}>Status Distribution</div>
                <div className={styles.statusList}>
                    <div className={styles.statusItem}>
                        <div className={styles.statusDot} style={{ backgroundColor: '#10b981' }} />
                        <span className={styles.statusLabel}>Active</span>
                        <span className={styles.statusValue}>{statusCounts.active}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <div className={styles.statusDot} style={{ backgroundColor: '#f59e0b' }} />
                        <span className={styles.statusLabel}>Degraded</span>
                        <span className={styles.statusValue}>{statusCounts.degraded}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <div className={styles.statusDot} style={{ backgroundColor: '#ef4444' }} />
                        <span className={styles.statusLabel}>Offline</span>
                        <span className={styles.statusValue}>{statusCounts.offline}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
