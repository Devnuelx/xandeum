"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <Image
                    src="/logo.webp"
                    alt="Xandeum"
                    width={40}
                    height={40}
                    className={styles.brandLogo}
                />
            </div>

            <nav className={styles.nav}>
                <Link href="/#overview" className={`${styles.navItem}`}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                    Overview
                </Link>
                <Link href="/#nodes" className={styles.navItem}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" />
                        <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                    Nodes
                </Link>
                <Link href="/#analytics" className={styles.navItem}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 20V10" />
                        <path d="M18 20V4" />
                        <path d="M6 20v-4" />
                    </svg>
                    Analytics
                </Link>
                <Link href="/methodology" className={styles.navItem}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Methodology
                </Link>
            </nav>

            <div className={styles.sectionHeader}>Documentation</div>
            <nav className={styles.nav}>
                <a href="#" className={styles.navItem} onClick={(e) => { e.preventDefault(); window.open('https://docs.xandeum.network/xandeum-pnode-setup-guide', '_blank'); }}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    pNode Setup
                </a>
                <a href="#" className={styles.navItem} onClick={(e) => { e.preventDefault(); window.open('https://rpc.xandeum.network', '_blank'); }}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                    </svg>
                    pRPC Reference
                </a>
                <a href="#" className={styles.navItem} onClick={(e) => { e.preventDefault(); window.open('https://docs.xandeum.network', '_blank'); }}>
                    <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    Network Docs
                </a>
            </nav>

            <div className={styles.footer}>
                v1.2.3 • 2025
            </div>
        </aside>
    );
}
