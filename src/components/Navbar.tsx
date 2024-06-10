"use client";

import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Button } from "./ui/button";
import { TriangleRightIcon } from "@radix-ui/react-icons";
import { logout } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar({ page, showLogout=true }) {
    const router = useRouter();

    return (
        <nav className="py-4 px-10 flex justify-between items-center border-b">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <p className="text-lg font-bold">Jakey Financials</p>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-lg font-bold" >{page}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {
                showLogout && 
                <Button variant="secondary" onClick={() => {logout(); router.refresh()}}>
                    <p className="font-bold">Logout</p>
                </Button>
            }
        </nav>
    );
}