"use client";

import { Node } from "@/lib/types";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from "./DashboardGrid.module.css";

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

    // Generate 24h activity data
    const activityData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        label: `${i}:00`,
        activity: 40 + Math.floor(Math.random() * 60), // Random activity 40-100
    }));

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
                            <span className={styles.kpiValue}>
                                {nodes.length > 0
                                    ? (nodes.reduce((acc, n) => acc + (n.performanceScore || 0), 0) / nodes.length * 100).toFixed(2)
                                    : "0.00"}%
                            </span>
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
                        {/* Interactive chart with Recharts */}
                        <div className={styles.interactiveChart}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-accent-highlight)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="var(--color-accent-highlight)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="label"
                                        stroke="var(--color-text-muted)"
                                        fontSize={10}
                                        tickLine={false}
                                        interval={5}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-muted)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-bg-secondary)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            fontSize: '12px',
                                        }}
                                        labelStyle={{ color: 'var(--color-text-primary)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="activity"
                                        stroke="var(--color-accent-highlight)"
                                        strokeWidth={2}
                                        fill="url(#activityGradient)"
                                        isAnimationActive={true}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
