# Matrix Technologies: MCP security demo

A demo of a web portal that gains MCP access, in three stages:

1. **Stage 1:** an HR and expenses portal with Descope login (magic link). No MCP.
2. **Stage 2:** the same portal plus an MCP server with **no auth** at `/api/mcp`, to show the problem.
3. **Stage 3:** the same `/api/mcp` URL secured with Descope OAuth, so each persona gets the right data or a denial.

Claude is the MCP client in stages 2 and 3.

## The story

**Stage 1: a normal company portal.** Matrix Technologies runs an internal HR and expenses portal. Employees sign in with Descope, and what they see depends on their role: Emma (Employee) sees her own pay, Mark (Manager) approves his team's expenses, and Hannah (HR Admin) manages everyone's salaries. Everything is locked down the way it should be.

**Stage 2: "we shipped MCP".** Everyone wants to use AI assistants at work, so the team adds an MCP server to the portal and announces that Claude can now use Matrix directly. It works, and it's fast. But the MCP endpoint never asks who is calling. Any assistant that knows the URL can list every employee's salary, approve expenses or change pay, with no login at all. The portal's careful role checks don't apply to this new door.

**Stage 3: the same URL, now with identity.** The team puts Descope in front of the MCP server, using no new URL and no new client. Now when Claude connects, the person has to sign in and approve what the assistant may do (OAuth consent with scopes). Access policies make sure each role can only grant what it's allowed. Emma's assistant can see her pay but not anyone else's, Mark's can see his direct reports' salaries but can't change them, and Hannah's can do everything. Every MCP call is tied to a real person and shows up in the audit log.

The takeaway: an MCP server is a new front door to your app. Give it the same identity and authorization as the rest of the app.

## Personas

| Persona | Role | Email | Can do |
| --- | --- | --- | --- |
| Emma Clarke | Employee | [EMAIL_EMMA] | See own profile and pay, submit expenses |
| Mark Davies | Manager | [EMAIL_MARK] | Everything Emma can, plus approve his team's expenses and see his direct reports' salaries |
| Hannah Lee | HR Admin | [EMAIL_HANNAH] | Everything, including viewing and changing all salaries |

The `[EMAIL_…]` placeholders stand for the real login inboxes, set in `.env.local` (see `.env.example`).

Roles and permissions live in the Descope project **[DESCOPE_PROJECT]**:

| Permission | Employee | Manager | HR Admin |
| --- | :-: | :-: | :-: |
| `profile:read` | ✓ | ✓ | ✓ |
| `expenses:submit` | ✓ | ✓ | ✓ |
| `expenses:approve` | | ✓ | ✓ |
| `salaries:read` | | | ✓ |
| `salaries:read:team` (direct reports only) | | ✓ | |
| `salaries:write` | | | ✓ |

## Run it locally

Needs Node.js 20 or newer.

```bash
cp .env.example .env.local   # already points at [DESCOPE_PROJECT]
npm install
npm run dev
```

Set `DEMO_STAGE` in `.env.local` to pick the stage (1, 2 or 3). See [DEMO.md](DEMO.md) for the run sheet and [DESCOPE-SETUP.md](DESCOPE-SETUP.md) for every Descope console step.

Open http://localhost:3010, enter one of the persona emails, and click the magic link in that inbox.

To put the demo data back to its starting state, stop the server and run `npm run reset`.

## How it works

- `src/app/page.tsx` renders the Descope `sign-up-or-in` flow.
- `src/middleware.ts` blocks `/dashboard` without a valid Descope session.
- `src/lib/auth.ts` validates the session on the server and reads `roles` and `permissions` from the Descope JWT.
- `src/app/dashboard/actions.ts` checks the permission again on the server for every change.
- `src/app/api/mcp/route.ts` is the MCP server. `DEMO_STAGE` decides whether it is off (1), released without auth (2) or secured with Descope (3).
- `src/lib/mcp/tools.ts` holds the MCP tools. They take a `Caller`, which is `anonymous` in Stage 2 and a verified Descope user in Stage 3.
- `src/lib/mcp/descope-auth.ts` validates Descope access tokens in Stage 3 (signature, issuer, expiry, audience) and works out the caller's permissions from their role and granted scopes.
- `src/app/api/oauth-protected-resource/route.ts` serves `/.well-known/oauth-protected-resource`, which tells MCP clients that Descope is the authorization server.
- `src/lib/db.ts` keeps the data in `data/db.json`, so the portal and the MCP servers (stages 2 and 3) share it.
- The activity log on the dashboard records who did what and through which channel (portal or MCP).
