# CLAUDE.md

Guide for Claude Code (and people) setting up and running this demo from a fresh clone.

## What this is

**Matrix Technologies** is a fictional HR and expenses portal used to demo MCP security with Descope, in three stages:

1. **Stage 1:** portal with Descope login (magic link / OTP) and role-based permissions. No MCP.
2. **Stage 2:** the same app exposes an MCP server at `/api/mcp` with **no auth**. Anyone can read salaries.
3. **Stage 3:** the same URL secured with Descope OAuth (MCP authorization spec). Each persona only gets what their role allows.

The MCP URL is `http://localhost:3010/api/mcp` in every stage. Claude Desktop is the MCP client, via `mcp-remote`.

## Stack

- Next.js 15 (App Router) + TypeScript, React 19
- `@descope/nextjs-sdk` for portal login, `jose` for validating MCP access tokens
- `@modelcontextprotocol/sdk` for the MCP server
- Data is a JSON file (`data/db.json`, gitignored), seeded from `src/lib/seed.ts` on first request
- Runs on **port 3010** (`npm run dev`)

## Setup from scratch

Requires Node.js 20+ and a Descope account (https://app.descope.com).

1. **Descope project.** Create a project (or reuse one) and follow [DESCOPE-SETUP.md](DESCOPE-SETUP.md) step by step:
   - Stage 1 sections: permissions, roles (Employee, Manager, HR Admin), three users, the Sign Up or In flow.
   - Stage 3 sections: the MCP Server resource, its scopes, access policies and the consent flow.
   Docs use placeholders: `[DESCOPE_PROJECT]` is your project's name, `[EMAIL_EMMA]` / `[EMAIL_MARK]` / `[EMAIL_HANNAH]` are inboxes you control (plus-addressing like `you+emma@…` works well), `[PROJECT_FOLDER]` is wherever you cloned this repo.
   IDs written in DESCOPE-SETUP.md (project ID, MCP server ID) are the original author's; use your own.
2. **Environment.**
   ```bash
   cp .env.example .env.local
   ```
   Fill in `.env.local`:
   | Variable | Where to get it |
   | --- | --- |
   | `NEXT_PUBLIC_DESCOPE_PROJECT_ID`, `DESCOPE_PROJECT_ID` | Project Settings → General → Project ID |
   | `DESCOPE_MCP_SERVER_ID` | Agentic Identity Hub → MCP Servers → your server (Stage 3) |
   | `EMAIL_EMMA`, `EMAIL_MARK`, `EMAIL_HANNAH` | The persona inboxes (display only) |
   | `DESCOPE_USER_ID_EMMA`, `_MARK`, `_HANNAH` | Users → click the user → User ID. **Required**: logins are matched to personas by this ID |
   | `DEMO_STAGE` | `1`, `2` or `3` |
   Optional overrides: `MCP_RESOURCE_URL` (default `http://localhost:3010/api/mcp`), `DESCOPE_MCP_ISSUER`.
3. **Install and run.**
   ```bash
   npm install
   npm run reset && DEMO_STAGE=1 npm run dev
   ```
   Open http://localhost:3010 and sign in as a persona.

Seed data is written to `data/db.json` once. After changing persona env vars, stop the server and run `npm run reset`.

## Commands

| Task | Command |
| --- | --- |
| Dev server (port 3010) | `npm run dev` |
| Start a stage | `npm run reset && DEMO_STAGE=N npm run dev` (must be one line) |
| Production build check | `npm run build` |
| Type check | `npx tsc --noEmit` |
| Reset demo data | `npm run reset` (server stopped) |
| Free port 3010 | `lsof -ti tcp:3010 -sTCP:LISTEN \| xargs kill` |

There is no test suite. Verify changes with `npm run build` and by running the stage.

## Connecting Claude Desktop (stages 2 and 3)

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` under `mcpServers`, then restart Claude Desktop:

```json
"matrix": {
  "command": "npx",
  "args": ["-y", "mcp-remote", "http://localhost:3010/api/mcp"]
}
```

To switch persona or go from stage 2 to 3: quit Claude Desktop, `rm -rf ~/.mcp-auth`, reopen. The full live run sheet is [DEMO.md](DEMO.md).

## Code map

- `src/app/page.tsx`: login page (Descope `sign-up-or-in` flow)
- `src/middleware.ts`: protects `/dashboard`
- `src/lib/auth.ts`: server-side session validation, roles and permissions from the Descope JWT
- `src/app/dashboard/`: portal UI and server actions (permission re-checked on every change)
- `src/app/api/mcp/route.ts`: MCP endpoint; `DEMO_STAGE` decides off / no auth / Descope auth
- `src/lib/mcp/tools.ts`: MCP tools, each takes a `Caller` (anonymous in stage 2, verified user in stage 3)
- `src/lib/mcp/descope-auth.ts`: access token validation (issuer, signature, expiry, audience) and scope → permission mapping
- `src/app/api/oauth-protected-resource/route.ts`: `/.well-known/oauth-protected-resource` metadata (stage 3)
- `src/lib/seed.ts`, `src/lib/db.ts`: demo data and the JSON store

## Conventions

- Never commit real emails, personal names, local paths or `.env.local`. Use the placeholders above.
- Don't label things "insecure" in URLs or names the audience sees; stage 2 is presented as "we shipped MCP".
- Keep the MCP URL the same across stages.
- Document every Descope console change in DESCOPE-SETUP.md as click-by-click steps.
