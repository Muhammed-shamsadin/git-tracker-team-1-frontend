"use client";

import React from "react";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import type { DataTableProps, StatusConfig } from "./types";

export function DataTable<T extends Record<string, any>>({
    data,
    columns,
    rowActions = [],
    searchableFields = [],
    filters = [],
    statusConfig,
    rowIdAccessor = "id" as keyof T,
    enableToggle,
    pageSize = 10,
    enableRowSelection = true,
    onRowSelectionChange,
}: DataTableProps<T>) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize,
    });

    // Generate dynamic filter options from data
    const dynamicFilters = useMemo(() => {
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
    }, [filters, data]);

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

        // Add original columns with custom filter functions
        const enhancedOriginalColumns = columns.map((column) => {
            // Find if this column has a dynamic filter
            const dynamicFilter = dynamicFilters.find(
                (filter) => filter.key === column.id
            );

            if (dynamicFilter && dynamicFilter.type === "dynamic") {
                return {
                    ...column,
                    filterFn: (row: any, id: string, value: string) => {
                        const cellValue = row.getValue(id);

                        // Handle array fields (like projects, labels)
                        if (Array.isArray(cellValue)) {
                            return cellValue.some((item) =>
                                String(item)
                                    .toLowerCase()
                                    .includes(value.toLowerCase())
                            );
                        }

                        // Handle string fields
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
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 w-8 h-8">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {rowActions.map((action, index) => (
                                <DropdownMenuItem
                                    key={index}
                                    onClick={() => action.onClick(row.original)}
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
                ),
            } as ColumnDef<T>);
        }

        return cols;
    }, [columns, rowActions, enableToggle, enableRowSelection, dynamicFilters]);

    // Custom global filter function
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
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        globalFilterFn,
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
    const StatusBadge = ({
        status,
        config,
    }: {
        status: string;
        config?: StatusConfig;
    }) => {
        if (!config || !config[status]) {
            return <Badge variant="secondary">{status}</Badge>;
        }

        const { icon, color, label } = config[status];
        return (
            <Badge
                variant="secondary"
                className={`bg-${color}-100 text-${color}-800 border-${color}-200`}
            >
                <span className="mr-1">{icon}</span>
                {label || status}
            </Badge>
        );
    };

    // Calculate search input width based on content
    const searchPlaceholder = `Search ${searchableFields.join(", ")}...`;
    const searchInputWidth = Math.max(
        300, // minimum width
        Math.min(
            400,
            globalFilter.length * 8 + 120,
            searchPlaceholder.length * 8 + 40
        ) // dynamic width
    );

    return (
        <div className="space-y-4">
            {/* Selection info and Search/Filters */}
            <div className="flex flex-col gap-4">
                {/* Selection info */}
                {enableRowSelection && Object.keys(rowSelection).length > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <span>
                            {Object.keys(rowSelection).length} row(s) selected
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
                        {table.getRowModel().rows?.length ? (
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
                                            {/* Special handling for status columns */}
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
                                    No results found.
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
                        table.getFilteredRowModel().rows.length
                    )}{" "}
                    of {table.getFilteredRowModel().rows.length} results
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
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="flex items-center gap-1 px-2">
                            <span className="font-medium text-sm">
                                Page {table.getState().pagination.pageIndex + 1}{" "}
                                of {table.getPageCount()}
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
