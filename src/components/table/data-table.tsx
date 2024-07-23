"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  filter: string | null
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })
  return (
    <>
      {filter && (
        <Input
          placeholder={`Filter ${filter}...`}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
          className="max-w-[300px] mx-auto sm:max-w-md md:mx-0 md:max-w-sm mb-2"
        />
      )}
      <div className="rounded-md border mx-auto max-w-[300px] sm:max-w-md md:max-w-none text-center mb-2">
        <Table>
          <TableHeader className="text-zinc-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-zinc-200 text-center py-2">
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
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  className={`${index%2 === 0 ? "bg-[#323232] rounded-full" : "" } hover:bg-#323232 `}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="max-w-[300px] sm:max-w-md md:max-w-none mx-auto flex flex-wrap justify-between items-center">
        <div className="flex-1 text-sm text-zinc-300">
          showing{" "}
          {table.getRowModel().rows.length} of{" "}
          {table.getCoreRowModel().rows.length} data
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={()=>table.previousPage()} 
            variant={"default"} 
            className="text-zinc-200 bg-slate-800 shadow-lg"
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button 
            onClick={()=>table.nextPage()} 
            variant={"default"} 
            className="text-zinc-200 bg-slate-800 shadow-lg"
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </>
    )
} 
