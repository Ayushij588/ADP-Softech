"use client";

import { useRef, useState } from "react";
import { UserCreationDialog } from "@/components/super-admin/user-creation-dialog";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { superAdminUsers } from "@/constants/super-admin-content";
import type { UserCreationValues } from "@/lib/admin-form-schemas";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
};

const userColumns: DataTableColumn<UserRecord>[] = [
  {
    key: "name",
    header: "Name",
    render: (user) => (
      <span className="whitespace-nowrap font-semibold text-slate-900">
        {user.name}
      </span>
    ),
  },
  { key: "email", header: "Email", render: (user) => user.email },
  { key: "role", header: "Role", render: (user) => user.role },
  {
    key: "status",
    header: "Status",
    render: (user) => (
      <StatusBadge
        label={user.status}
        tone={
          user.status === "Active"
            ? "success"
            : user.status === "Invited"
              ? "warning"
              : "neutral"
        }
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
  const [users, setUsers] = useState<UserRecord[]>(() =>
    superAdminUsers.map((user) => ({ ...user })),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const nextUserNumber = useRef(1006);

  function createUser(values: UserCreationValues) {
    const id = `USR-${String(nextUserNumber.current).padStart(4, "0")}`;
    nextUserNumber.current += 1;
    setUsers((currentUsers) => [
      {
        id,
        ...values,
        status: "Invited",
        lastActive: "Invitation not sent · demo only",
      },
      ...currentUsers,
    ]);
    setIsDialogOpen(false);
    setFeedback(
      `${values.name} was added to the temporary demo list. No invitation was sent.`,
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review sample platform accounts and create a local demo user record."
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
            onClick={() => {
              setFeedback("");
              setIsDialogOpen(true);
            }}
            type="button"
          >
            Create user
          </button>
        </div>
        {feedback && (
          <p
            className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900"
            role="status"
          >
            {feedback}
          </p>
        )}
        <DataTable
          caption="Platform users"
          columns={userColumns}
          getRowKey={(user) => user.id}
          rows={users}
        />
      </section>
      {isDialogOpen && (
        <UserCreationDialog
          onClose={() => setIsDialogOpen(false)}
          onCreate={createUser}
        />
      )}
    </main>
  );
}
