"use client";
import { useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import {
  useWorkspaceInvites,
  type UseWorkspaceInvitesData,
} from "@/features/workspaces/api/use-workspace-invites";
import { usePaginationSearchParams } from "@/hooks/use-pagination-search-params";
import { Loader } from "@/components/shared/loader";
import { Pagination } from "@/components/shared/pagination";
import { cn } from "@/lib/utils";
import { WorkspaceRoles } from "@/server/db/schemas";
import { InviteTableActions } from "./invite-table-actions";

export type InvitesTableProps = {
  workspaceId: string;
  allowMemberInviteManagement: boolean;
  role: WorkspaceRoles;
};

export function InvitesTable({
  workspaceId,
  allowMemberInviteManagement,
  role,
}: InvitesTableProps) {
  const { page, ...props } = usePaginationSearchParams();

  const columns = useMemo<
    ColumnDef<UseWorkspaceInvitesData["invites"][0]>[]
  >(() => {
    const actions: ColumnDef<UseWorkspaceInvitesData["invites"][0]>[] =
      allowMemberInviteManagement || role !== WorkspaceRoles.user
        ? [
            {
              id: "actions",
              header: () => (
                <div className="ml-auto w-3">
                  <span className="sr-only">Actions</span>
                </div>
              ),
              cell: ({ row }) => (
                <InviteTableActions
                  page={page}
                  workspaceId={workspaceId}
                  userId={row.original.id}
                  deletedAt={row.original.deletedAt}
                  acceptedAt={row.original.acceptedAt}
                />
              ),
            },
          ]
        : [];

    return [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "createdAt",
        header: "Requested On",
      },
      ...actions,
    ];
  }, [allowMemberInviteManagement, page, role, workspaceId]);

  const { data, isLoading, isFetching } = useWorkspaceInvites({
    id: workspaceId,
    page,
    options: { staleTime: 1000 * 60 },
  });

  const table = useReactTable({
    data: data?.invites ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    keepPinnedRows: true,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: data ? data.currentPage - 1 : page - 1,
        pageSize: data ? data.invites.length : 0,
      },
    },
    pageCount: data ? data.totalPages : -1,
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

      {data && data.totalPages > 1 && (
        <Pagination
          totalPages={data.totalPages}
          currentPage={data.currentPage}
          canGetNextPage={!table.getCanNextPage()}
          canGetPrevPage={!table.getCanPreviousPage()}
          {...props}
        />
      )}
    </div>
  );
}
