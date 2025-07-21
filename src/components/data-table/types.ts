import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

export interface StatusConfig {
    [key: string]: {
        icon: string;
        color: string;
        label?: string;
    };
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    type: "select" | "multi-select" | "date-range" | "dynamic";
    options?: FilterOption[];
    component?: ReactNode;
    dynamicKey?: string; // For dynamic filters that pull from data
}

export interface RowAction<T> {
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
    variant?: "default" | "destructive";
}

export interface DataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    rowActions?: RowAction<T>[];
    searchableFields?: (keyof T)[];
    filters?: FilterConfig[];
    statusConfig?: StatusConfig;
    rowIdAccessor?: keyof T;
    enableToggle?: {
        key: keyof T;
        onToggle: (row: T, value: boolean) => void;
    };
    pageSize?: number;
    enableRowSelection?: boolean;
    onRowSelectionChange?: (selectedRows: T[]) => void;
}

export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface SortingState {
    id: string;
    desc: boolean;
}
[];
