import { Node } from "@/lib/types";
import styles from "./TopBar.module.css";

interface TopBarProps {
    nodes: Node[];
    dataSource: "live" | "devnet" | "mock";
}

export default function TopBar({ nodes, dataSource }: TopBarProps) {
    // Map data source to display text
    const getStatusText = () => {
        switch (dataSource) {
            case "live": return "Live pRPC Connection";
            case "devnet": return "Devnet Environment";
            case "mock": return "Simulated Environment";
        }
    };

    return (
        <div className={styles.topBar}>
            <div className={styles.statusIndicator}>
                <span className={`${styles.dot} ${styles[dataSource]}`}></span>
                {getStatusText()}
            </div>

            {/* Kept minimal since metrics moved to DashboardGrid */}
        </div>
    );
}
