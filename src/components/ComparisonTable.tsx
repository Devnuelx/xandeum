"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Node } from "@/lib/types";
import Loader from "@/components/Loader";
import Link from "next/link";
import styles from "./ComparisonTable.module.css";

export default function ComparisonTable() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [nodes, setNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    const nodeIds = searchParams.get('nodes')?.split(',').filter(Boolean) || [];

    useEffect(() => {
        if (nodeIds.length === 0) {
            setLoading(false);
            return;
        }

        async function fetchData() {
            try {
                // Fetch all nodes and filtering client-side for simplicity in this MVP
                // In prod, would utilize the multi-get or separate fetch calls optimized
                const res = await fetch('/api/nodes');
                const data = await res.json();
                const allNodes: Node[] = data.nodes;

                // Map IDs to actual node objects (maintain order)
                const foundNodes = nodeIds.map(id => allNodes.find(n => n.id === id)).filter(Boolean) as Node[];
                setNodes(foundNodes);
            } catch (err) {
                console.error("Failed to compare nodes", err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [searchParams]);

    const removeNode = (idToRemove: string) => {
        const newIds = nodeIds.filter(id => id !== idToRemove);
        const newQuery = newIds.length > 0 ? `?nodes=${newIds.join(',')}` : '/compare';
        router.push(`/compare${newQuery}`);
    };

    if (loading) return <div style={{ padding: 40 }}><Loader /></div>;

    if (nodes.length === 0) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <h2>No Nodes Selected</h2>
                    <p style={{ marginBottom: '20px', color: 'var(--color-text-secondary)' }}>
                        Select nodes from the dashboard to compare their performance.
                    </p>
                    <Link href="/#nodes" className={styles.addBtn} style={{ textDecoration: 'none', borderStyle: 'solid' }}>
                        Browse Nodes
                    </Link>
                </div>
            </div>
        );
    }

    // Construct the "Add Node" URL that preserves current context
    const currentIds = nodes.map(n => n.id).join(',');
    const addNodeUrl = `/?picking_for=${currentIds}#nodes`;
    const getBestValue = (metric: 'uptime' | 'score' | 'latency') => {
        if (nodes.length < 2) return null;
        if (metric === 'uptime') return Math.max(...nodes.map(n => n.status === 'active' ? 99.9 : 0)); // Simulated logic matching existing mocked randoms? 
        // Actually, we should use the rendered value logic if it's random, but here we read from node object.
        // For this MVP, we'll just check the static props or derived props.
        if (metric === 'score') return Math.max(...nodes.map(n => n.performanceScore));
        return null;
    };

    const bestScore = getBestValue('score');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Node Comparison</h1>
                <p className={styles.subtitle}>Comparing {nodes.length} pNode{nodes.length !== 1 ? 's' : ''}</p>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            {nodes.map((node, i) => (
                                <th key={node.id} className={styles.nodeHeader}>
                                    <span className={styles.nodeName}>
                                        Node {['Alpha', 'Beta', 'Gamma', 'Delta'][i] || i + 1}
                                    </span>
                                    <span className={styles.nodeId}>
                                        {node.id.substring(0, 4)}...{node.id.substring(node.id.length - 4)}
                                    </span>
                                    <button onClick={() => removeNode(node.id)} className={styles.removeBtn}>
                                        Remove
                                    </button>
                                </th>
                            ))}
                            {nodes.length < 3 && (
                                <th className={styles.emptySlot}>
                                    <Link href={addNodeUrl} className={styles.addBtn} style={{ textDecoration: 'none', display: 'inline-block' }}>
                                        + Add Node
                                    </Link>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Status</td>
                            {nodes.map(node => (
                                <td key={node.id} className={styles.metricValue}>
                                    <span style={{
                                        color: node.status === 'active' ? 'var(--color-success)' : 'var(--color-danger)',
                                        fontWeight: 600,
                                        textTransform: 'capitalize'
                                    }}>
                                        {node.status}
                                    </span>
                                </td>
                            ))}
                            {nodes.length < 3 && <td></td>}
                        </tr>
                        <tr>
                            <td>Region</td>
                            {nodes.map(node => (
                                <td key={node.id} className={styles.metricValue}>{node.region}</td>
                            ))}
                            {nodes.length < 3 && <td></td>}
                        </tr>
                        <tr>
                            <td>Perf. Score</td>
                            {nodes.map(node => (
                                <td key={node.id} className={styles.metricValue}>
                                    <span className={node.performanceScore === bestScore ? styles.bestValue : ''}>
                                        {(node.performanceScore * 100).toFixed(0)}/100
                                    </span>
                                </td>
                            ))}
                            {nodes.length < 3 && <td></td>}
                        </tr>
                        <tr>
                            <td>Performance Tier</td>
                            {nodes.map(node => {
                                const score = node.performanceScore * 100;
                                let tierClass = styles.tierLow;
                                let tierLabel = "Below Average";
                                if (score > 80) { tierClass = styles.tierTop; tierLabel = "Top Performer"; }
                                else if (score > 50) { tierClass = styles.tierMid; tierLabel = "Median"; }

                                return (
                                    <td key={node.id} className={styles.metricValue}>
                                        <span className={`${styles.tierBadge} ${tierClass}`}>
                                            {tierLabel}
                                        </span>
                                    </td>
                                );
                            })}
                            {nodes.length < 3 && <td></td>}
                        </tr>
                        <tr>
                            <td>Est. Monthly Rewards</td>
                            {nodes.map(node => (
                                <td key={node.id} className={styles.metricValue}>
                                    {/* Link to ROI calculator with specific params */}
                                    <Link
                                        href={`/roi-calculator?uptime=${(node.performanceScore * 100).toFixed(0)}`}
                                        style={{ fontSize: '0.85rem', color: 'var(--color-primary)', textDecoration: 'none' }}
                                    >
                                        Calculate ROI →
                                    </Link>
                                </td>
                            ))}
                            {nodes.length < 3 && <td></td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
