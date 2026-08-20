# Supabase Security Notes

The learner-facing application uses browser-safe Supabase publishable credentials and server-side service-role calls. Student-owned state tables use Row Level Security policies keyed to `auth.uid()`.

On 2026-08-20, the project security advisor reported missing RLS on `source_pages`, `import_runs`, and `rejected_records`. The `secure_public_audit_tables` migration enabled RLS on all three tables. They now have no policies, which deliberately denies direct client access; server-only service-role import and catalog operations remain available.

The advisor still reports informational “RLS enabled, no policy” notices for internal/tagging tables. These likewise deny direct browser access and are intentional for server-only data. Supabase Auth still reports that leaked-password protection is disabled. Enable it in the Supabase Dashboard under **Authentication → Password Security → Leaked password protection** before public launch. See [Supabase password security guidance](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
