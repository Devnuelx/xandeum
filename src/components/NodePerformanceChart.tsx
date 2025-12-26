"use client";

import { Node } from "@/lib/types";
import styles from "./NodePerformanceChart.module.css";

interface NodePerformanceChartProps {
    node: Node;
}

export default function NodePerformanceChart({ node }: NodePerformanceChartProps) {
    // Generate smooth wave data similar to the reference image
    // Determine colors based on status
    const statusColors = {
        active: { primary: '#10b981', secondary: '#6b7280' },
        degraded: { primary: '#f59e0b', secondary: '#92400e' },
        offline: { primary: '#ef4444', secondary: '#b91c1c' }
    };

    const colors = statusColors[node.status] || statusColors.active;
    const finalScore = node.performanceScore * 100;

    // Generate synthetic history ending at the current score
    // We use a deterministic seed based on node ID so it doesn't flicker on re-renders,
    // but here we'll just use a stable memo-like generation if possible, strictly we just render
    // based on index for the 'smoothness'.
    const dataPoints = 30;
    const data = Array.from({ length: dataPoints }, (_, i) => {
        const t = i / (dataPoints - 1);

        // Target value is finalScore. Start value is somewhat random but consistent locally.
        // We'll simulate a "trend" towards the final score.
        // Base vibration
        const noise = Math.sin(t * Math.PI * 4 + finalScore) * 5 * (1 - t);

        // Trend curve: Ease out expo implementation to converge at the end
        // Simple linear interpolation with some curve
        const trend = finalScore + (Math.sin(i * 0.5) * 2) - ((1 - t) * 10);

        const primaryVal = Math.max(0, Math.min(100, trend + noise));

        // Secondary line (baseline) - make it stable around avg
        const secondaryVal = 60 + Math.cos(t * Math.PI * 2) * 5;

        return { primary: primaryVal, secondary: secondaryVal };
    });

    const width = 800;
    const height = 200;
    const padding = 20;
    const maxVal = 100;
    const minVal = 40;

    // Convert data to SVG path
    const createSmoothPath = (values: number[]) => {
        if (values.length === 0) return '';

        const points = values.map((val, i) => {
            const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
            return { x, y };
        });

        // Create smooth bezier curve using quadratic interpolation
        let path = `M ${points[0].x},${points[0].y}`;

        for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const controlX = (current.x + next.x) / 2;
            const controlY = (current.y + next.y) / 2;

            if (i === 0) {
                path += ` Q ${controlX},${controlY} ${next.x},${next.y}`;
            } else {
                const prev = points[i - 1];
                const cx1 = current.x;
                const cy1 = (prev.y + current.y + next.y) / 3;
                path += ` Q ${cx1},${cy1} ${next.x},${next.y}`;
            }
        }

        return path;
    };

    const primaryPath = createSmoothPath(data.map(d => d.primary));
    const secondaryPath = createSmoothPath(data.map(d => d.secondary));

    // Create area fill path for primary
    const primaryAreaPath = primaryPath + ` L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

    // Get point coordinates for rendering circles
    const getPoints = (values: number[]) => {
        return values.map((val, i) => {
            const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
            const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
            return { x, y };
        });
    };

    const primaryPoints = getPoints(data.map(d => d.primary));
    const secondaryPoints = getPoints(data.map(d => d.secondary));

    // Sample points to show (not all 30, just key ones)
    const showPointsAt = [0, 5, 10, 15, 20, 25, 29];

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

            <div className={styles.svgWrapper}>
                <svg viewBox={`0 0 ${width} ${height}`} className={styles.chartSvg} preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colors.primary} stopOpacity="0.2" />
                            <stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((ratio, i) => (
                        <line
                            key={i}
                            x1={padding}
                            y1={padding + ratio * (height - 2 * padding)}
                            x2={width - padding}
                            y2={padding + ratio * (height - 2 * padding)}
                            className={styles.gridLine}
                        />
                    ))}

                    {/* Area fill */}
                    <path
                        d={primaryAreaPath}
                        fill="url(#areaGradient)"
                    />

                    {/* Secondary line (dotted) */}
                    <path
                        d={secondaryPath}
                        fill="none"
                        stroke={colors.secondary}
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.5"
                    />

                    {/* Primary line */}
                    <path
                        d={primaryPath}
                        fill="none"
                        stroke={colors.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Data points on primary line */}
                    {showPointsAt.map(idx => {
                        const point = primaryPoints[idx];
                        return (
                            <circle
                                key={`primary-${idx}`}
                                cx={point.x}
                                cy={point.y}
                                r="5"
                                fill="var(--color-bg-tertiary)"
                                stroke={colors.primary}
                                strokeWidth="2.5"
                            />
                        );
                    })}

                    {/* Data points on secondary line */}
                    {showPointsAt.map(idx => {
                        const point = secondaryPoints[idx];
                        return (
                            <circle
                                key={`secondary-${idx}`}
                                cx={point.x}
                                cy={point.y}
                                r="4"
                                fill="var(--color-bg-tertiary)"
                                stroke={colors.secondary}
                                strokeWidth="2"
                                opacity="0.6"
                            />
                        );
                    })}
                </svg>
            </div>

            <div className={styles.xLabels}>
                <span>30 Days Ago</span>
                <span>15 Days</span>
                <span>Today</span>
            </div>
        </div>
    );
}
