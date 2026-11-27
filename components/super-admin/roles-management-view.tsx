"use client";

import { useRef, useState } from "react";
import { RoleCreationDialog } from "@/components/super-admin/role-creation-dialog";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
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

const baseRoleColumns: DataTableColumn<RoleRecord>[] = [
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
    render: (role) => (
      <span className="block max-w-md text-xs leading-5 text-slate-600">
        {role.permissions}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (role) => (
      <StatusBadge
        label={role.status}
        tone={role.status === "Active" ? "success" : "neutral"}
      />
    ),
  },
];

export function RolesManagementView() {
  const { toast } = useToast();
  const [roles, setRoles] = useState<RoleRecord[]>(() =>
    platformRoles.map((role) => ({ ...role })),
  );
  const [dialogRole, setDialogRole] = useState<RoleRecord | null | undefined>(
    undefined,
  );
  const nextRoleNumber = useRef(6);

  function saveRole(values: RoleCreationValues) {
    if (dialogRole) {
      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role.id === dialogRole.id
            ? {
                ...role,
                name: values.name,
                scope: values.description,
                permissions: values.permissions.join(", "),
              }
            : role,
        ),
      );
      toast(`${values.name} permissions updated in local demo state.`, "success");
    } else {
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
      toast(`${values.name} added to local demo roles.`, "success");
    }
    setDialogRole(undefined);
  }

  function toggleRoleStatus(roleId: string) {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === roleId
          ? { ...role, status: role.status === "Active" ? "Inactive" : "Active" }
          : role,
      ),
    );
    toast("Role status updated in local demo.", "info");
  }

  const roleColumns: DataTableColumn<RoleRecord>[] = [
    ...baseRoleColumns,
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (role) => (
        <div className="flex justify-end gap-2">
          <button
            className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
            onClick={() => setDialogRole(role)}
            type="button"
          >
            Edit permissions
          </button>
          <button
            className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
            onClick={() => toggleRoleStatus(role.id)}
            type="button"
          >
            {role.status === "Active" ? "Deactivate" : "Activate"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Configure RBAC roles and assign granular permissions across Recruitment Admin and Super Admin capabilities."
        title="Roles & Permissions"
      />
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950">
              Platform roles
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Backend API permission enforcement is simulated in this frontend preview.
            </p>
          </div>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            onClick={() => setDialogRole(null)}
            type="button"
          >
            Create role
          </button>
        </div>
        <DataTable
          caption="Roles and permissions"
          columns={roleColumns}
          getRowKey={(role) => role.id}
          rows={roles}
        />
      </section>
      {dialogRole !== undefined && (
        <RoleCreationDialog
          key={dialogRole?.id ?? "new-role"}
          onClose={() => setDialogRole(undefined)}
          onSave={saveRole}
          role={dialogRole ?? undefined}
        />
      )}
    </main>
  );
}
