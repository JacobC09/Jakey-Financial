import { cn } from "@/lib/utils";

export function Spinner({ className="" }) {
    return (
        <div
            className={cn("inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]", className)}
            role="status"
        >
        </div>
    );
}