"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { AddTransaction } from "@/lib/transactions";
import { useRouter } from "next/navigation";

export default function AddTransactionButton() {
    const form = useForm();
    const router = useRouter();

    const onSubmit = (data: any) => {
        AddTransaction(data.name, data.description, parseFloat(data.cost));
        form.reset();
        router.refresh();
    }

    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="secondary"
                    >
                        Add Transaction
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Transaction</DialogTitle>
                        <DialogDescription>
                            Please complete for following form to add a new transaction record
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form} >
                        <form action={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                rules={{
                                    required: true
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Name</Label>
                                        <FormControl>
                                            <Input placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                rules={{
                                    required: true
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Description</Label>
                                        <FormControl>
                                            <Input placeholder="Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cost"
                                rules={{
                                    required: true,
                                    min: 0.01,
                                }}
                                render={({ field }) => (
                                    <FormItem>
                                        <Label>Cost</Label>
                                        <FormControl>
                                            <Input type="number" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogClose asChild>
                                <Button disabled={!form.formState.isValid} type="submit">Add Transaction</Button>
                            </DialogClose>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}