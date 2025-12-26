import Link from "next/link";
import styles from "./NetworkEarnings.module.css";

export default function NetworkEarnings() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>Network Economics Overview</h3>
                    <p className={styles.description}>
                        Total value distributed to pNodes for storage services and consensus participation.
                    </p>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Visuals: Total Earnings */}
                <div className={styles.metricGroup}>
                    <div className={styles.bigMetric}>
                        <span className={styles.metricLabel}>Avg. Earnings per Active pNode (30d)</span>
                        <span className={styles.metricValue}>~0.5 – 10.0 SOL+</span>
                        <span className={styles.metricSub}>+8.4% vs last month</span>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <span className={styles.metricLabel}>Avg. Operator Yield Range (Est.)</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                            12% - 18%
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                            Dependent on uptime & storage tier
                        </p>
                    </div>
                </div>

                {/* Distribution Chart (Simple CSS Bar Chart) */}
                <div className={styles.chartArea}>
                    <p className={styles.metricLabel} style={{ marginBottom: 'var(--spacing-md)' }}>Reward Distribution by Performance Tier</p>

                    <div className={styles.tierBar}>
                        <span className={styles.tierLabel}>Top Performers</span>
                        <div className={styles.tierTrack}>
                            <div className={styles.tierFill} style={{ width: '65%', background: 'var(--color-success)' }}></div>
                        </div>
                        <span className={styles.tierValue}>65%</span>
                    </div>

                    <div className={styles.tierBar}>
                        <span className={styles.tierLabel}>Median Tier</span>
                        <div className={styles.tierTrack}>
                            <div className={styles.tierFill} style={{ width: '25%', background: 'var(--color-primary)' }}></div>
                        </div>
                        <span className={styles.tierValue}>25%</span>
                    </div>

                    <div className={styles.tierBar}>
                        <span className={styles.tierLabel}>Lower Quartile</span>
                        <div className={styles.tierTrack}>
                            <div className={styles.tierFill} style={{ width: '10%', background: 'var(--color-warning)' }}></div>
                        </div>
                        <span className={styles.tierValue}>10%</span>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-sm)', textAlign: 'right' }}>
                        *High uptime nodes capture majority of storage fees
                    </p>
                </div>
            </div>

            <div className={styles.ctaArea}>
                <Link href="/roi-calculator" className={styles.link}>
                    Estimate Your Potential Returns →
                </Link>
            </div>
        </div>
    );
}