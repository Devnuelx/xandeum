import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Node } from '@/lib/types';
import styles from './AllNodesTable.module.css';

interface AllNodesTableProps {
    nodes: Node[];
    sortColumn: string;
    sortDirection: 'asc' | 'desc';
    onSort: (column: string) => void;
}

export default function AllNodesTable({
    nodes,
    sortColumn,
    sortDirection,
    onSort
}: AllNodesTableProps) {
    const router = useRouter();

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) return <span className={styles.sortIcon}>↕</span>;
        return <span className={styles.sortIconActive}>{sortDirection === 'asc' ? '↑' : '↓'}</span>;
    };

    const formatUptime = (seconds?: number) => {
        if (!seconds) return '—';
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    const formatTimeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const handleRowClick = (nodeId: string, e: React.MouseEvent) => {
        // Don't navigate if clicking on a link or button
        if ((e.target as HTMLElement).closest('a, button')) return;
        router.push(`/node/${nodeId}`);
    };

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => onSort('status')} className={styles.sortable}>
                            Status {getSortIcon('status')}
                        </th>
                        <th onClick={() => onSort('ip')} className={styles.sortable}>
                            Address {getSortIcon('ip')}
                        </th>
                        <th onClick={() => onSort('release')} className={styles.sortable}>
                            Version {getSortIcon('release')}
                        </th>
                        <th onClick={() => onSort('performanceScore')} className={styles.sortable}>
                            Performance {getSortIcon('performanceScore')}
                        </th>
                        <th onClick={() => onSort('lastSeen')} className={styles.sortable}>
                            Last Seen {getSortIcon('lastSeen')}
                        </th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {nodes.map((node) => (
                        <tr
                            key={node.id}
                            className={styles.row}
                            onClick={(e) => handleRowClick(node.id, e)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>
                                <div className={styles.statusCell}>
                                    <span className={`${styles.statusDot} ${styles[node.status]}`}></span>
                                    <span className={styles.statusText}>
                                        {node.status === 'active' ? 'Online'
                                            : node.status === 'degraded' ? 'Degraded'
                                                : 'Offline'}
                                    </span>
                                </div>
                            </td>
                            <td className={styles.addressCell}>
                                <span className={styles.ip}>{node.ip}</span>
                                <span className={styles.port}>:9001</span>
                            </td>
                            <td>
                                <span className={styles.versionBadge}>
                                    {node.release.split(' ')[1]}
                                </span>
                            </td>
                            <td>
                                <div className={styles.perfBarWrapper}>
                                    <div
                                        className={styles.perfBar}
                                        style={{
                                            width: `${node.performanceScore * 100}%`,
                                            backgroundColor: node.performanceScore > 0.8 ? '#10b981'
                                                : node.performanceScore > 0.5 ? '#f59e0b' : '#ef4444'
                                        }}
                                    ></div>
                                </div>
                            </td>
                            <td className={styles.dimmed}>
                                {formatTimeAgo(node.lastSeen)}
                            </td>
                            <td>
                                <Link href={`/node/${node.id}`} className={styles.viewLink}>
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                    {nodes.length === 0 && (
                        <tr>
                            <td colSpan={6} className={styles.emptyState}>
                                No nodes found matching your filters.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

