"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { candidateManagementRecords, type CandidateManagementRecord } from "@/constants/admin-content";
import { downloadXlsx } from "@/lib/xlsx-export";

const pageSize = 5;

const statusTones: Record<string, "neutral" | "success" | "warning" | "hold" | "danger" | "info"> = {
  available: "success",
  shortlisted: "info",
  "interview scheduled": "info",
  "technical screening": "info",
  "resume under review": "warning",
  "in review": "warning",
  "on hold": "hold",
  rejected: "danger",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function CandidateManagementView() {
  const [query, setQuery] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedDateFrom, setAppliedDateFrom] = useState("");
  const [duplicatesOnly, setDuplicatesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMessage, setExportMessage] = useState("");

  const skillOptions = useMemo(
    () => [...new Set(candidateManagementRecords.flatMap((candidate) => candidate.primarySkills))].sort(),
    [],
  );
  const locationOptions = useMemo(
    () => [...new Set(candidateManagementRecords.map((candidate) => candidate.location))].sort(),
    [],
  );
  const statusOptions = useMemo(
    () => [...new Set(candidateManagementRecords.map((candidate) => candidate.status))].sort(),
    [],
  );

  const filteredCandidates = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return candidateManagementRecords.filter((candidate) => {
      const matchesSearch =
        !searchTerm ||
        [
          candidate.id,
          candidate.title,
          candidate.detail,
          candidate.phoneNumber,
          candidate.location,
          ...candidate.primarySkills,
        ].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesSkill = !skillsFilter || candidate.primarySkills.includes(skillsFilter);
      const matchesLocation = !locationFilter || candidate.location === locationFilter;
      const matchesStatus = !statusFilter || candidate.status === statusFilter;
      const matchesDate = !appliedDateFrom || candidate.lastAppliedDate >= appliedDateFrom;
      const matchesDuplicate = !duplicatesOnly || Boolean(candidate.duplicateWarning);
      const matchesExperience =
        !experienceFilter ||
        (experienceFilter === "0-3" && candidate.experienceYears <= 3) ||
        (experienceFilter === "3-5" && candidate.experienceYears > 3 && candidate.experienceYears <= 5) ||
        (experienceFilter === "5-8" && candidate.experienceYears > 5 && candidate.experienceYears <= 8) ||
        (experienceFilter === "8+" && candidate.experienceYears > 8);
      return (
        matchesSearch &&
        matchesSkill &&
        matchesLocation &&
        matchesStatus &&
        matchesDate &&
        matchesDuplicate &&
        matchesExperience
      );
    });
  }, [appliedDateFrom, duplicatesOnly, experienceFilter, locationFilter, query, skillsFilter, statusFilter]);

  const totalPages = Math.ceil(filteredCandidates.length / pageSize);
  const visibleCandidates = filteredCandidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const columns: DataTableColumn<CandidateManagementRecord>[] = [
    { key: "id", header: "Candidate ID", render: (candidate) => <span className="whitespace-nowrap font-medium text-slate-500">{candidate.id}</span> },
    {
      key: "title",
      header: "Candidate",
      render: (candidate) => (
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/candidates/${candidate.id}`}>
              {candidate.title}
            </Link>
            {candidate.duplicateWarning && (
              <StatusBadge label="Possible duplicate" tone="warning" />
            )}
          </div>
          <p className="text-[11px] text-slate-500">{candidate.detail} · {candidate.phoneNumber}</p>
        </div>
      ),
    },
    { key: "primarySkills", header: "Primary Skills", render: (candidate) => <div className="flex max-w-60 flex-wrap gap-1.5">{candidate.primarySkills.slice(0, 3).map((skill) => <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600" key={skill}>{skill}</span>)}{candidate.primarySkills.length > 3 && <span className="px-1 py-1 text-[10px] text-slate-500">+{candidate.primarySkills.length - 3}</span>}</div> },
    { key: "metric", header: "Experience", render: (candidate) => <span className="whitespace-nowrap">{candidate.experienceYears} years</span> },
    { key: "location", header: "Location", render: (candidate) => candidate.location },
    { key: "noticePeriod", header: "Notice Period", render: (candidate) => <span className="whitespace-nowrap">{candidate.noticePeriod}</span> },
    { key: "status", header: "Current Status", render: (candidate) => <StatusBadge label={candidate.status} tone={getStatusTone(candidate.status)} /> },
    { key: "totalApplications", header: "Applications", render: (candidate) => <span className="font-semibold tabular-nums text-slate-800">{candidate.totalApplications}</span> },
    { key: "actions", header: "Actions", className: "text-right", render: (candidate) => <Link className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50" href={`/admin/candidates/${candidate.id}`}>View profile</Link> },
  ];

  function exportCandidates() {
    const headings = ["Candidate ID", "Full Name", "Email", "Phone", "Primary Skills", "Experience", "Location", "Notice Period", "Current Status", "Total Applications"];
    const rows = filteredCandidates.map((candidate) => [
      candidate.id,
      candidate.title,
      candidate.detail,
      candidate.phoneNumber,
      candidate.primarySkills.join("; "),
      `${candidate.experienceYears} years`,
      candidate.location,
      candidate.noticePeriod,
      candidate.status,
      String(candidate.totalApplications),
    ]);
    const csv = [headings, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adp-softech-candidates.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage(`${filteredCandidates.length} candidate records exported as CSV.`);
  }

  function exportCandidatesXlsx() {
    const headings = ["Candidate ID", "Full Name", "Email", "Phone", "Primary Skills", "Experience", "Location", "Notice Period", "Current Status", "Total Applications"];
    const rows = filteredCandidates.map((candidate) => [
      candidate.id,
      candidate.title,
      candidate.detail,
      candidate.phoneNumber,
      candidate.primarySkills.join("; "),
      `${candidate.experienceYears} years`,
      candidate.location,
      candidate.noticePeriod,
      candidate.status,
      String(candidate.totalApplications),
    ]);
    downloadXlsx("adp-softech-candidates.xlsx", "Candidates", headings, rows);
    setExportMessage(`${filteredCandidates.length} candidate records exported as XLSX.`);
  }

  function clearFilters() {
    setQuery("");
    setSkillsFilter("");
    setExperienceFilter("");
    setLocationFilter("");
    setStatusFilter("");
    setAppliedDateFrom("");
    setDuplicatesOnly(false);
    setCurrentPage(1);
    setExportMessage("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Recruitment operations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Candidates</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Search by name, email, phone, technology, experience, location, and application date.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" onClick={exportCandidates} type="button"><span aria-hidden="true">↓</span> Export CSV</button>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" onClick={exportCandidatesXlsx} type="button"><span aria-hidden="true">↓</span> Export XLSX</button>
        </div>
      </header>

      <section aria-label="Candidate search and filters" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SearchBar className="sm:col-span-2" label="Search candidate" onChange={(value) => { setQuery(value); setCurrentPage(1); }} placeholder="Name, email, phone, skill, or location..." value={query} />
          <label className="block text-sm font-medium text-slate-700">Technology / skill
            <select className={selectClassName} onChange={(event) => { setSkillsFilter(event.currentTarget.value); setCurrentPage(1); }} value={skillsFilter}><option value="">All skills</option>{skillOptions.map((skill) => <option key={skill}>{skill}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Experience
            <select className={selectClassName} onChange={(event) => { setExperienceFilter(event.currentTarget.value); setCurrentPage(1); }} value={experienceFilter}><option value="">Any experience</option><option value="0-3">0–3 years</option><option value="3-5">3–5 years</option><option value="5-8">5–8 years</option><option value="8+">8+ years</option></select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Location
            <select className={selectClassName} onChange={(event) => { setLocationFilter(event.currentTarget.value); setCurrentPage(1); }} value={locationFilter}><option value="">All locations</option>{locationOptions.map((location) => <option key={location}>{location}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Status
            <select className={selectClassName} onChange={(event) => { setStatusFilter(event.currentTarget.value); setCurrentPage(1); }} value={statusFilter}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Last applied from
            <input className={selectClassName} onChange={(event) => { setAppliedDateFrom(event.currentTarget.value); setCurrentPage(1); }} type="date" value={appliedDateFrom} />
          </label>
          <label className="flex items-center gap-2.5 self-end rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">
            <input checked={duplicatesOnly} className="size-4 rounded border-slate-300 text-blue-700" onChange={(event) => { setDuplicatesOnly(event.currentTarget.checked); setCurrentPage(1); }} type="checkbox" />
            Flagged duplicates only
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p aria-live="polite" className="text-sm text-slate-500" role="status">Showing {filteredCandidates.length} of {candidateManagementRecords.length} candidates</p>
          {(query || skillsFilter || experienceFilter || locationFilter || statusFilter || appliedDateFrom || duplicatesOnly) && <button className="text-sm font-medium text-blue-700 hover:text-blue-900" onClick={clearFilters} type="button">Clear filters</button>}
        </div>
        {exportMessage && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{exportMessage}</p>}
        <div className="mt-4">
          <DataTable caption="Candidate management table" columns={columns} emptyDescription="Try a different search term or adjust the selected filters." emptyTitle="No candidates found" getRowKey={(candidate) => candidate.id} rows={visibleCandidates} />
        </div>
        {totalPages > 1 && <div className="mt-5 border-t border-slate-100 pt-4"><Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} /></div>}
      </section>
      <p className="mt-4 text-xs text-slate-500">Exports and duplicate flags reflect sample frontend records only.</p>
    </main>
  );
}
