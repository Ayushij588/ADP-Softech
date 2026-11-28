"use client";

import { useMemo, useRef, useState } from "react";
import { UserCreationDialog } from "@/components/super-admin/user-creation-dialog";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { superAdminUsers } from "@/constants/super-admin-content";
import {
  userRoles,
  userStatuses,
  type UserCreationValues,
} from "@/lib/admin-form-schemas";

type UserRecord = UserCreationValues & {
  id: string;
  lastActive: string;
};

const pageSize = 5;

const statusTones: Record<string, "success" | "warning" | "neutral" | "danger"> = {
  Active: "success",
  Invited: "warning",
  Suspended: "danger",
  Deactivated: "neutral",
};

const baseUserColumns: DataTableColumn<UserRecord>[] = [
  {
    key: "name",
    header: "Name",
    render: (user) => (
      <div>
        <span className="whitespace-nowrap font-semibold text-slate-900">
          {user.name}
        </span>
        <p className="text-[11px] text-slate-500">{user.email}</p>
      </div>
    ),
  },
  { key: "role", header: "Role", render: (user) => user.role },
  {
    key: "assignedTeam",
    header: "Assigned team",
    render: (user) => user.assignedTeam,
  },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <StatusBadge
        label={user.status}
        tone={statusTones[user.status] ?? "neutral"}
      />
    ),
  },
  {
    key: "lastActive",
    header: "Last active",
    render: (user) => (
      <span className="whitespace-nowrap">{user.lastActive}</span>
    ),
  },
];

export function UsersManagementView() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRecord[]>(() =>
    superAdminUsers.map((user) => ({
      ...user,
      role: user.role as UserCreationValues["role"],
      status: user.status as UserCreationValues["status"],
    })),
  );
  const [dialogUser, setDialogUser] = useState<UserRecord | null | undefined>(
    undefined,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const nextUserNumber = useRef(1006);

  function saveUser(values: UserCreationValues) {
    if (dialogUser) {
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === dialogUser.id
            ? { ...user, ...values, lastActive: "Updated in demo" }
            : user,
        ),
      );
      toast(`${values.name}'s account updated in local demo state.`, "success");
    } else {
      const id = `USR-${String(nextUserNumber.current).padStart(4, "0")}`;
      nextUserNumber.current += 1;
      setUsers((currentUsers) => [
        {
          id,
          ...values,
          lastActive:
            values.status === "Invited"
              ? "Invitation not sent · demo only"
              : "Created in demo",
        },
        ...currentUsers,
      ]);
      toast(`${values.name} added to local demo directory.`, "success");
    }
    setDialogUser(undefined);
    setCurrentPage(1);
  }

  function toggleUserStatus(userId: string) {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Suspended" || user.status === "Deactivated"
                  ? "Active"
                  : "Deactivated",
              lastActive: "Status updated in demo",
            }
          : user,
      ),
    );
    toast("Account status updated in local demo.", "info");
  }

  const filteredUsers = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term ||
        [u.name, u.email, u.role, u.assignedTeam].some((v) =>
          v.toLowerCase().includes(term),
        );
      const matchesRole = !roleFilter || u.role === roleFilter;
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchQuery, statusFilter, users]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const userColumns: DataTableColumn<UserRecord>[] = [
    ...baseUserColumns,
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex justify-end gap-2">
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            onClick={() => setDialogUser(user)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            onClick={() => toggleUserStatus(user.id)}
            type="button"
          >
            {user.status === "Suspended" || user.status === "Deactivated"
              ? "Activate"
              : "Deactivate"}
          </button>
        </div>
      ),
    },
  ];

  const selectClass =
    "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Create, edit, assign roles/teams, and deactivate recruiter or admin accounts."
        title="Users Management"
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Platform users
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Accounts and access details are illustrative only.
            </p>
          </div>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => setDialogUser(null)}
            type="button"
          >
            Create user
          </button>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            aria-label="Search users by name, email, role or team"
            className={`${selectClass} sm:col-span-2`}
            onChange={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, email, role or team…"
            type="search"
            value={searchQuery}
          />
          <select
            aria-label="Filter by role"
            className={selectClass}
            onChange={(e) => {
              setRoleFilter(e.currentTarget.value);
              setCurrentPage(1);
            }}
            value={roleFilter}
          >
            <option value="">All roles</option>
            {userRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by account status"
            className={selectClass}
            onChange={(e) => {
              setStatusFilter(e.currentTarget.value);
              setCurrentPage(1);
            }}
            value={statusFilter}
          >
            <option value="">All statuses</option>
            {userStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <DataTable
          caption="Platform users"
          columns={userColumns}
          emptyDescription="No users match the current search or filter criteria."
          emptyTitle="No users found"
          getRowKey={(user) => user.id}
          rows={visibleUsers}
        />

        {totalPages > 1 && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <Pagination
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </section>
      {dialogUser !== undefined && (
        <UserCreationDialog
          key={dialogUser?.id ?? "new-user"}
          onClose={() => setDialogUser(undefined)}
          onSave={saveUser}
          user={dialogUser ?? undefined}
        />
      )}
    </main>
  );
}
