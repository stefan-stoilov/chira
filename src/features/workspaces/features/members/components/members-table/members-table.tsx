"use client";
import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
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

import { WorkspaceRoles } from "@/server/db/schemas";
import { useMembers, type UseMembersData } from "../../api/use-members";
import { Loader } from "@/components/shared/loader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { MemberAvatar } from "../member-avatar";
import { MembersTableRowActions } from "./members-table-row-actions";

export type MembersTableProps = {
  currentUserId: string;
  workspaceId: string;
  role: WorkspaceRoles;
};

type Cols = ColumnDef<UseMembersData["members"][0]>[];

export function MembersTable({
  workspaceId,
  role,
  currentUserId,
}: MembersTableProps) {
  const { data, isLoading, isFetching, isError } = useMembers(workspaceId);

  const [sorting, setSorting] = useState<SortingState>();

  const hasNoData =
    typeof data?.members?.length === "undefined" || data.members.length == 0;
  const shouldDisableFilters = isLoading || hasNoData;

  const columns = useMemo<Cols>(() => {
    const actions: Cols =
      role == WorkspaceRoles.owner || role == WorkspaceRoles.admin
        ? [
            {
              id: "actions",
              header: () => (
                <div className="ml-auto w-3">
                  <span className="sr-only">Actions</span>
                </div>
              ),
              cell: ({ row }) => (
                <MembersTableRowActions
                  workspaceId={workspaceId}
                  userId={row.original.id}
                  name={row.original.name}
                  memberRole={row.original.role}
                  currentUserRole={role}
                  currentUserId={currentUserId}
                />
              ),
            },
          ]
        : [];

    return [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            disabled={shouldDisableFilters}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <MemberAvatar name={row.original.name} />
            <span>{row.original.name}</span>
          </div>
        ),
      },
      {
        id: "role",
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) =>
          row.original.role.charAt(0).toUpperCase() +
          row.original.role.slice(1),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <Button
            variant="ghost"
            disabled={shouldDisableFilters}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Joined <ArrowUpDown className="ml-2 h-4 w-4" />{" "}
          </Button>
        ),
        cell: ({ row }) => new Date(row.original.createdAt).toDateString(),
      },
      ...actions,
    ];
  }, [shouldDisableFilters, role, workspaceId, currentUserId]);

  const table = useReactTable({
    data: data?.members ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // @ts-expect-error Typescript for tanstack table is not happy, however, it works properly
    onSortingChange: setSorting,
    state: {
      sorting,
    },
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
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <Loader className="mx-auto size-6" />
              </TableCell>
            </TableRow>
          )}

          {isError && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                An error occurred trying to get members. Please try again later.
              </TableCell>
            </TableRow>
          )}

          {!isLoading && !isError && hasNoData && (
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
