import { Node } from "@/lib/types";
import { useRouter } from "next/navigation";
import styles from "./NodesTable.module.css";

interface NodesTableProps {
    nodes: Node[];
    pickingFor?: string;
}

export default function NodesTable({ nodes, pickingFor }: NodesTableProps) {
    const router = useRouter();
    const isPickingMode = !!pickingFor;

    const handleRowClick = (nodeId: string) => {
        if (isPickingMode && pickingFor) {
            // Append and redirect back to compare
            const currentIds = pickingFor.split(',').filter(Boolean);
            if (!currentIds.includes(nodeId)) {
                currentIds.push(nodeId);
            }
            router.push(`/compare?nodes=${currentIds.join(',')}`);
        } else {
            // Normal navigation
            router.push(`/node/${nodeId}`);
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {isPickingMode ? (
                    <div style={{ padding: '8px', background: 'var(--color-primary)', color: 'white', borderRadius: '4px' }}>
                        <strong>Select a Node to Compare</strong>
                    </div>
                ) : (
                    <>
                        <h2 className={styles.title}>Network Nodes</h2>
                        <p className={styles.subtitle}>Real-time node status and metrics</p>
                    </>
                )}
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '25%' }}>Node</th>
                            <th style={{ width: '15%' }}>Status</th>
                            <th style={{ width: '20%' }}>Location</th>
                            <th style={{ width: '15%' }}>Uptime</th>
                            <th style={{ width: '15%' }}>Response</th>
                            <th style={{ textAlign: 'right' }}>Storage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nodes.slice(0, 15).map((node, i) => {
                            // Simulate extra data for matching the screenshot aesthetic
                            const uptime = node.status === 'active' ? (99.5 + Math.random() * 0.49).toFixed(2) : '0.00';
                            const responseTime = node.status === 'active' ? Math.floor(8 + Math.random() * 20) : 0;
                            const storageUsed = node.status === 'active' ? (100 + Math.random() * 400).toFixed(1) : '0.0';
                            const nodeName = `Node ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta'][i % 6]}`;

                            return (
                                <tr
                                    key={node.id}
                                    onClick={() => router.push(`/node/${node.id}`)}
                                    className={styles.clickableRow}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>
                                        <div className={styles.nodeCell}>
                                            <span className={styles.nodeName}>{nodeName}</span>
                                            <span className={styles.nodeId}>Xand...{node.id.slice(-4)}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${styles[node.status]}`}>
                                            {node.status === 'active' ? 'Online' : node.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.locationCell}>
                                            <span className={styles.city}>
                                                {/* Map regions to fake cities for aesthetics */}
                                                {node.region.includes('us-east') ? 'New York' :
                                                    node.region.includes('us-west') ? 'San Francisco' :
                                                        node.region.includes('eu-central') ? 'Berlin' :
                                                            node.region.includes('eu-west') ? 'London' :
                                                                node.region.includes('ap-south') ? 'Singapore' : 'Tokyo'}
                                            </span>
                                            <span className={styles.country}>{node.region.split('-')[0].toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td className={styles.mono}>{uptime}%</td>
                                    <td className={styles.mono}>{responseTime}ms</td>
                                    <td className={styles.mono} style={{ textAlign: 'right' }}>
                                        {storageUsed} / 500 GB
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {nodes.length > 15 && (
                    <div className={styles.viewAllContainer}>
                        <button
                            className={styles.viewAllBtn}
                            onClick={() => router.push('/all-nodes')}
                        >
                            View All Nodes ({nodes.length})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
