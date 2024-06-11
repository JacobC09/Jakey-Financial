"use client";

import { useState } from "react"
import { DisputeTransaction, ServerAction as DeleteTransaction, type Transaction } from "@/lib/transactions"

import {
    CaretSortIcon,
    ChevronDownIcon,
    Cross2Icon
} from "@radix-ui/react-icons"

import {
    type ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

const DateCell = ({ row }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost">{formatDate(row.original.date)}</Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none">
                <Calendar
                    mode="default"
                    selected={row.original.date}
                    disableNavigation={true}
                    initialFocus={true}
                    className="rounded-md border shadow"
                />
            </PopoverContent>
        </Popover>
    );
}

const DisputeCell = ({ row }) => {
    const [disputeValue, setDisputeValue] = useState("");
    const router = useRouter();

    if (row.original.disputed) {
        return (<p>{row.original.disputed}</p>);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="secondary"
                >
                    Dispute
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Dispute Purchase</DialogTitle>
                    <DialogDescription>
                        Please speficy a reason why you wish to dispute the following purchase
                    </DialogDescription>
                </DialogHeader>
                <form action={() => { DisputeTransaction(row.original.id, disputeValue); router.refresh() }} className="pt-4 space-y-8">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Reason
                        </Label>
                        <Input id="name" className="col-span-3" onChange={(e) => { setDisputeValue(e.target.value) }} />
                    </div>
                    <div className="flex justify-end">
                        <DialogClose asChild>
                            <Button disabled={disputeValue == ""} type="submit">Save changes</Button>
                        </DialogClose>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const ActionsCell = ({ row }) => {
    const router = useRouter();

    const onclick = () => {
        DeleteTransaction(row.original.id);
        router.refresh()
    }

    return (
        <Button onClick={onclick} variant="ghost" className="h-8 w-8 p-0 outline-none focus-visible:ring-0">
            <Cross2Icon className="h-4 w-4" />
        </Button>
    )
}

var columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: DateCell,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.original.name}</div>
        ),
    },
    {

        accessorKey: "desc",
        header: "Description",
    },
    {
        accessorKey: "cost",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Cost
                    <CaretSortIcon className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("cost"))

            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "CAD",
            }).format(amount)

            return <div className="font-medium">{formatted}</div>
        },
    },
    {
        accessorKey: "disputed",
        header: "Disputed",
        cell: DisputeCell,
    },
    {
        id: "Delete",
        header: "Delete",
        cell: ActionsCell,
    },
]

export function ClientTable({ data, admin }: { data: Transaction[], admin: false }) {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const tableColumns = admin ? columns : columns.slice(0, -1);

    const table = useReactTable({
        data,
        columns: tableColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center justify-between space-x-2 py-4">
                <Input
                    placeholder="Filter by name"
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
