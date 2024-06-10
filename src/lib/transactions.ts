"use server";

import { getSession } from "./auth";
import { db } from "./db"

export type Transaction = {
    id: string,
    name: string,
    desc: string,
    cost: number,
    date: Date,
    disputed: string | null,
}

export async function AddTransaction(name: sring, desc: string, cost: number) {
    if (!(await getSession()).data.admin) return;
    
    await db.transaction.create({
        data: {
            name: name,
            desc: desc,
            cost: cost,
            disputed: null,
        }
    });
}

export async function DisputeTransaction(id, dispute) {
    await db.transaction.update({
        where: {
            id: id
        },
        data: {
            disputed: dispute
        }
    });
}

export async function ServerAction(id) {
    if (!(await getSession()).data.admin) return;

    await db.transaction.delete({
        where: {
            id: id
        }
    });
}

export async function GetTransactions() : Transaction[] {
    const data = await db.transaction.findMany();
    let transactions: Transaction[] = [];

    for (let transaction of data) {
        transactions.push({
            id: transaction.id,
            name: transaction.name,
            desc: transaction.desc,
            cost: transaction.cost,
            date: new Date(transaction.createdAt),
            disputed: transaction.disputed
        });
    }

    transactions.sort((left, right) => left - right);
    transactions.reverse();

    return transactions;
}


