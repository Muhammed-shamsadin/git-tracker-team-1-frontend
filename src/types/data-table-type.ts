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

export interface SortingState {
    id: string;
    desc: boolean;
}

export interface PaginationState {
    pageIndex: number;
    pageSize: number;
}

export interface FilterState {
    id: string;
    value: any;
}

// API-related types
export interface ApiResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
}

export interface ApiParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filters?: Record<string, any>;
}

export interface DataTableProps<T> {
    // Data props
    data: T[];
    columns: ColumnDef<T>[];

    // API props
    isLoading?: boolean;
    error?: ApiError | null;
    total?: number;
    serverSide?: boolean;

    // Event handlers for server-side operations
    onPaginationChange?: (pagination: PaginationState) => void;
    onSortingChange?: (sorting: SortingState[]) => void;
    onGlobalFilterChange?: (search: string) => void;
    onFiltersChange?: (filters: FilterState[]) => void;
    onRefresh?: () => void;

    // UI props
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

    // Loading states
    emptyStateMessage?: string;
    emptyStateIcon?: ReactNode;
}

// Hook types
export interface UseDataTableOptions<T> {
    apiEndpoint: string;
    initialPageSize?: number;
    searchableFields?: (keyof T)[];
    defaultFilters?: Record<string, any>;
    defaultSort?: { field: keyof T; order: "asc" | "desc" };
    refetchInterval?: number;
}

export interface UseDataTableReturn<T> {
    data: T[];
    isLoading: boolean;
    error: ApiError | null;
    total: number;
    pagination: PaginationState;
    sorting: SortingState[];
    globalFilter: string;
    filters: FilterState[];

    // Actions
    setPagination: (pagination: PaginationState) => void;
    setSorting: (sorting: SortingState[]) => void;
    setGlobalFilter: (search: string) => void;
    setFilters: (filters: FilterState[]) => void;
    refresh: () => void;
}
