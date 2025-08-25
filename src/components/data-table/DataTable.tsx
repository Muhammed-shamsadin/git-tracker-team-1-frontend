"use client";

import React from "react";
import { useState, useMemo, useEffect } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
    type ColumnFiltersState,
    type RowSelectionState,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Search,
    RefreshCw,
    AlertCircle,
    Database,
} from "lucide-react";
import type { DataTableProps, FilterState } from "./types";
import { StatusBadge } from "./StatusBadge";

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    isLoading = false,
    error = null,
    total = 0,
    serverSide = false,
    onPaginationChange,
    onSortingChange,
    onGlobalFilterChange,
    onFiltersChange,
    onRefresh,
    rowActions = [],
    searchableFields = [],
    filters = [],
    statusConfig,
    rowIdAccessor = "id" as keyof T,
    enableToggle,
    pageSize = 10,
    enableRowSelection = true,
    onRowSelectionChange,
    emptyStateMessage = "No data available",
    emptyStateIcon,
    initialSort = [],
}: DataTableProps<T> & { initialSort?: SortingState }) {
    // Local state for client-side operations
    const [sorting, setSorting] = useState<SortingState>(initialSort);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    // Debounced search for server-side
    const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout>();

    // Handle server-side changes
    useEffect(() => {
        if (serverSide && onPaginationChange) {
            onPaginationChange(pagination);
        }
    }, [pagination, serverSide, onPaginationChange]);

    useEffect(() => {
        if (serverSide && onSortingChange) {
            onSortingChange(sorting);
        }
    }, [sorting, serverSide, onSortingChange]);

    useEffect(() => {
        if (serverSide && onGlobalFilterChange) {
            if (searchDebounce) clearTimeout(searchDebounce);
            const timeout = setTimeout(() => {
                onGlobalFilterChange(globalFilter);
            }, 500); // 500ms debounce
            setSearchDebounce(timeout);
        }
    }, [globalFilter, serverSide, onGlobalFilterChange]);

    useEffect(() => {
        if (serverSide && onFiltersChange) {
            const filterStates: FilterState[] = columnFilters.map((filter) => ({
                id: filter.id,
                value: filter.value,
            }));
            onFiltersChange(filterStates);
        }
    }, [columnFilters, serverSide, onFiltersChange]);

    // Generate dynamic filter options from data (client-side only)
    const dynamicFilters = useMemo(() => {
        if (serverSide) return filters; // For server-side, use provided options

        return filters.map((filter) => {
            if (filter.type === "dynamic" && filter.dynamicKey) {
                const uniqueValues = new Set<string>();
                data.forEach((item) => {
                    const value = item[filter.dynamicKey!];
                    if (Array.isArray(value)) {
                        value.forEach((v) => uniqueValues.add(String(v)));
                    } else if (value) {
                        uniqueValues.add(String(value));
                    }
                });

                return {
                    ...filter,
                    options: Array.from(uniqueValues)
                        .sort()
                        .map((value) => ({ label: value, value })),
                };
            }
            return filter;
        });
    }, [filters, data, serverSide]);

    // Enhanced columns with selection, actions and toggle
    const enhancedColumns = useMemo(() => {
        const cols: ColumnDef<T>[] = [];

        // Add selection column if enabled
        if (enableRowSelection) {
            cols.push({
                id: "select",
                header: ({ table }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() &&
                                "indeterminate")
                        }
                        onCheckedChange={(value) =>
                            table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            } as ColumnDef<T>);
        }

        // Add original columns with custom filter functions (client-side only)
        const enhancedOriginalColumns = columns.map((column) => {
            if (serverSide) return column; // For server-side, don't add client-side filters

            const dynamicFilter = dynamicFilters.find(
                (filter) => filter.key === column.id
            );
            if (dynamicFilter && dynamicFilter.type === "dynamic") {
                return {
                    ...column,
                    filterFn: (row: any, id: string, value: string) => {
                        const cellValue = row.getValue(id);
                        if (Array.isArray(cellValue)) {
                            return cellValue.some((item) =>
                                String(item)
                                    .toLowerCase()
                                    .includes(value.toLowerCase())
                            );
                        }
                        return String(cellValue)
                            .toLowerCase()
                            .includes(value.toLowerCase());
                    },
                };
            }
            return column;
        });

        cols.push(...enhancedOriginalColumns);

        // Add toggle column if enabled
        if (enableToggle) {
            cols.push({
                id: "toggle",
                header: "Active",
                cell: ({ row }) => {
                    const value = row.original[enableToggle.key] as boolean;
                    return (
                        <Switch
                            checked={value}
                            onCheckedChange={(checked) =>
                                enableToggle.onToggle(row.original, checked)
                            }
                        />
                    );
                },
            } as ColumnDef<T>);
        }

        // Add actions column if actions are provided
        if (rowActions.length > 0) {
            cols.push({
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    // Filter visible actions for this row
                    const visibleActions = rowActions.filter((action) =>
                        action.visible ? action.visible(row.original) : true
                    );

                    if (visibleActions.length === 0) {
                        return null;
                    }

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="p-0 w-8 h-8"
                                    disabled={isLoading}
                                >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {visibleActions.map((action, index) => (
                                    <DropdownMenuItem
                                        key={index}
                                        onClick={() =>
                                            action.onClick(row.original)
                                        }
                                        className={
                                            action.variant === "destructive"
                                                ? "text-destructive"
                                                : ""
                                        }
                                    >
                                        {action.icon && (
                                            <span className="mr-2">
                                                {action.icon}
                                            </span>
                                        )}
                                        {action.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            } as ColumnDef<T>);
        }

        return cols;
    }, [
        columns,
        rowActions,
        enableToggle,
        enableRowSelection,
        dynamicFilters,
        serverSide,
        isLoading,
    ]);

    // Custom global filter function (client-side only)
    const globalFilterFn = (row: any, columnId: string, value: string) => {
        if (!searchableFields.length) return true;

        const searchValue = value.toLowerCase();
        return searchableFields.some((field) => {
            const fieldValue = row.original[field];
            if (typeof fieldValue === "object" && fieldValue?.name) {
                return fieldValue.name
                    .toString()
                    .toLowerCase()
                    .includes(searchValue);
            }
            return fieldValue?.toString().toLowerCase().includes(searchValue);
        });
    };

    const table = useReactTable({
        data,
        columns: enhancedColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: serverSide ? undefined : getPaginationRowModel(),
        getSortedRowModel: serverSide ? undefined : getSortedRowModel(),
        getFilteredRowModel: serverSide ? undefined : getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        globalFilterFn: serverSide ? undefined : globalFilterFn,
        manualPagination: serverSide,
        manualSorting: serverSide,
        manualFiltering: serverSide,
        pageCount: serverSide
            ? Math.ceil(total / pagination.pageSize)
            : undefined,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
            pagination,
        },
        getRowId: (row) => String(row[rowIdAccessor]),
        enableRowSelection: enableRowSelection,
    });

    // Handle row selection change
    React.useEffect(() => {
        if (onRowSelectionChange && enableRowSelection) {
            const selectedRows = table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, enableRowSelection]);

    // Status badge component
    // const StatusBadge = ({ status, config }: { status: string; config?: StatusConfig }) => {
    //   if (!config || !config[status]) {
    //     return <Badge variant="secondary">{status}</Badge>
    //   }

    //   const { icon, color, label } = config[status]
    //   return (
    //     <Badge variant="secondary" className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
    //       <span className="mr-1">{icon}</span>
    //       {label || status}
    //     </Badge>
    //   )
    // }

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Skeleton className="w-[300px] h-10" />
                <Skeleton className="w-[180px] h-10" />
                <Skeleton className="w-[180px] h-10" />
            </div>
            <div className="border rounded-md">
                <div className="p-4">
                    {Array.from({ length: pageSize }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center space-x-4 py-2"
                        >
                            <Skeleton className="w-4 h-4" />
                            <Skeleton className="w-[250px] h-4" />
                            <Skeleton className="w-[100px] h-4" />
                            <Skeleton className="w-[100px] h-4" />
                            <Skeleton className="w-[80px] h-4" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Error state
    if (error) {
        return (
            <div className="space-y-4">
                <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription className="flex justify-between items-center">
                        <span>{error.message}</span>
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                            >
                                <RefreshCw className="mr-2 w-4 h-4" />
                                Retry
                            </Button>
                        )}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Loading state
    if (isLoading && data.length === 0) {
        return <LoadingSkeleton />;
    }

    // Calculate search input width based on content
    const searchPlaceholder = `Search ${searchableFields.join(", ")}...`;
    const searchInputWidth = Math.max(
        200, // minimum width
        Math.min(
            400,
            globalFilter.length * 8 + 120,
            searchPlaceholder.length * 8 + 40
        ) // dynamic width
    );

    const displayTotal = serverSide
        ? total
        : table.getFilteredRowModel().rows.length;

    return (
        <div className="space-y-4">
            {/* Selection info and Search/Filters */}
            <div className="flex flex-col gap-4">
                {/* Refresh button and selection info */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {onRefresh && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onRefresh}
                                disabled={isLoading}
                            >
                                <RefreshCw
                                    className={`h-4 w-4 mr-2 ${
                                        isLoading ? "animate-spin" : ""
                                    }`}
                                />
                                Refresh
                            </Button>
                        )}
                        {enableRowSelection &&
                            Object.keys(rowSelection).length > 0 && (
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <span>
                                        {Object.keys(rowSelection).length}{" "}
                                        row(s) selected
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setRowSelection({})}
                                    >
                                        Clear selection
                                    </Button>
                                </div>
                            )}
                    </div>
                    {serverSide && (
                        <Badge variant="outline" className="text-xs">
                            <Database className="mr-1 w-3 h-3" />
                            Server-side
                        </Badge>
                    )}
                </div>

                {/* Search and Filters */}
                <div className="flex sm:flex-row flex-col gap-4">
                    {/* Global Search */}
                    {searchableFields.length > 0 && (
                        <div
                            className="relative"
                            style={{ minWidth: "200px", maxWidth: "400px" }}
                        >
                            <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                            <Input
                                placeholder={searchPlaceholder}
                                value={globalFilter}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                className="pl-10 transition-all duration-200"
                                style={{ width: `${searchInputWidth}px` }}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Column Filters */}
                    <div className="flex flex-wrap gap-2">
                        {dynamicFilters.map((filter) => {
                            const column = table.getColumn(filter.key);
                            const currentValue =
                                (column?.getFilterValue() as string) ?? "";

                            return (
                                <Select
                                    key={filter.key}
                                    value={currentValue}
                                    onValueChange={(value) => {
                                        if (value === "all" || value === "") {
                                            column?.setFilterValue("");
                                        } else {
                                            column?.setFilterValue(value);
                                        }
                                    }}
                                    disabled={isLoading}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue
                                            placeholder={filter.label}
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        <SelectItem value="all">
                                            All {filter.label}
                                        </SelectItem>
                                        {filter.options?.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="border rounded-md overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="whitespace-nowrap"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none flex items-center gap-2 hover:text-foreground"
                                                        : ""
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanSort() && (
                                                    <div className="flex flex-col">
                                                        {header.column.getIsSorted() ===
                                                        "asc" ? (
                                                            <ArrowUp className="w-3 h-3" />
                                                        ) : header.column.getIsSorted() ===
                                                          "desc" ? (
                                                            <ArrowDown className="w-3 h-3" />
                                                        ) : (
                                                            <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading && data.length > 0 ? (
                            // Show loading overlay for existing data
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="opacity-50">
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
                                            {cell.column.id
                                                .toLowerCase()
                                                .includes("status") &&
                                            statusConfig ? (
                                                <StatusBadge
                                                    status={
                                                        cell.getValue() as string
                                                    }
                                                    config={statusConfig}
                                                />
                                            ) : (
                                                flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className="hover:bg-muted/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="whitespace-nowrap"
                                        >
                                            {cell.column.id
                                                .toLowerCase()
                                                .includes("status") &&
                                            statusConfig ? (
                                                <StatusBadge
                                                    status={
                                                        cell.getValue() as string
                                                    }
                                                    config={statusConfig}
                                                />
                                            ) : (
                                                flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={enhancedColumns.length}
                                    className="h-24 text-center"
                                >
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        {emptyStateIcon || (
                                            <Database className="w-8 h-8" />
                                        )}
                                        <span>{emptyStateMessage}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
                <div className="text-muted-foreground text-sm">
                    Showing{" "}
                    {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        1}{" "}
                    to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                        displayTotal
                    )}{" "}
                    of {displayTotal} results
                    {enableRowSelection &&
                        Object.keys(rowSelection).length > 0 && (
                            <span className="ml-2">
                                ({Object.keys(rowSelection).length} selected)
                            </span>
                        )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Rows per page</p>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                            disabled={isLoading}
                        >
                            <SelectTrigger className="w-[70px] h-8">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage() || isLoading}
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage() || isLoading}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2">
                            <span className="font-medium text-sm">
                                Page {table.getState().pagination.pageIndex + 1}{" "}
                                of{" "}
                                {serverSide
                                    ? Math.ceil(total / pagination.pageSize)
                                    : table.getPageCount()}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage() || isLoading}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage() || isLoading}
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
