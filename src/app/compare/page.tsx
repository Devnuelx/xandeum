"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import { Node } from "@/lib/types";
import styles from "./page.module.css";

export default function ComparePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadNodes() {
            const nodeIds = searchParams.get("nodes")?.split(",") || [];
            if (nodeIds.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("/api/nodes");
                const json = await response.json();
                const selectedNodes = json.nodes.filter((n: Node) => nodeIds.includes(n.id));
                setNodes(selectedNodes);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadNodes();
    }, [searchParams]);

    const handleRemoveNode = (nodeId: string) => {
        const remainingIds = nodes.filter(n => n.id !== nodeId).map(n => n.id);
        if (remainingIds.length === 0) {
            router.push("/all-nodes");
        } else {
            router.push(`/compare?nodes=${remainingIds.join(",")}`);
        }
    };

    if (loading) return <Loader />;

    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Compare Nodes</h1>
                    <div className={styles.actions}>
                        <button className={styles.btnSecondary} onClick={() => router.push("/all-nodes")}>
                            Add More Nodes
                        </button>
                        <button className={styles.btnDanger} onClick={() => router.push("/all-nodes")}>
                            Clear All
                        </button>
                    </div>
                </div>

                {nodes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>No nodes selected for comparison.</p>
                        <button className={styles.btnPrimary} onClick={() => router.push("/all-nodes")}>
                            Select Nodes
                        </button>
                    </div>
                ) : (
                    <div className={styles.compareGrid}>
                        {nodes.map((node) => (
                            <div key={node.id} className={styles.compareCard}>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => handleRemoveNode(node.id)}
                                >
                                    ×
                                </button>

                                <div className={styles.cardHeader}>
                                    <div className={`${styles.statusDot} ${styles[node.status]}`}></div>
                                    <h3 className={styles.nodeId}>{node.id.slice(0, 8)}...</h3>
                                </div>

                                <div className={styles.statsList}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Status</span>
                                        <span className={styles.statValue}>
                                            {node.status === 'active' ? 'Online' : node.status === 'degraded' ? 'Degraded' : 'Offline'}
                                        </span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>IP Address</span>
                                        <span className={styles.statValue}>{node.ip}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Version</span>
                                        <span className={styles.statValue}>{node.release.split(' ')[1]}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Performance</span>
                                        <span className={styles.statValue}>
                                            {(node.performanceScore * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Region</span>
                                        <span className={styles.statValue}>{node.region}</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>STOINC</span>
                                        <span className={styles.statValue}>{node.stoinc.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button
                                    className={styles.viewDetailsBtn}
                                    onClick={() => router.push(`/node/${node.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
