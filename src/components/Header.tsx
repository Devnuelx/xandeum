import styles from "./Header.module.css";
import Image from "next/image";
interface HeaderProps {
    dataSource: "live" | "mock";
}

export default function Header({ dataSource }: HeaderProps) {
    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>X</div>
                    <div className={styles.logoText}>
                        <Image src={"/logo.webp"} alt="Logo" width={40} height={40} />
                        <h1>Xandeum pNode Analytics</h1>
                        <p>Production Infrastructure Dashboard</p>
                    </div>
                </div>

                <div className={styles.dataSource}>
                    <span className={`${styles.statusDot} ${styles[dataSource]}`}></span>
                    <span>
                        {dataSource === "live" ? "Live RPC Data" : "Derived Data"}
                    </span>
                </div>
            </div>
        </header>
    );
}
