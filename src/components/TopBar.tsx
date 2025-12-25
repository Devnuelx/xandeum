import { Node } from "@/lib/types";
import styles from "./TopBar.module.css";

interface TopBarProps {
    nodes: Node[];
    dataSource: "live" | "mock";
}

export default function TopBar({ nodes, dataSource }: TopBarProps) {

    return (
        <div className={styles.topBar}>
            <div className={styles.statusIndicator}>
                <span className={`${styles.dot} ${styles[dataSource]}`}></span>
                {dataSource === "live" ? "Live RPC Connection" : "Simulated Environment"}
            </div>

            {/* Kept minimal since metrics moved to DashboardGrid */}
        </div>
    );
}
