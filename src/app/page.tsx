"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import DashboardGrid from "@/components/DashboardGrid";
import NetworkEarnings from "@/components/NetworkEarnings";
import GlobalMap from "@/components/GlobalMap";
import NodesTable from "@/components/NodesTable";
import Loader from "@/components/Loader";
import { NodesAPIResponse } from "@/lib/types";
import styles from "./page.module.css";

import { useSearchParams } from "next/navigation";

export default function HomePage() {
    const [data, setData] = useState<NodesAPIResponse | null>(null);
    const searchParams = useSearchParams();
    const pickingFor = searchParams.get('picking_for');

    useEffect(() => {
        fetchNodes();
        const interval = setInterval(fetchNodes, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchNodes() {
        try {
            const response = await fetch("/api/nodes");
            const json: NodesAPIResponse = await response.json();
            setData(json);
        } catch (error) {
            console.error(error);
        }
    }

    // Use Loader component
    if (!data) return <Loader />;

    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>
                <div id="overview">
                    <TopBar nodes={data.nodes} dataSource={data.meta.source} />
                </div>

                <div id="analytics">
                    <DashboardGrid nodes={data.nodes} />
                    <NetworkEarnings />
                    <GlobalMap nodes={data.nodes} />
                </div>

                <div id="nodes" className={styles.tableWrapper}>
                    <NodesTable
                        nodes={data.nodes}
                        pickingFor={pickingFor || undefined}
                    />
                </div>
            </div>
        </main>
    );
}
