import Sidebar from "@/components/Sidebar";
import styles from "./page.module.css";

export default function MethodologyPage() {
    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>
                <div className={styles.docContainer}>
                    <h1 className={styles.title}>Dashboard Methodology</h1>
                    <p className={styles.date}>Last Updated: December 2025</p>

                    <section className={styles.section}>
                        <h2>About Xandeum</h2>
                        <p>
                            Xandeum is a scalable storage layer for smart contract platforms. It introduces "External Global State" (EGS) to Solana, enabling storage-heavy applications like the pNodes network. The pNode (Provider Node) network is the backbone of this decentralized storage layer, allowing validators to offload storage-intensive tasks while maintaining high throughput and low latency.
                        </p>
                    </section>

                    <section className={styles.section}>
                        <h2>1. Hybrid Data Strategy</h2>
                        <p>
                            This dashboard implements a "Hybrid Live/Mock" data strategy to ensure high availability and consistent user experience, even during network instability or RPC outages.
                        </p>
                        <ul>
                            <li><strong>Live Data:</strong> We primarily attempt to fetch live node data from the official pRPC endpoint <code className={styles.code}>https://rpc.xandeum.network</code> using the <code className={styles.code}>getClusterNodes</code> method.</li>
                            <li><strong>Smart Fallback:</strong> If the RPC endpoint is unreachable, times out, or returns an empty dataset, the system securely falls back to a deterministic mock dataset. This ensures the dashboard never appears broken.</li>
                            <li><strong>Transparency:</strong> The data source is always indicated in the top bar (e.g., "Live" vs "Mock").</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>2. Metric Derivation</h2>
                        <p>
                            Some metrics displayed are derived or simulated for demonstration purposes where raw RPC data is insufficient or currently unavailable in the public API.
                        </p>
                        <ul>
                            <li><strong>Network Health Score:</strong> A composite score calculated from the ratio of 'Active' nodes to total nodes, weighted by simulated uptime metrics.</li>
                            <li><strong>Performance Score:</strong> Currently simulated based on node latency regions. In production, this would be derived from historical gossip participation.</li>
                            <li><strong>STOINC:</strong> Simulated staking metric for visualization.</li>
                        </ul>
                    </section>

                    <section className={styles.section}>
                        <h2>3. Node Status Classification</h2>
                        <p>
                            Nodes are classified into three states based on their gossip protocol visibility:
                        </p>
                        <div className={styles.statusGrid}>
                            <div className={styles.statusItem}>
                                <span className={`${styles.badge} ${styles.active}`}>Online</span>
                                <p>Node successfully responding to RPC queries within 2s.</p>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={`${styles.badge} ${styles.degraded}`}>Degraded</span>
                                <p>Node visible but with high latency (less than 2s )or intermittent drops.</p>
                            </div>
                            <div className={styles.statusItem}>
                                <span className={`${styles.badge} ${styles.offline}`}>Offline</span>
                                <p>Node missed last 3 gossip windows.</p>
                            </div>
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2>4. Geolocation mapping</h2>
                        <p>
                            Node locations are inferred from their IP regions (e.g., <code className={styles.code}>us-east-1</code> maps to North Virginia, US). The map visualization uses a proprietary coordinate mapping system to render these regions onto the dot grid with jittered offsets to prevent visual overlap.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    );
}
