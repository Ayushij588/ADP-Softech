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

## Development

```bash
npm run dev
npm run lint
npm run build
```
