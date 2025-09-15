import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GroupBy<T, K extends keyof T> = Record<string, T[]>;

export function groupBy<T, K extends keyof T>(
    array: T[],
    key: K
): GroupBy<T, K> {
    return array.reduce((acc, item) => {
        const keyValue = String(item[key]);
        if (!acc[keyValue]) {
            acc[keyValue] = [];
        }
        acc[keyValue].push(item);
        return acc;
    }, {} as GroupBy<T, K>);
}

export function timeAgo(date: string | number | Date): string {
    const inputDate = new Date(date);
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - inputDate.getTime());
    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    if (minutes > 0) return `${minutes} minutes ago`;
    return `${seconds} seconds ago`;
}
