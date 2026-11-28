"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { resumeManagementRecords, type ResumeManagementRecord } from "@/constants/admin-content";
import { downloadXlsx } from "@/lib/xlsx-export";

const pageSize = 5;

const statusTones: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  reviewed: "success",
  "needs review": "warning",
  "ats pending": "info",
  "ats failed": "danger",
  parsed: "info",
};

function getStatusTone(status: string) {
  return statusTones[status.toLowerCase()] ?? "neutral";
}

function escapeCsv(value: string) {
  const safeValue = /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function ResumeManagementView() {
  const [query, setQuery] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [scoreFilter, setScoreFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [uploadDateFrom, setUploadDateFrom] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMessage, setExportMessage] = useState("");

  const skillOptions = useMemo(
    () => [...new Set(resumeManagementRecords.flatMap((resume) => resume.skills))].sort(),
    [],
  );
  const locationOptions = useMemo(
    () => [...new Set(resumeManagementRecords.map((resume) => resume.location))].sort(),
    [],
  );
  const statusOptions = useMemo(
    () => [...new Set(resumeManagementRecords.map((resume) => resume.status))].sort(),
    [],
  );

  const filteredResumes = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    return resumeManagementRecords.filter((resume) => {
      const matchesSearch =
        !searchTerm ||
        [
          resume.id,
          resume.title,
          resume.candidateEmail,
          resume.detail,
          resume.category,
          ...resume.skills,
        ].some((value) => value.toLowerCase().includes(searchTerm));
      const matchesSkill = !skillsFilter || resume.skills.includes(skillsFilter);
      const matchesLocation = !locationFilter || resume.location === locationFilter;
      const matchesStatus = !statusFilter || resume.status === statusFilter;
      const matchesDate = !uploadDateFrom || resume.uploadDateIso >= uploadDateFrom;
      const matchesExperience =
        !experienceFilter ||
        (experienceFilter === "0-3" && resume.experienceYears <= 3) ||
        (experienceFilter === "3-5" && resume.experienceYears > 3 && resume.experienceYears <= 5) ||
        (experienceFilter === "5-8" && resume.experienceYears > 5 && resume.experienceYears <= 8) ||
        (experienceFilter === "8+" && resume.experienceYears > 8);
      const matchesScore =
        !scoreFilter ||
        (scoreFilter === "90+" && resume.atsScore >= 90) ||
        (scoreFilter === "80-89" && resume.atsScore >= 80 && resume.atsScore <= 89) ||
        (scoreFilter === "70-79" && resume.atsScore >= 70 && resume.atsScore <= 79) ||
        (scoreFilter === "below-70" && resume.atsScore < 70);
      return (
        matchesSearch &&
        matchesSkill &&
        matchesLocation &&
        matchesStatus &&
        matchesDate &&
        matchesExperience &&
        matchesScore
      );
    });
  }, [experienceFilter, locationFilter, query, scoreFilter, skillsFilter, statusFilter, uploadDateFrom]);

  const totalPages = Math.ceil(filteredResumes.length / pageSize);
  const visibleResumes = filteredResumes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const selectClassName =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  const columns: DataTableColumn<ResumeManagementRecord>[] = [
    { key: "id", header: "Resume ID", render: (resume) => <span className="whitespace-nowrap font-medium text-slate-500">{resume.id}</span> },
    {
      key: "title",
      header: "Candidate & File",
      render: (resume) => (
        <div>
          <Link className="whitespace-nowrap font-semibold text-blue-700 hover:text-blue-900" href={`/admin/resumes/${resume.id}`}>{resume.title}</Link>
          <p className="text-[11px] text-slate-500">{resume.detail}</p>
        </div>
      ),
    },
    { key: "skills", header: "Extracted Skills", render: (resume) => <div className="flex max-w-60 flex-wrap gap-1.5">{resume.skills.slice(0, 3).map((skill) => <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600" key={skill}>{skill}</span>)}{resume.skills.length > 3 && <span className="px-1 py-1 text-[10px] text-slate-500">+{resume.skills.length - 3}</span>}</div> },
    { key: "experienceYears", header: "Experience", render: (resume) => <span className="whitespace-nowrap">{resume.experienceYears} years</span> },
    { key: "location", header: "Location", render: (resume) => resume.location },
    { key: "version", header: "Version", render: (resume) => <span className="whitespace-nowrap">{resume.version} ({resume.versions.length})</span> },
    { key: "date", header: "Upload Date", render: (resume) => <span className="whitespace-nowrap">{resume.date}</span> },
    { key: "atsScore", header: "ATS Score", render: (resume) => <span className="font-semibold tabular-nums text-slate-800">{resume.atsScore}%</span> },
    { key: "status", header: "Parse / Review", render: (resume) => <StatusBadge label={resume.status} tone={getStatusTone(resume.status)} /> },
    { key: "actions", header: "Actions", className: "text-right", render: (resume) => <Link className="whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50" href={`/admin/resumes/${resume.id}`}>Inspect</Link> },
  ];

  function exportResumes() {
    const headings = ["Resume ID", "Candidate Name", "Email", "File", "Skills", "Experience", "Location", "Resume Version", "Upload Date", "ATS Score", "Status"];
    const rows = filteredResumes.map((resume) => [
      resume.id,
      resume.title,
      resume.candidateEmail,
      resume.detail,
      resume.skills.join("; "),
      `${resume.experienceYears} years`,
      resume.location,
      resume.version,
      resume.date,
      `${resume.atsScore}%`,
      resume.status,
    ]);
    const csv = [headings, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "adp-softech-resumes.csv";
    anchor.click();
    URL.revokeObjectURL(url);
    setExportMessage(`${filteredResumes.length} resume records exported as CSV.`);
  }

  function exportResumesXlsx() {
    const headings = ["Resume ID", "Candidate Name", "Email", "File", "Skills", "Experience", "Location", "Resume Version", "Upload Date", "ATS Score", "Status"];
    const rows = filteredResumes.map((resume) => [
      resume.id,
      resume.title,
      resume.candidateEmail,
      resume.detail,
      resume.skills.join("; "),
      `${resume.experienceYears} years`,
      resume.location,
      resume.version,
      resume.date,
      `${resume.atsScore}%`,
      resume.status,
    ]);
    downloadXlsx("adp-softech-resumes.xlsx", "Resumes", headings, rows);
    setExportMessage(`${filteredResumes.length} resume records exported as XLSX.`);
  }

  function clearFilters() {
    setQuery("");
    setSkillsFilter("");
    setExperienceFilter("");
    setLocationFilter("");
    setScoreFilter("");
    setStatusFilter("");
    setUploadDateFrom("");
    setCurrentPage(1);
    setExportMessage("");
  }

  const hasFilters = Boolean(query || skillsFilter || experienceFilter || locationFilter || scoreFilter || statusFilter || uploadDateFrom);
  const updateFilter = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Recruitment operations</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Resume Management</h1>
          <p className="mt-3 max-w-2xl text-slate-600">Review uploaded resumes, version history, parsed profiles, and manual-review fallbacks.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" onClick={exportResumes} type="button"><span aria-hidden="true">↓</span> Export CSV</button>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50" onClick={exportResumesXlsx} type="button"><span aria-hidden="true">↓</span> Export XLSX</button>
        </div>
      </header>

      <section aria-label="Resume search and filters" className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SearchBar className="sm:col-span-2" label="Search resumes" onChange={updateFilter(setQuery)} placeholder="Candidate name, email, file, or skill..." value={query} />
          <label className="block text-sm font-medium text-slate-700">Skills filter
            <select className={selectClassName} onChange={(event) => updateFilter(setSkillsFilter)(event.currentTarget.value)} value={skillsFilter}><option value="">All skills</option>{skillOptions.map((skill) => <option key={skill}>{skill}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Experience
            <select className={selectClassName} onChange={(event) => updateFilter(setExperienceFilter)(event.currentTarget.value)} value={experienceFilter}><option value="">Any experience</option><option value="0-3">0–3 years</option><option value="3-5">3–5 years</option><option value="5-8">5–8 years</option><option value="8+">8+ years</option></select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Location
            <select className={selectClassName} onChange={(event) => updateFilter(setLocationFilter)(event.currentTarget.value)} value={locationFilter}><option value="">All locations</option>{locationOptions.map((location) => <option key={location}>{location}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">ATS score
            <select className={selectClassName} onChange={(event) => updateFilter(setScoreFilter)(event.currentTarget.value)} value={scoreFilter}><option value="">Any score</option><option value="90+">90% and above</option><option value="80-89">80–89%</option><option value="70-79">70–79%</option><option value="below-70">Below 70%</option></select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Parse / review status
            <select className={selectClassName} onChange={(event) => updateFilter(setStatusFilter)(event.currentTarget.value)} value={statusFilter}><option value="">All statuses</option>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Uploaded from
            <input className={selectClassName} onChange={(event) => updateFilter(setUploadDateFrom)(event.currentTarget.value)} type="date" value={uploadDateFrom} />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p aria-live="polite" className="text-sm text-slate-500" role="status">Showing {filteredResumes.length} of {resumeManagementRecords.length} resumes</p>
          {hasFilters && <button className="text-sm font-medium text-blue-700 hover:text-blue-900" onClick={clearFilters} type="button">Clear filters</button>}
        </div>
        {exportMessage && <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">{exportMessage}</p>}
        <div className="mt-4">
          <DataTable caption="Resume management table" columns={columns} emptyDescription="Try a different search term or adjust the selected filters." emptyTitle="No resumes found" getRowKey={(resume) => resume.id} rows={visibleResumes} />
        </div>
        {totalPages > 1 && <div className="mt-5 border-t border-slate-100 pt-4"><Pagination currentPage={currentPage} onPageChange={setCurrentPage} totalPages={totalPages} /></div>}
      </section>
      <p className="mt-4 text-xs text-slate-500">Resume files are access-controlled in production; exports include filtered summary records only.</p>
    </main>
  );
}
