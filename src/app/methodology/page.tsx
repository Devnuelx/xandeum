import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

export default function MethodologyPage() {
    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>
                <div className={styles.docContainer}>
                    <h1 className={styles.title}>Data Specification</h1>
                    <p className={styles.date}>Last Updated: December 2025</p>

                    <section className={styles.section}>
                        <h2>1. Global Dashboard State</h2>
                        <h3>Data Source Mode</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>dataSource</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>"live" | "mock"</code></li>
                            <li><strong>Logic:</strong>
                                <ul>
                                    <li><code className={styles.code}>"live"</code> if pRPC call succeeds and returns non-empty node data</li>
                                    <li><code className={styles.code}>"mock"</code> if RPC fails, times out, or returns empty</li>
                                </ul>
                            </li>
                            <li><strong>Displayed:</strong> Top bar badge</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Network Overview Metrics (Top Summary Cards)</h2>

                        <h3>Network Health Score</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>networkHealthScore</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>number (0–100)</code></li>
                            <li><strong>Derivation:</strong> <code className={styles.code}>healthScore = (activeNodes / totalNodes) * 100 × uptimeWeight</code></li>
                            <li><strong>Uptime Weight:</strong> simulated average uptime factor (0.85–1.0)</li>
                            <li><strong>Status Labels:</strong>
                                <ul>
                                    <li>80–100 → Excellent</li>
                                    <li>60–79 → Fair</li>
                                    <li>&lt;60 → Degraded</li>
                                </ul>
                            </li>
                        </ul>

                        <h3>Active Nodes</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>activeNodes</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>number</code></li>
                            <li><strong>Logic:</strong> Count of nodes with status = <code className={styles.code}>Online</code></li>
                            <li><strong>Displayed As:</strong> X / Y</li>
                        </ul>

                        <h3>Network Uptime</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>averageUptime</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>percentage</code></li>
                            <li><strong>Derivation:</strong> Average of per-node uptime (live if available, otherwise modeled)</li>
                        </ul>

                        <h3>Average Response Time</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>avgResponseTime</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>milliseconds</code></li>
                            <li><strong>Derivation:</strong> Mean response latency across active nodes</li>
                        </ul>

                        <h3>Storage Utilization</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>networkStorageUsed</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>percentage</code></li>
                            <li><strong>Derivation:</strong> <code className={styles.code}>sum(node.usedStorage) / sum(node.totalStorage)</code></li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Network Storage Activity (Economics Section)</h2>

                        <h3>Network Storage Activity (30d)</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>storageDemandTrend</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>"Growing" | "Stable" | "Declining"</code></li>
                            <li><strong>Derivation:</strong> Modeled from active node count trend and regional request density</li>
                            <li><strong>Delta:</strong> +8.4% (modeled growth)</li>
                            <li><strong>Label:</strong> Clearly marked as <strong>modeled</strong></li>
                        </ul>

                        <h3>Avg Earnings per Active pNode</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>avgNodeEarningsRange</code></li>
                            <li><strong>Type:</strong> <code className={styles.code}>{`{ min: number, max: number }`}</code></li>
                            <li><strong>Current Display:</strong> ~0.5 – 2.0 SOL / month</li>
                            <li><strong>Derivation Factors:</strong> Uptime tier, Storage capacity, Network demand</li>
                            <li><strong>Important:</strong> Per-node, Not staking, Not guaranteed</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Node Table Data (Core Dataset)</h2>
                        <p>Each node object contains:</p>

                        <h3>Node Identity</h3>
                        <ul>
                            <li><strong>nodeId</strong> (string, truncated)</li>
                            <li><strong>nodeAlias</strong> (optional display name)</li>
                        </ul>

                        <h3>Node Status</h3>
                        <ul>
                            <li><strong>Field:</strong> <code className={styles.code}>status</code></li>
                            <li><strong>Enum:</strong> <code className={styles.code}>online | degraded | offline</code></li>
                            <li><strong>Classification Logic:</strong>
                                <ul>
                                    <li><strong>Online:</strong> Responds within 2s</li>
                                    <li><strong>Degraded:</strong> Visible but high latency or intermittent drops</li>
                                    <li><strong>Offline:</strong> Missed last 3 gossip windows</li>
                                </ul>
                            </li>
                        </ul>

                        <h3>Location</h3>
                        <ul>
                            <li><strong>Fields:</strong> <code className={styles.code}>region</code>, <code className={styles.code}>countryCode</code></li>
                            <li><strong>Derivation:</strong> IP region inference</li>
                        </ul>

                        <h3>Performance Metrics</h3>
                        <ul>
                            <li><strong>uptime</strong> → %</li>
                            <li><strong>responseTime</strong> → ms</li>
                            <li><strong>storageUsed</strong> → GB</li>
                            <li><strong>storageTotal</strong> → GB</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>5. Map Visualization Data</h2>

                        <h3>Map Nodes</h3>
                        <ul>
                            <li><strong>Fields:</strong> <code className={styles.code}>region</code>, <code className={styles.code}>status</code>, <code className={styles.code}>nodeCount</code></li>
                            <li><strong>Rendering:</strong> Dot grid map with jittered offsets</li>
                            <li><strong>Color Encoding:</strong>
                                <ul>
                                    <li>Online → Primary / green</li>
                                    <li>Degraded → Yellow</li>
                                    <li>Offline → Red</li>
                                </ul>
                            </li>
                        </ul>

                        <h3>Map ↔ Table Interaction</h3>
                        <ul>
                            <li>Clicking a region filters node table and highlights matching rows</li>
                            <li>Clicking a node highlights corresponding map region</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>6. Node Detail Drawer (Per Node)</h2>
                        <p>Displayed when a node row is clicked. Includes:</p>
                        <ul>
                            <li>Node ID (full)</li>
                            <li>Current status</li>
                            <li>Uptime %</li>
                            <li>Response latency</li>
                            <li>Storage usage</li>
                            <li>Region</li>
                            <li>Simulated historical uptime trend (sparkline)</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>7. ROI Calculator Inputs & Outputs</h2>

                        <h3>User Inputs</h3>
                        <ul>
                            <li>Storage capacity (GB)</li>
                            <li>Expected uptime (%)</li>
                            <li>Network demand tier (low / medium / high)</li>
                        </ul>

                        <h3>Outputs</h3>
                        <ul>
                            <li>Estimated monthly SOL earnings</li>
                            <li>Payback period (months)</li>
                            <li>Earnings range (conservative → optimistic)</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>8. Call-to-Action (CTA) Data Hooks</h2>

                        <h3>Connect Wallet</h3>
                        <ul>
                            <li><strong>State:</strong> <code className={styles.code}>isWalletConnected</code></li>
                            <li><strong>Effect:</strong> Highlights one node as “owned”</li>
                            <li><strong>Note:</strong> Simulated only (no signing)</li>
                        </ul>

                        <h3>Run a pNode</h3>
                        <ul>
                            <li><strong>Action:</strong> External link to Xandeum docs</li>
                            <li><strong>Purpose:</strong> Network growth conversion</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>9. Transparency & Methodology Flags</h2>
                        <ul>
                            <li>Live vs Mock badge</li>
                            <li>“Modeled” labels on derived metrics</li>
                            <li>“Estimated” labels on earnings</li>
                        </ul>
                    </section>
                </div>
            </div>
        </main>
    );
}
