"use client";

import { Node } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from "./NodePerformanceChart.module.css";

interface NodePerformanceChartProps {
    node: Node;
}

export default function NodePerformanceChart({ node }: NodePerformanceChartProps) {
    // Determine colors based on status
    const statusColors = {
        active: { primary: '#10b981', secondary: '#6b7280' },
        degraded: { primary: '#f59e0b', secondary: '#92400e' },
        offline: { primary: '#ef4444', secondary: '#b91c1c' }
    };

    const colors = statusColors[node.status] || statusColors.active;
    const finalScore = node.performanceScore * 100;

    // Generate realistic performance data for 30 days
    const dataPoints = 30;
    const data = Array.from({ length: dataPoints }, (_, i) => {
        const daysAgo = dataPoints - i - 1;
        const t = i / (dataPoints - 1);

        // Simulate trend towards current score
        const noise = Math.sin(t * Math.PI * 4 + finalScore) * 5 * (1 - t);
        const trend = finalScore + (Math.sin(i * 0.5) * 2) - ((1 - t) * 10);
        const uptime = Math.max(0, Math.min(100, trend + noise));

        // Baseline performance (always more stable)
        const baseline = 60 + Math.cos(t * Math.PI * 2) * 5;

        return {
            day: daysAgo === 0 ? 'Today' : daysAgo === 15 ? '15d' : daysAgo === 29 ? '30d ago' : `${daysAgo}d`,
            uptime: parseFloat(uptime.toFixed(1)),
            baseline: parseFloat(baseline.toFixed(1)),
        };
    });

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <span>Performance Metrics</span>
                <div className={styles.legend}>
                    <span className={styles.legendItem}>
                        <span className={styles.lineColor} style={{ background: colors.primary }}></span>
                        Uptime
                    </span>
                    <span className={styles.legendItem}>
                        <span className={styles.lineColor} style={{ background: colors.secondary, opacity: 0.6 }}></span>
                        Baseline
                    </span>
                </div>
            </div>

            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
                        <defs>
                            <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors.primary} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                            opacity={0.3}
                        />

                        <XAxis
                            dataKey="day"
                            stroke="var(--color-text-muted)"
                            fontSize={11}
                            tickLine={false}
                            interval={9}
                        />

                        <YAxis
                            stroke="var(--color-text-muted)"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-bg-secondary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '12px',
                            }}
                            labelStyle={{ color: 'var(--color-text-primary)', fontWeight: 600 }}
                            itemStyle={{ color: 'var(--color-text-secondary)' }}
                        />

                        <Legend
                            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                            iconType="line"
                        />

                        {/* Baseline (dotted line) */}
                        <Line
                            type="monotone"
                            dataKey="baseline"
                            stroke={colors.secondary}
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            opacity={0.5}
                            name="Baseline"
                            isAnimationActive={true}
                        />

                        {/* Uptime (main line) */}
                        <Line
                            type="monotone"
                            dataKey="uptime"
                            stroke={colors.primary}
                            strokeWidth={3}
                            dot={{ fill: 'var(--color-bg-tertiary)', stroke: colors.primary, strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: colors.primary }}
                            name="Uptime %"
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.xLabels}>
                <span>30 Days Ago</span>
                <span>15 Days</span>
                <span>Today</span>
            </div>
        </div>
    );
}
