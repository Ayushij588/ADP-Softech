# ADP Softech

MVP frontend structure for the ADP Softech public website, Recruitment Admin
Panel, and Super Admin Panel.

## Routes

- Public website: `/`, `/about`, `/services`, `/careers`,
  `/careers/[jobId]`, `/submit-resume`, `/employers`, `/contact`,
  `/privacy-policy`, `/terms`
- Recruitment admin: `/admin/login`, `/admin/dashboard`, `/admin/jobs`,
  `/admin/applications`, `/admin/candidates`, `/admin/resumes`, `/admin/ats`,
  `/admin/reports`
- Super admin: `/super-admin/login`, `/super-admin/dashboard`,
  `/super-admin/users`, `/super-admin/roles`, `/super-admin/settings`,
  `/super-admin/website-content`, `/super-admin/ats-settings`,
  `/super-admin/audit-logs`

Public pages live in the `(public)` route group, which is omitted from URLs.
Administrative areas use their explicit `/admin` and `/super-admin` prefixes.
All route pages are MVP placeholders; the shared directories are reserved for
the corresponding implementation without adding candidate or employer
portals.

## Public application email verification

Public applications use a candidate intake followed by email verification:

1. `POST /api/candidates` accepts candidate details and requires
   `"consent": true`. It creates a short-lived pending intake and returns its
   ID; it does not create a candidate record or reserve the email/mobile.
2. `POST /api/applications/verification` with `{ "candidateId": "...", "jobId": "..." }`
   requests a one-time code sent to the email stored on the pending intake. The
   response is generic and does not confirm eligibility.
3. `POST /api/applications` with `{ "candidateId": "...", "jobId": "...",
   "verificationCode": "123456" }` submits the application. The code is bound
   to that candidate and job, expires after 10 minutes, allows at most five
   verification attempts, and can be used only once. Resends are throttled to
   one per candidate per minute. A candidate record is created only after the
   verification code is accepted. Pending intake data expires with the
   verification window.

The consent acknowledgement and its timestamp are stored, but the official
consent wording/version and mobile-number format remain pending business/legal
approval; no wording or phone format is implied here.

## Dashboard API

`GET /api/dashboard` requires an authenticated recruiter or Super Admin.
Recruiters see metrics only for jobs they own; Super Admin can view overall
metrics or filter by recruiter, client, or job. Optional `startDate` and
`endDate` filters use `YYYY-MM-DD` dates (UTC, inclusive) and scope application
metrics by `appliedAt`. Active JD counts reflect current active jobs under the
selected recruiter/client/job filters.

The response includes active JDs, new applications, unique candidates in the
filtered applications, applications grouped by Job ID, shortlisted, interview
scheduled, submitted to client, selected, rejected, and on-hold counts. ATS
match distribution is not included.

Configure SMTP in the backend environment with `SMTP_HOST`, `SMTP_PORT`,
`SMTP_FROM`, and optionally `SMTP_USER` plus `SMTP_PASSWORD`. Set
`SMTP_SECURE=true` for implicit TLS; otherwise the backend requires STARTTLS.
Never commit SMTP credentials.

## Development

```bash
npm run dev
npm run lint
npm run build
```
