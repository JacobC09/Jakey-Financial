import { Suspense } from "react";

import TransactionTable from "@/components/TransactionTable/TransactionTable";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
    return (
        <>
            <Navbar page="Dashboard" />
            <main className="p-8 space-y-4">
                <Suspense fallback={<p>Getting data from database...</p>}>
                    <TransactionTable />
                </Suspense>
            </main>
        </>
    );
}