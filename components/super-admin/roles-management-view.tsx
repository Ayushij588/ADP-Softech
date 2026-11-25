"use client";

import { useRef, useState } from "react";
import { RoleCreationDialog } from "@/components/super-admin/role-creation-dialog";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { platformRoles } from "@/constants/super-admin-content";
import type { RoleCreationValues } from "@/lib/admin-form-schemas";

type RoleRecord = {
  id: string;
  name: string;
  users: string;
  scope: string;
  permissions: string;
  status: string;
};

const roleColumns: DataTableColumn<RoleRecord>[] = [
  {
    key: "name",
    header: "Role",
    render: (role) => (
      <span className="whitespace-nowrap font-semibold text-slate-900">
        {role.name}
      </span>
    ),
  },
  { key: "users", header: "Assigned users", render: (role) => role.users },
  { key: "scope", header: "Access scope", render: (role) => role.scope },
  {
    key: "permissions",
    header: "Permission summary",
    render: (role) => role.permissions,
  },
  {
    key: "status",
    header: "Status",
    render: (role) => <StatusBadge label={role.status} tone="success" />,
  },
];

export function RolesManagementView() {
  const [roles, setRoles] = useState<RoleRecord[]>(() =>
    platformRoles.map((role) => ({ ...role })),
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const nextRoleNumber = useRef(5);

  function createRole(values: RoleCreationValues) {
    const id = `ROLE-${String(nextRoleNumber.current).padStart(2, "0")}`;
    nextRoleNumber.current += 1;
    setRoles((currentRoles) => [
      {
        id,
        name: values.name,
        users: "0 users",
        scope: values.description,
        permissions: values.permissions.join(", "),
        status: "Active",
      },
      ...currentRoles,
    ]);
    setIsDialogOpen(false);
    setFeedback(
      `${values.name} was added to the temporary demo list. No platform permissions were changed.`,
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Review sample role definitions and create a local demo role."
        title="Roles & Permissions"
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Platform roles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Permission summaries are examples and are not enforced by this UI.
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
            Create role
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
          caption="Roles and permissions"
          columns={roleColumns}
          getRowKey={(role) => role.id}
          rows={roles}
        />
      </section>
      {isDialogOpen && (
        <RoleCreationDialog
          onClose={() => setIsDialogOpen(false)}
          onCreate={createRole}
        />
      )}
    </main>
  );
}
