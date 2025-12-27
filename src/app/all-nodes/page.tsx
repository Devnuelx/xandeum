"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import AllNodesTable from "@/components/AllNodesTable";
import NodeFilters from "@/components/NodeFilters";
import Pagination from "@/components/Pagination";
import Loader from "@/components/Loader";
import { NodesAPIResponse, Node } from "@/lib/types";
import styles from "./page.module.css";

const ITEMS_PER_PAGE = 20;

export default function AllNodesPage() {
    const router = useRouter();
    const [allNodes, setAllNodes] = useState<Node[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [versionFilter, setVersionFilter] = useState("all");

    // Sort & Pagination
    const [sortColumn, setSortColumn] = useState("lastSeen");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchNodes();
        const interval = setInterval(fetchNodes, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchNodes() {
        try {
            // Initial fetch or background refresh
            if (allNodes.length === 0) setLoading(true);

            const response = await fetch("/api/nodes");
            const json: NodesAPIResponse = await response.json();
            setAllNodes(json.nodes);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    // Filter Logic
    const filteredNodes = useMemo(() => {
        return allNodes.filter(node => {
            // Search
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch = !searchQuery ||
                node.ip.toLowerCase().includes(searchLower) ||
                node.id.toLowerCase().includes(searchLower);

            // Status
            const matchesStatus = statusFilter === "all" ||
                (statusFilter === "active" && node.status === "active") ||
                (statusFilter === "degraded" && node.status === "degraded") ||
                (statusFilter === "offline" && node.status === "offline");

            // Version
            const matchesVersion = versionFilter === "all" ||
                node.release === versionFilter;

            return matchesSearch && matchesStatus && matchesVersion;
        });
    }, [allNodes, searchQuery, statusFilter, versionFilter]);

    // Sort Logic
    const sortedNodes = useMemo(() => {
        return [...filteredNodes].sort((a, b) => {
            let aVal: any = a[sortColumn as keyof Node];
            let bVal: any = b[sortColumn as keyof Node];

            // Handle special cases
            if (sortColumn === 'status') {
                const statusOrder = { active: 3, degraded: 2, offline: 1 };
                aVal = statusOrder[a.status];
                bVal = statusOrder[b.status];
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredNodes, sortColumn, sortDirection]);

    // Pagination Logic
    const paginatedNodes = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedNodes.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [sortedNodes, currentPage]);

    const totalPages = Math.ceil(filteredNodes.length / ITEMS_PER_PAGE);

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('desc'); // Default to desc for new columns
        }
    };

    // Calculate stats
    const stats = useMemo(() => {
        const total = allNodes.length;
        const online = allNodes.filter(n => n.status === 'active').length;
        const offline = allNodes.filter(n => n.status === 'offline').length;
        // Mock uptime calculation from performance score for now
        const avgUptime = Math.round(allNodes.reduce((acc, curr) => acc + (curr.performanceScore || 0), 0) / (total || 1) * 100);

        return { total, online, offline, avgUptime };
    }, [allNodes]);

    if (loading && allNodes.length === 0) return <Loader />;

    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>

                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <div className={styles.breadcrumbs}>
                            Home &gt; Dashboard &gt; <span className={styles.activeBreadcrumb}>All Nodes</span>
                        </div>
                        <h1 className={styles.title}>Network Nodes</h1>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total Nodes</div>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statSub}>Registered pNodes</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Online</div>
                        <div className={styles.statValue}>{stats.online}</div>
                        <div className={styles.statSub}>Currently active</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Offline</div>
                        <div className={styles.statValue}>{stats.offline}</div>
                        <div className={styles.statSub}>No recent heartbeat</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statLabel}>Avg Network Uptime</div>
                        <div className={styles.statValue}>{stats.avgUptime}%</div>
                        <div className={styles.statSub}>Across {stats.total} nodes</div>
                    </div>
                </div>

                {/* Filters */}
                <NodeFilters
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    versionFilter={versionFilter}
                    setVersionFilter={setVersionFilter}
                    totalCount={filteredNodes.length}
                />

                {/* Table */}
                <AllNodesTable
                    nodes={paginatedNodes}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                />

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />

            </div>
        </main>
    );
}
