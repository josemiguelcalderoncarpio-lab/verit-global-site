# Verit Global — Download Gate Runbook

## Scope
Centralized gating for `/exclusive/downloads/*` via `middleware.ts`. Single env kill-switch: `NEXT_PUBLIC_DISABLE_AGREE`.

---

## Health Checks (Production)

### A) Without cookies (expect redirect to /agree)
curl.exe -I "https://www.veritglobal.com/exclusive/downloads/verit-investor-kit.zip"

### B) With cookies (expect 200 OK)
curl.exe -I -H "Cookie: vg_access_granted=1; vg_user_email=test@corp.com" ^
  "https://www.veritglobal.com/exclusive/downloads/verit-investor-kit.zip"

### C) Server-side verdict
curl.exe "https://www.veritglobal.com/api/selftest"

Expected:
- No cookies → 307 to `/agree?...` and `{"verdict":"block"}`
- With cookies → 200 OK and `{"verdict":"allow"}`

---

## Toggle (Kill-Switch)

### Enable bypass (allow everyone)
echo 1 | vercel env add NEXT_PUBLIC_DISABLE_AGREE production
vercel --prod

### Disable bypass (restore gating)
vercel env rm NEXT_PUBLIC_DISABLE_AGREE production --yes
vercel --prod

> Note: If `{"killSwitch":false}` appears in `/api/selftest` after enabling, confirm the env var exists for **this project + environment** and redeploy. Edge middleware reads `process.env` at request time but requires a fresh deploy to pick up new project envs.

---

## Redirect Hygiene

- Vercel Dashboard → Project → **Settings → Redirects**: ensure no rules force `/downloads/*` or `/exclusive/downloads/*` → `/agree`.
- Repo: avoid client `router.push('/agree')` in download components. The gate should live **only** in `middleware.ts`.

---

## Files

- `middleware.ts` — central gate with matcher `["/exclusive/downloads/:path*"]`
- `src/app/api/selftest/route.ts` — shows cookie values and gate verdict
- (Optional) `/agree` — form only; do not own routing

---

## Rollback

1) Disable middleware temporarily:
   - `git mv middleware.ts middleware.off.ts`
   - `vercel --prod`

2) Re-enable:
   - `git mv middleware.off.ts middleware.ts`
   - `vercel --prod`

---

## Troubleshooting

- Looping to `/agree` even with cookies:
  - Check `/api/selftest` → if `verdict:"block"`, the server doesn’t see cookies (domain/scope).
  - If `verdict:"allow"` yet UI still redirects, search for client click interceptors: `Select-String -Pattern "/agree" -Path **/*.ts*`.
- Env toggle doesn’t change behavior:
  - Verify the var exists in **Production** for this project.
  - Redeploy and retest.
