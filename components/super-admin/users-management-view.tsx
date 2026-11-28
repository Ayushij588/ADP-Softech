"use client";

import { useCallback, useMemo, useState, type FormEvent } from "react";
import { UserCreationDialog } from "@/components/super-admin/user-creation-dialog";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Pagination } from "@/components/ui/pagination";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import { useAsyncData } from "@/hooks/use-async-data";
import { useAuth } from "@/hooks/use-auth";
import {
  createRecruiter,
  getRecruiters,
  resetRecruiterPassword,
  updateRecruiter,
  updateRecruiterStatus,
} from "@/services/users.service";
import type { ApiUser } from "@/types/api";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastActive: string;
};

const pageSize = 5;

function mapApiUser(user: ApiUser): UserRow {
  const id = user._id ?? user.id ?? user.email;
  const lastActive = user.lastLogin
    ? new Date(user.lastLogin).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Never signed in";
  return {
    id,
    name: user.name,
    email: user.email,
    role: user.role === "super_admin" ? "Super Admin" : "Recruiter",
    status: user.status === "inactive" ? "inactive" : "active",
    lastActive,
  };
}

export function UsersManagementView() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth("super-admin");
  const fetcher = useCallback(async () => {
    const users = await getRecruiters();
    return users.map(mapApiUser);
  }, []);

  const {
    data: fetchedUsers,
    setData: setFetchedUsers,
    isLoading,
    error,
    refetch,
  } = useAsyncData<UserRow[]>(fetcher, isAuthenticated);

  const users = useMemo(() => fetchedUsers ?? [], [fetchedUsers]);
  const [dialogUser, setDialogUser] = useState<UserRow | null | undefined>(
    undefined,
  );
  const [resetTarget, setResetTarget] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  async function handleSaveUser(values: {
    name: string;
    email: string;
    password?: string;
  }) {
    try {
      if (dialogUser) {
        const updated = await updateRecruiter(dialogUser.id, {
          name: values.name,
          email: values.email,
        });
        const mapped = mapApiUser(updated);
        setFetchedUsers((current) =>
          (current ?? []).map((u) => (u.id === dialogUser.id ? mapped : u)),
        );
        toast(`${mapped.name} updated.`, "success");
      } else {
        const created = await createRecruiter({
          name: values.name,
          email: values.email,
          password: values.password ?? "",
        });
        const mapped = mapApiUser(created);
        setFetchedUsers((current) => [mapped, ...(current ?? [])]);
        toast(`Recruiter ${mapped.name} created.`, "success");
      }
      setDialogUser(undefined);
      setCurrentPage(1);
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to save recruiter.",
        "error",
      );
    }
  }

  async function handleToggleStatus(user: UserRow) {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateRecruiterStatus(user.id, nextStatus);
      const mapped = mapApiUser(updated);
      setFetchedUsers((current) =>
        (current ?? []).map((u) => (u.id === user.id ? mapped : u)),
      );
      toast(`${user.name} marked ${nextStatus}.`, "info");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to update status.",
        "error",
      );
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetTarget || !newPassword.trim()) return;
    setIsResetting(true);
    try {
      await resetRecruiterPassword(resetTarget.id, newPassword);
      toast(`Password reset for ${resetTarget.name}.`, "success");
      setResetTarget(null);
      setNewPassword("");
    } catch (err) {
      toast(
        err instanceof Error ? err.message : "Failed to reset password.",
        "error",
      );
    } finally {
      setIsResetting(false);
    }
  }

  const filteredUsers = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !term ||
        [u.name, u.email, u.role].some((v) => v.toLowerCase().includes(term));
      const matchesStatus = !statusFilter || u.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter, users]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const userColumns: DataTableColumn<UserRow>[] = [
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
      key: "status",
      header: "Status",
      render: (user) => (
        <StatusBadge
          label={user.status === "active" ? "Active" : "Inactive"}
          tone={user.status === "active" ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "lastActive",
      header: "Last login",
      render: (user) => (
        <span className="whitespace-nowrap">{user.lastActive}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (user) => (
        <div className="flex flex-wrap justify-end gap-1.5">
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            onClick={() => setDialogUser(user)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            onClick={() => {
              setResetTarget(user);
              setNewPassword("");
            }}
            type="button"
          >
            Reset password
          </button>
          <button
            className="rounded-md px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            onClick={() => void handleToggleStatus(user)}
            type="button"
          >
            {user.status === "active" ? "Deactivate" : "Activate"}
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
        description="Create, edit, reset passwords, and activate or deactivate recruiter accounts."
        title="Users Management"
      />

      {!isAuthenticated && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Sign in as a Super Admin on <strong>/super-admin/login</strong> to load and manage live recruiter accounts.
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <span>{error}</span>
          <button
            className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100"
            onClick={() => void refetch()}
            type="button"
          >
            Retry
          </button>
        </div>
      )}

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Recruiter accounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Live accounts from <span className="font-mono text-xs">/api/users/recruiters</span>.
            </p>
          </div>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            disabled={!isAuthenticated}
            onClick={() => setDialogUser(null)}
            type="button"
          >
            Create recruiter
          </button>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input
            aria-label="Search users by name or email"
            className={`${selectClass} sm:col-span-2`}
            onChange={(e) => {
              setSearchQuery(e.currentTarget.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name or email…"
            type="search"
            value={searchQuery}
          />
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <DataTable
          caption="Platform users"
          columns={userColumns}
          emptyDescription="No recruiter accounts match the current filters."
          emptyTitle="No users found"
          getRowKey={(user) => user.id}
          isLoading={isLoading}
          loadingLabel="Loading recruiters..."
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
          onSave={handleSaveUser}
          user={dialogUser ?? undefined}
        />
      )}

      {resetTarget && (
        <FormDialog
          description={`Set a new password for ${resetTarget.name} (${resetTarget.email}).`}
          onClose={() => setResetTarget(null)}
          title="Reset recruiter password"
        >
          <form className="space-y-4 px-5 py-6 sm:px-7" onSubmit={handleResetPassword}>
            <label className="block text-sm font-medium text-slate-700">
              New password (min 8 chars, upper, lower, number)
              <input
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                minLength={8}
                onChange={(e) => setNewPassword(e.currentTarget.value)}
                placeholder="StrongPass1"
                required
                type="password"
                value={newPassword}
              />
            </label>
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              <button
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setResetTarget(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                disabled={isResetting}
                type="submit"
              >
                {isResetting ? "Resetting..." : "Reset password"}
              </button>
            </div>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
