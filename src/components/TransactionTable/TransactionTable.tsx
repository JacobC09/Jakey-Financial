import { GetTransactions } from "@/lib/transactions";
import { type Transaction, ClientTable } from "./ClientTable";
import AddTransactionButton from "@/components/AddTransactionButton";
import { getSession } from "@/lib/auth";

export default async function TransactionTable() {
    const data = await GetTransactions();
    const session = await getSession();

    return (
        <>
            {
                session.data.admin ?
                    <p className="text-lg font-bold">
                        You are loggined in as an <span className="text-red-500">Admin</span>
                    </p>
                    :
                    <p className="text-lg font-bold">
                        You are loggined in as a <span className="text-primary">Parent</span>
                    </p>
            }
            {session.data.admin && <AddTransactionButton />}
            <ClientTable data={data} admin={session.data.admin} />
        </>
    );
}