import Image from "next/image";
import styles from "./Loader.module.css";
import logo from "../public/logo.webp";

export default function Loader() {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.logoWrapper}>
                <div className={styles.ring}></div>
                <Image
                    src={logo}
                    alt="Xandeum Loading"
                    width={64}
                    height={64}
                    className={styles.logo}
                    priority
                />
            </div>
            <div className={styles.loadingText}>Initializing Network...</div>
        </div>
    );
}
