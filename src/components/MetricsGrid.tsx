import { Node } from "@/lib/types";
import styles from "./MetricsGrid.module.css";

interface MetricsGridProps {
    nodes: Node[];
}

export default function MetricsGrid({ nodes }: MetricsGridProps) {
    const activeNodes = nodes.filter((n) => n.status === "active").length;
    const degradedNodes = nodes.filter((n) => n.status === "degraded").length;
    const munichNodes = nodes.filter((n) => n.release === "Munich v0.8").length;
    const herrenbergNodes = nodes.filter(
        (n) => n.release === "Herrenberg v0.9"
    ).length;
    const titanNodes = nodes.filter((n) => n.hasTitan).length;
    const avgPerformance = (
        nodes.reduce((sum, n) => sum + n.performanceScore, 0) / nodes.length
    ).toFixed(2);

    return (
        <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Total Nodes</div>
                <div className={styles.metricValue}>{nodes.length}</div>
                <div className={styles.metricChange}>Active: {activeNodes}</div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Network Health</div>
                <div className={styles.metricValue}>
                    {((activeNodes / nodes.length) * 100).toFixed(0)}%
                </div>
                <div className={styles.metricChange}>Degraded: {degradedNodes}</div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Avg Performance</div>
                <div className={styles.metricValue}>{avgPerformance}</div>
                <div className={styles.metricChange}>Scale: 0.0 - 1.0</div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Version Distribution</div>
                <div className={styles.metricValue}>
                    {herrenbergNodes}/{munichNodes}
                </div>
                <div className={styles.metricChange}>Herrenberg / Munich</div>
            </div>

            <div className={styles.metricCard}>
                <div className={styles.metricLabel}>Titan Support</div>
                <div className={styles.metricValue}>{titanNodes}</div>
                <div className={styles.metricChange}>
                    {((titanNodes / nodes.length) * 100).toFixed(0)}% of nodes
                </div>
            </div>
        </div>
    );
}
