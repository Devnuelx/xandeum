import { fetchNodeById } from "@/lib/pnode-service";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import NodePerformanceChart from "@/components/NodePerformanceChart";
import styles from "./page.module.css";

// Force dynamic rendering since we rely on URL params which might be arbitrary
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        nodeId: string;
    };
}

export default async function NodeDetailPage({ params }: PageProps) {
    const node = await fetchNodeById(params.nodeId);

    if (!node) {
        return (
            <div className={styles.container}>
                <Sidebar />
                <div style={{ marginLeft: 250, padding: 40 }}>
                    <h1>Node Not Found</h1>
                    <p>The requested pNode could not be located on the network.</p>
                    <Link href="/#nodes" className={styles.primaryBtn}>Return to List</Link>
                </div>
            </div>
        );
    }

    return (
        <main style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-base)' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: 250 }}> {/* Sidebar Spacer */}
                <div className={styles.container}>
                    {/* Hero Section */}
                    <div className={styles.heroSection}>
                        <div className={styles.heroInfo}>
                            <h1>{node.id.substring(0, 8)}...{node.id.substring(node.id.length - 8)}</h1>
                            <div className={styles.heroMeta}>
                                <span>{node.region}</span>
                                <span>•</span>
                                <span>{node.release}</span>
                                <span>•</span>
                                <span style={{
                                    color: node.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)',
                                    textTransform: 'capitalize'
                                }}>
                                    {node.status}
                                </span>
                            </div>
                        </div>
                        <div className={styles.heroStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Health Score</span>
                                <span className={styles.statValue}>{(node.performanceScore * 100).toFixed(0)}/100</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statLabel}>Last Seen</span>
                                <span className={styles.statValue}>Just now</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.grid}>
                        {/* Performance Panel */}
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>Performance Analytics</div>
                            <NodePerformanceChart node={node} />
                            <div className={styles.insightText}>
                                <p>
                                    <strong>Observation:</strong> This node maintains {
                                        node.performanceScore >= 0.95 ? 'exceptional' :
                                            node.performanceScore >= 0.85 ? 'high' :
                                                node.performanceScore >= 0.70 ? 'moderate' : 'variable'
                                    } uptime ({(node.performanceScore * 100).toFixed(1)}%), making it {
                                        node.performanceScore >= 0.95 ? 'a prime candidate for storage leader selection' :
                                            node.performanceScore >= 0.85 ? 'well-suited for consistent storage operations' :
                                                node.performanceScore >= 0.70 ? 'adequate for standard network participation' :
                                                    'a candidate for performance optimization'
                                    }.
                                </p>
                            </div>
                        </div>

                        {/* Economics Insight Panel */}
                        <div className={styles.panel}>
                            <div className={styles.panelHeader}>Economic Insight</div>
                            <div className={styles.economicsContent}>
                                <div className={styles.tierBadge}>
                                    Performance Tier: <strong>Top 30%</strong>
                                </div>
                                <p className={styles.insightText}>
                                    Based on its <strong>{node.region}</strong> location and <strong>{(node.performanceScore * 100).toFixed(0)} score</strong>, this node is highly eligible for STOINC rewards.
                                </p>
                                <p className={styles.insightText} style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                                    "Higher performing pNodes receive a larger share of storage fees distributed across the network."
                                </p>

                                <div className={styles.ctaGroup}>
                                    <Link
                                        href={`/roi-calculator?storage=1000&uptime=${(node.performanceScore * 100).toFixed(0)}`}
                                        className={styles.primaryBtn}
                                    >
                                        Estimate ROI for Node
                                    </Link>
                                    <Link
                                        href={`/compare?nodes=${node.id}`}
                                        className={styles.secondaryBtn}
                                    >
                                        Compare Node
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
