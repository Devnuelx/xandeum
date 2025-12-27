import { Suspense } from "react";
import Loader from "@/components/Loader";
import ComparePageContent from "./ComparePageContent";

// Force dynamic rendering to avoid build errors
export const dynamic = 'force-dynamic';

export default function ComparePage() {
    return (
        <Suspense fallback={<Loader />}>
            <ComparePageContent />
        </Suspense>
    );
}
