import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import ROICalculator from "@/components/ROICalculator";
import styles from "./page.module.css";
import Loader from "@/components/Loader";

export default function ROICalculatorPage() {
    return (
        <main className={styles.mainLayout}>
            <Sidebar />
            <div className={styles.contentColumn}>
                <Suspense fallback={<Loader />}>
                    <ROICalculator />
                </Suspense>
            </div>
        </main>
    );
}
