"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./ROICalculator.module.css";
// import { TrendingUp, Server, Clock, AlertTriangle } from "lucide-react"; // Pass on lucide for now as instructed, standard SVG or text fallback

export default function ROICalculator() {
    const searchParams = useSearchParams();

    // Initialize with defaults, update via effect to avoid hydration mismatch
    const [storage, setStorage] = useState(1000); // GB
    const [uptime, setUptime] = useState(99.0); // %
    const [cost, setCost] = useState(50); // $ / month
    const [multiplier, setMultiplier] = useState(1.0); // 1.0 = Standard, 1.2 = Titan (Simulated)

    // Parse query params on mount
    useEffect(() => {
        const paramStorage = searchParams.get('storage');
        const paramUptime = searchParams.get('uptime');

        if (paramStorage) {
            setStorage(Number(paramStorage));
        }
        if (paramUptime) {
            setUptime(Number(paramUptime));
        }
    }, [searchParams]);


    // Formula (Simplified for Demo): 
    // Base Reward * (Storage / 1000) * (Uptime / 100) * Multiplier
    const estimatedStoinc = useMemo(() => {
        const baseReward = 500; // Arbitrary base for calculation
        const storageFactor = storage / 1000;
        const uptimeFactor = Math.max(0, (uptime - 80) / 20); // Penalty if below 80%

        const raw = baseReward * storageFactor * uptimeFactor * multiplier;
        return Math.floor(raw);
    }, [storage, uptime, multiplier]);

    // Simulated exchange rate for educational purposes (NOT REAL VALUE)
    const SIMULATED_EXCHANGE_RATE = 0.05;
    const estimatedValueCtx = (estimatedStoinc * SIMULATED_EXCHANGE_RATE).toFixed(2);
    const netProfit = (parseFloat(estimatedValueCtx) - cost).toFixed(2);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>pNode Value Estimator</h1>
                <p className={styles.subtitle}>
                    Understand the economic model of running a Xandeum Provider Node.
                    Adjust variables to see how storage and reliability impact potential rewards.
                </p>
            </header>

            <div className={styles.calculatorGrid}>
                {/* Input Section */}
                <div className={styles.inputSection}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <span>Storage Capacity</span>
                            <span className={styles.labelValue}>{storage} GB</span>
                        </label>
                        <input
                            type="range"
                            min="500"
                            max="5000"
                            step="100"
                            value={storage}
                            onChange={(e) => setStorage(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <span>Uptime Reliability</span>
                            <span className={styles.labelValue}>{uptime}%</span>
                        </label>
                        <input
                            type="range"
                            min="80"
                            max="100"
                            step="0.1"
                            value={uptime}
                            onChange={(e) => setUptime(Number(e.target.value))}
                            className={styles.slider}
                        />
                        <small style={{ color: uptime < 95 ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                            {uptime < 95 ? "Warning: Low uptime significantly reduces eligibility." : "High uptime maximizes reward potential."}
                        </small>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>
                            <span>Monthly Operational Cost ($)</span>
                            <span className={styles.labelValue}>${cost}</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            step="5"
                            value={cost}
                            onChange={(e) => setCost(Number(e.target.value))}
                            className={styles.slider}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Node Tier (NFT)</label>
                        <select
                            value={multiplier}
                            onChange={(e) => setMultiplier(Number(e.target.value))}
                            className={styles.select}
                        >
                            <option value={1.0}>Standard pNode (1.0x)</option>
                            <option value={1.2}>Titan pNode (1.2x)</option>
                        </select>
                    </div>
                </div>

                {/* Results Section */}
                <div className={styles.resultSection}>
                    <div className={styles.resultCard}>
                        <div className={styles.resultHeader}>Estimated Monthly Rewards</div>

                        <div className={styles.bigStat}>
                            <span className={styles.statValue}>{estimatedStoinc.toLocaleString()}</span>
                            <span className={styles.statUnit}>STOINC</span>
                        </div>
                        <div className={styles.statDetail}>
                            ≈ ${estimatedValueCtx} hypothetical value
                        </div>

                        <div className={styles.breakdown}>
                            <div className={styles.breakdownRow}>
                                <span className={styles.breakdownLabel}>Gross Value</span>
                                <span className={styles.breakdownValue}>${estimatedValueCtx}</span>
                            </div>
                            <div className={styles.breakdownRow}>
                                <span className={styles.breakdownLabel}>Est. Ops Cost</span>
                                <span className={styles.breakdownValue}>-${cost.toFixed(2)}</span>
                            </div>
                            <div className={styles.breakdownRow} style={{ marginTop: 'var(--spacing-sm)', fontWeight: 600 }}>
                                <span className={styles.breakdownLabel}>Net Estimate</span>
                                <span className={styles.breakdownValue} style={{ color: parseFloat(netProfit) >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                    ${netProfit}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.disclaimer}>
                        <strong>Disclaimer:</strong> This calculator is a purely educational tool simulating network mechanics.
                        It does not guarantee future earnings. "STOINC" values are hypothetical for demonstration.
                        Actual rewards depend on global network participation, total staked supply, and governance parameters.
                    </div>

                    <div className={styles.ctaGroup}>
                        <a href="https://docs.xandeum.network" target="_blank" rel="noopener noreferrer" className={styles.primaryBtn}>
                            Read Operator Docs
                        </a>
                        <a href="https://docs.xandeum.network" target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
                            View Hardware Req.
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
