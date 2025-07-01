"use client";

import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  ArrowUpDownIcon,
  SettingsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableProps<TData> {
  columns: Column<TData>[];
  data: TData[];
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
}

export interface Column<TData> {
  id?: string;
  accessorKey?: keyof TData;
  header: string | React.ComponentType<{ column: unknown }>;
  cell?: React.ComponentType<{ row: { original: TData } }>;
  enableSorting?: boolean;
  enableHiding?: boolean;
}

interface DataTableState {
  sorting: { id: string; desc: boolean }[];
  columnFilters: { id: string; value: unknown }[];
  columnVisibility: Record<string, boolean>;
  rowSelection: Record<string, boolean>;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
}

export function DataTable<TData>({
  columns,
  data,
  enableRowSelection = false,
  onRowSelectionChange,
}: DataTableProps<TData>) {
  const [state, setState] = React.useState<DataTableState>({
    sorting: [],
    columnFilters: [],
    columnVisibility: {},
    rowSelection: {},
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  });

  const [globalFilter, setGlobalFilter] = React.useState("");

  // Filter data based on global filter
  const filteredData = React.useMemo(() => {
    if (!globalFilter) return data;

    return data.filter((row: TData) =>
      Object.values(row as Record<string, unknown>).some((value) =>
        String(value).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, globalFilter]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (state.sorting.length === 0) return filteredData;

    return [...filteredData].sort((a, b) => {
      for (const sort of state.sorting) {
        const column = columns.find(
          (col: Column<TData>) =>
            col.id === sort.id || col.accessorKey === sort.id
        );
        if (!column?.accessorKey) continue;

        const aValue = (a as Record<string, unknown>)[
          column.accessorKey as string
        ];
        const bValue = (b as Record<string, unknown>)[
          column.accessorKey as string
        ];

        if (aValue === bValue) continue;

        const comparison = String(aValue) < String(bValue) ? -1 : 1;
        return sort.desc ? -comparison : comparison;
      }
      return 0;
    });
  }, [filteredData, state.sorting, columns]);

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const start = state.pagination.pageIndex * state.pagination.pageSize;
    const end = start + state.pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, state.pagination]);

  const handleSort = (columnId: string) => {
    setState((prev) => ({
      ...prev,
      sorting: [
        {
          id: columnId,
          desc:
            prev.sorting[0]?.id === columnId ? !prev.sorting[0]?.desc : false,
        },
      ],
    }));
  };

  const handlePageChange = (pageIndex: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { ...prev.pagination, pageIndex },
    }));
  };

  const pageCount = Math.ceil(sortedData.length / state.pagination.pageSize);
  const canPreviousPage = state.pagination.pageIndex > 0;
  const canNextPage = state.pagination.pageIndex < pageCount - 1;

  // Handle row selection changes
  React.useEffect(() => {
    if (onRowSelectionChange && enableRowSelection) {
      const selectedRows = Object.keys(state.rowSelection)
        .filter((key) => state.rowSelection[key])
        .map((index) => sortedData[parseInt(index)])
        .filter(Boolean);
      onRowSelectionChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.rowSelection, sortedData, enableRowSelection]);

  // Toggle all rows selection
  const toggleAllRows = (checked: boolean) => {
    if (checked) {
      const newSelection: Record<string, boolean> = {};
      paginatedData.forEach((_, index) => {
        newSelection[index.toString()] = true;
      });
      setState((prev) => ({ ...prev, rowSelection: newSelection }));
    } else {
      setState((prev) => ({ ...prev, rowSelection: {} }));
    }
  };

  // Toggle single row selection
  const toggleRowSelection = (rowIndex: number) => {
    setState((prev) => ({
      ...prev,
      rowSelection: {
        ...prev.rowSelection,
        [rowIndex]: !prev.rowSelection[rowIndex],
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Szukaj..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              Kolumny
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {columns
              .filter((column: Column<TData>) => column.enableHiding !== false)
              .map((column: Column<TData>) => {
                const columnId = column.id || String(column.accessorKey);
                return (
                  <DropdownMenuCheckboxItem
                    key={columnId}
                    className="capitalize"
                    checked={state.columnVisibility[columnId] !== false}
                    onCheckedChange={(value) =>
                      setState((prev) => ({
                        ...prev,
                        columnVisibility: {
                          ...prev.columnVisibility,
                          [columnId]: !!value,
                        },
                      }))
                    }
                  >
                    {column.header as string}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {enableRowSelection && (
                <TableHead className="w-[50px] text-center">
                  <div className="flex items-center justify-center">
                    <Checkbox
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every(
                          (_, index) => state.rowSelection[index.toString()]
                        )
                      }
                      onCheckedChange={(checked) => toggleAllRows(!!checked)}
                      aria-label="Wybierz wszystkie"
                    />
                  </div>
                </TableHead>
              )}
              {columns.map((column: Column<TData>) => {
                const columnId = column.id || String(column.accessorKey);
                const isVisible = state.columnVisibility[columnId] !== false;

                if (!isVisible) return null;

                return (
                  <TableHead key={columnId}>
                    {column.enableSorting !== false ? (
                      <Button
                        variant="ghost"
                        onClick={() => handleSort(columnId)}
                        className="h-8 data-[state=open]:bg-accent"
                      >
                        <span>{column.header as string}</span>
                        <ArrowUpDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      (column.header as string)
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData?.length ? (
              paginatedData.map((row: TData, index: number) => (
                <TableRow key={index}>
                  {enableRowSelection && (
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={!!state.rowSelection[index.toString()]}
                          onCheckedChange={() => toggleRowSelection(index)}
                          aria-label={`Wybierz wiersz ${index + 1}`}
                        />
                      </div>
                    </TableCell>
                  )}
                  {columns.map((column: Column<TData>) => {
                    const columnId = column.id || String(column.accessorKey);
                    const isVisible =
                      state.columnVisibility[columnId] !== false;

                    if (!isVisible) return null;

                    return (
                      <TableCell key={columnId}>
                        {column.cell ? (
                          <column.cell row={{ original: row }} />
                        ) : column.accessorKey ? (
                          String(
                            (row as Record<string, unknown>)[
                              column.accessorKey as string
                            ]
                          )
                        ) : (
                          ""
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableRowSelection ? 1 : 0)}
                  className="h-24 text-center"
                >
                  Brak wyników.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {enableRowSelection ? (
            <>
              {
                Object.keys(state.rowSelection).filter(
                  (key) => state.rowSelection[key]
                ).length
              }{" "}
              z {sortedData.length} wierszy wybranych.
            </>
          ) : (
            <>Razem {sortedData.length} wierszy.</>
          )}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Wierszy na stronie</p>
            <select
              value={state.pagination.pageSize}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  pagination: {
                    ...prev.pagination,
                    pageSize: Number(e.target.value),
                    pageIndex: 0,
                  },
                }))
              }
              className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Strona {state.pagination.pageIndex + 1} z {pageCount}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(0)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Idź do pierwszej strony</span>
              <ChevronsLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(state.pagination.pageIndex - 1)}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Idź do poprzedniej strony</span>
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => handlePageChange(state.pagination.pageIndex + 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Idź do następnej strony</span>
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => handlePageChange(pageCount - 1)}
              disabled={!canNextPage}
            >
              <span className="sr-only">Idź do ostatniej strony</span>
              <ChevronsRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
