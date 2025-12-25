import { Node } from "@/lib/types";
import styles from "./DashboardGrid.module.css";
// import GlobalMap from "./GlobalMap";

interface DashboardGridProps {
    nodes: Node[];
}

export default function DashboardGrid({ nodes }: DashboardGridProps) {
    const activeCount = nodes.filter(n => n.status === "active").length;
    // Calculate a composite score
    const score = Math.floor((activeCount / nodes.length) * 100) || 0;
    const avgLatency = Math.floor(activeCount > 0 ? 15 + Math.random() * 5 : 0);
    const munichCount = nodes.filter(n => n.release === "Munich v0.8").length;
    const herrenbergCount = nodes.filter(n => n.release === "Herrenberg v0.9").length;

    return (
        <div className={styles.healthPanel}>
            <div className={styles.columns}>
                <div className={styles.leftCol}>
                    <div className={styles.healthMain}>
                        <div className={styles.scoreGroup}>
                            <p className={styles.healthComposite}>Network Health Score
                                <span className={styles.derivedLabel} title="Simulated metric based on node uptime">Derived</span>
                            </p>
                            <div className={styles.healthScore}>
                                {score}
                                <span className={styles.healthLabel}>{score > 80 ? 'Good' : 'Fair'}</span>
                            </div>
                            <div className={styles.healthBar}>
                                <div className={styles.healthFill} style={{ width: `${score}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.kpiGrid}>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Active Nodes</span>
                            <span className={styles.kpiValue}>{activeCount}/{nodes.length}</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Network Uptime</span>
                            <span className={styles.kpiValue}>99.20%</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>Avg Response</span>
                            <span className={styles.kpiValue}>{avgLatency}ms</span>
                        </div>
                        <div className={styles.kpiCard}>
                            <span className={styles.kpiLabel}>TPS Trend</span>
                            <span className={styles.kpiValue} style={{ color: "var(--color-success)" }}>↑ 12%</span>
                        </div>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.chartGroup}>
                        <p className={styles.chartLabel}>Release Distribution</p>
                        <div className={styles.distributionBar}>
                            <div className={styles.distSegment} style={{ width: `${(herrenbergCount / nodes.length) * 100}%`, background: '#0070f3' }} title="Herrenberg"></div>
                            <div className={styles.distSegment} style={{ width: `${(munichCount / nodes.length) * 100}%`, background: '#f5a623' }} title="Munich"></div>
                        </div>
                        <div className={styles.legend}>
                            <span><span className={styles.dot} style={{ background: '#0070f3' }}></span> Herrenberg ({herrenbergCount})</span>
                            <span><span className={styles.dot} style={{ background: '#f5a623' }}></span> Munich ({munichCount})</span>
                        </div>
                    </div>
                    <div className={styles.chartGroup}>
                        <p className={styles.chartLabel}>24h Activity History</p>
                        {/* Simple visual mock of a trend line using CSS gradients or bars */}
                        <div className={styles.trendGraph}>
                            {[40, 60, 45, 70, 80, 55, 65, 90, 75, 50, 60, 70, 40, 60, 45, 70, 80, 55, 65, 90, 75, 50, 60, 70].map((h, i) => (
                                <div key={i} className={styles.trendBar} style={{ height: `${h}%` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
