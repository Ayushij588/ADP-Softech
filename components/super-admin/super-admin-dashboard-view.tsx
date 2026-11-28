"use client";

import Link from "next/link";
import { useCallback, useState, type FormEvent } from "react";
import { SuperAdminPageHeader } from "@/components/super-admin/page-header";
import { DashboardCard } from "@/components/ui/dashboard-card";
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import { useToast } from "@/components/ui/toast";
import {
  employerInquiries,
  recentPlatformActivity,
} from "@/constants/super-admin-content";
import { useAsyncData } from "@/hooks/use-async-data";
import { useAuth } from "@/hooks/use-auth";
import {
  createClient,
  getClients,
  updateClientStatus,
} from "@/services/clients.service";
import { getDashboard } from "@/services/dashboard.service";
import { getRecruiters } from "@/services/users.service";
import type { ApiClient, ApiDashboardData, ApiUser } from "@/types/api";

type ActivityRow = (typeof recentPlatformActivity)[number];
type InquiryRow = (typeof employerInquiries)[number];

type SuperAdminBundle = {
  dashboard: ApiDashboardData;
  recruiters: ApiUser[];
  clients: ApiClient[];
};

const activityColumns: DataTableColumn<ActivityRow>[] = [
  { key: "actor", header: "User", render: (a) => <span className="font-medium text-slate-900">{a.actor}</span> },
  { key: "action", header: "Activity", render: (a) => a.action },
  { key: "target", header: "Item", render: (a) => a.target },
  { key: "time", header: "Time", render: (a) => <span className="whitespace-nowrap">{a.time}</span> },
  {
    key: "status",
    header: "Result",
    render: (a) => (
      <StatusBadge label={a.status} tone={a.status === "Automated" ? "neutral" : "success"} />
    ),
  },
];

const inquiryColumns: DataTableColumn<InquiryRow>[] = [
  { key: "id", header: "Inquiry", render: (inq) => <span className="font-mono text-xs text-blue-700">{inq.id}</span> },
  {
    key: "companyName",
    header: "Client & Contact",
    render: (inq) => (
      <div>
        <span className="font-semibold text-slate-900">{inq.companyName}</span>
        <p className="text-[11px] text-slate-500">{inq.contactPerson} · {inq.email}</p>
      </div>
    ),
  },
  {
    key: "roleNeeded",
    header: "Requirement",
    render: (inq) => (
      <div>
        <span className="font-medium text-slate-800">{inq.roleNeeded}</span>
        <p className="text-[11px] text-slate-500">{inq.positions} positions · {inq.engagementType} · {inq.workMode}</p>
      </div>
    ),
  },
  { key: "receivedDate", header: "Received", render: (inq) => <span className="whitespace-nowrap">{inq.receivedDate}</span> },
  {
    key: "status",
    header: "Status",
    render: (inq) => (
      <StatusBadge
        label={inq.status}
        tone={inq.status === "Converted to JD" ? "success" : inq.status === "New" ? "info" : "warning"}
      />
    ),
  },
];

export function SuperAdminDashboardView() {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth("super-admin");
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [isCreatingClient, setIsCreatingClient] = useState(false);

  const fetcher = useCallback(async (): Promise<SuperAdminBundle> => {
    const [dashboard, recruiters, clients] = await Promise.all([
      getDashboard(),
      getRecruiters(),
      getClients(),
    ]);
    return { dashboard, recruiters, clients };
  }, []);

  const { data, setData, isLoading, error, refetch } =
    useAsyncData<SuperAdminBundle>(fetcher, isAuthenticated);

  const dashboard = data?.dashboard;
  const recruiters = data?.recruiters ?? [];
  const clients = data?.clients ?? [];

  const metrics = [
    { title: "Total Recruiters", value: String(recruiters.length), description: "Recruiter accounts in /api/users" },
    { title: "Active Jobs", value: String(dashboard?.activeJDs ?? 0), description: "Open roles in /api/dashboard" },
    { title: "Applications", value: String(dashboard?.newApplications ?? 0), description: "Applications in current scope" },
    { title: "Total Candidates", value: String(dashboard?.totalCandidates ?? 0), description: "Canonical candidate records" },
    { title: "Submitted to Client", value: String(dashboard?.submittedToClient ?? 0), description: "Client-shared submissions" },
    { title: "Client Accounts", value: String(clients.length), description: "Organizations in /api/clients" },
  ];

  async function handleCreateClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!companyName.trim() || !contactPerson.trim() || !contactEmail.trim()) return;
    setIsCreatingClient(true);
    try {
      const created = await createClient({
        companyName: companyName.trim(),
        contactPerson: contactPerson.trim(),
        contactEmail: contactEmail.trim(),
        industry: industry.trim() || undefined,
      });
      setData((current) =>
        current
          ? { ...current, clients: [created, ...current.clients] }
          : current,
      );
      setIsClientDialogOpen(false);
      setCompanyName("");
      setContactPerson("");
      setContactEmail("");
      setIndustry("");
      toast(`Client ${created.companyName} created.`, "success");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create client.", "error");
    } finally {
      setIsCreatingClient(false);
    }
  }

  async function handleToggleClientStatus(client: ApiClient) {
    const nextStatus = client.status === "active" ? "inactive" : "active";
    try {
      const updated = await updateClientStatus(client._id, nextStatus);
      setData((current) =>
        current
          ? {
              ...current,
              clients: current.clients.map((item) =>
                item._id === client._id ? updated : item,
              ),
            }
          : current,
      );
      toast(`${client.companyName} marked ${nextStatus}.`, "info");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update client status.", "error");
    }
  }

  const clientColumns: DataTableColumn<ApiClient>[] = [
    {
      key: "companyName",
      header: "Organization",
      render: (client) => (
        <div>
          <span className="font-semibold text-slate-900">{client.companyName}</span>
          <p className="text-[11px] text-slate-500">{client.industry || "Technology"}</p>
        </div>
      ),
    },
    {
      key: "contactPerson",
      header: "Primary Contact",
      render: (client) => (
        <div>
          <span className="font-medium text-slate-800">{client.contactPerson}</span>
          <p className="text-[11px] text-slate-500">{client.contactEmail}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (client) => (
        <StatusBadge
          label={client.status === "active" ? "Active" : "Inactive"}
          tone={client.status === "active" ? "success" : "neutral"}
        />
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (client) => (
        <button
          className="rounded-md px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
          onClick={() => void handleToggleClientStatus(client)}
          type="button"
        >
          {client.status === "active" ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
      <SuperAdminPageHeader
        description="Monitor live recruitment metrics, client accounts, recruiter access, and system activity."
        title="Super Admin Dashboard"
      />

      {!isAuthenticated && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Sign in on <Link className="font-semibold underline" href="/super-admin/login">/super-admin/login</Link> to load live metrics and client accounts.
        </div>
      )}

      {error && (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          <span>{error}</span>
          <button className="rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-100" onClick={() => void refetch()} type="button">
            Retry
          </button>
        </div>
      )}

      <section aria-label="Platform metrics" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <DashboardCard
            description={metric.description}
            key={metric.title}
            title={metric.title}
            value={isLoading ? "…" : metric.value}
          />
        ))}
      </section>

      <section aria-labelledby="client-accounts-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-950" id="client-accounts-heading">
              Client accounts
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Live client directory from <span className="font-mono text-xs">/api/clients</span>.
            </p>
          </div>
          <button
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            disabled={!isAuthenticated}
            onClick={() => setIsClientDialogOpen(true)}
            type="button"
          >
            + Add client
          </button>
        </div>
        <DataTable
          caption="Client accounts"
          columns={clientColumns}
          emptyDescription="No client records found in the backend."
          emptyTitle="No clients found"
          getRowKey={(client) => client._id}
          isLoading={isLoading}
          loadingLabel="Loading clients..."
          rows={clients}
        />
      </section>

      <section aria-labelledby="recent-activity-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950" id="recent-activity-heading">
            Recent system activity
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Audit stream preview (pending backend audit endpoint)
          </p>
        </div>
        <DataTable
          caption="Recent platform activity"
          columns={activityColumns}
          getRowKey={(activity) => activity.id}
          rows={recentPlatformActivity}
        />
      </section>

      <section aria-labelledby="employer-inquiries-heading" className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-950" id="employer-inquiries-heading">
            Employer hiring inquiries
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sample inquiry queue (pending backend inquiries endpoint)
          </p>
        </div>
        <DataTable
          caption="Employer inquiries"
          columns={inquiryColumns}
          getRowKey={(inq) => inq.id}
          rows={employerInquiries}
        />
      </section>

      {isClientDialogOpen && (
        <FormDialog
          description="Create a new client record in MongoDB via POST /api/clients."
          onClose={() => setIsClientDialogOpen(false)}
          title="Add client account"
        >
          <form className="space-y-4 px-5 py-6 sm:px-7" onSubmit={handleCreateClient}>
            <label className="block text-sm font-medium text-slate-700">
              Company name
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" onChange={(e) => setCompanyName(e.currentTarget.value)} required value={companyName} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact person
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" onChange={(e) => setContactPerson(e.currentTarget.value)} required value={contactPerson} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Contact email
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" onChange={(e) => setContactEmail(e.currentTarget.value)} required type="email" value={contactEmail} />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Industry
              <input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm" onChange={(e) => setIndustry(e.currentTarget.value)} placeholder="e.g. FinTech / SaaS" value={industry} />
            </label>
            <div className="flex flex-col-reverse justify-end gap-3 border-t border-slate-100 pt-4 sm:flex-row">
              <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => setIsClientDialogOpen(false)} type="button">Cancel</button>
              <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60" disabled={isCreatingClient} type="submit">
                {isCreatingClient ? "Creating..." : "Create client"}
              </button>
            </div>
          </form>
        </FormDialog>
      )}
    </main>
  );
}
