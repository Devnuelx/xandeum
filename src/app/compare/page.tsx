import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import ComparisonTable from "@/components/ComparisonTable";
import Loader from "@/components/Loader";

export default function ComparePage() {
    return (
        <main style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg-base)' }}>
            <Sidebar />
            <div style={{ flex: 1, marginLeft: 250 }}>
                <Suspense fallback={<div style={{ padding: 40 }}><Loader /></div>}>
                    <ComparisonTable />
                </Suspense>
            </div>
        </main>
    );
}
