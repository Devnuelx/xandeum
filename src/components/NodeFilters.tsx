import React from 'react';
import styles from './NodeFilters.module.css';

interface NodeFiltersProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    versionFilter: string;
    setVersionFilter: (version: string) => void;
    totalCount: number;
}

export default function NodeFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    versionFilter,
    setVersionFilter,
    totalCount
}: NodeFiltersProps) {
    return (
        <div className={styles.filtersContainer}>
            <div className={styles.searchWrapper}>
                <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search IP, Pubkey..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.dropdownsWrapper}>
                <div className={styles.filterGroup}>
                    <select
                        className={styles.select}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Online (Active)</option>
                        <option value="degraded">Degraded</option>
                        <option value="offline">Offline</option>
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <select
                        className={styles.select}
                        value={versionFilter}
                        onChange={(e) => setVersionFilter(e.target.value)}
                    >
                        <option value="all">All Versions</option>
                        <option value="Herrenberg v0.9">Herrenberg v0.9</option>
                        <option value="Munich v0.8">Munich v0.8</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
