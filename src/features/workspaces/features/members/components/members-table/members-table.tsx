"use client";
import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { WorkspaceRoles } from "@/server/db/schemas";
import { useMembers, type UseMembersData } from "../../api/use-members";
import { Loader } from "@/components/shared/loader";
import { cn } from "@/lib/utils";

export type MembersTableProps = {
  workspaceId: string;
  role: WorkspaceRoles;
};

export function MembersTable({ workspaceId }: MembersTableProps) {
  const columns = useMemo<ColumnDef<UseMembersData["members"][0]>[]>(() => {
    return [
      {
        accessorKey: "name",
        header: "name",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "createdAt",
        header: "Joined",
        cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
      },
    ];
  }, []);

  const { data, isLoading, isFetching } = useMembers(workspaceId);

  const table = useReactTable({
    data: data?.members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className={cn(header)}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <Loader className="mx-auto size-6" />
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex h-12 w-full items-center justify-center">
        {!isLoading && isFetching && <Loader />}
      </div>
    </div>
  );
}
