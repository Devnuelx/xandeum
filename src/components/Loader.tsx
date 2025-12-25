import Image from "next/image";
import styles from "./Loader.module.css";

export default function Loader() {
    return (
        <div className={styles.loaderContainer}>
            <div className={styles.logoWrapper}>
                <div className={styles.ring}></div>
                {/* Assuming logo.webp is in public/logo.webp as per previous context */}
                <Image
                    src="/logo.webp"
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
