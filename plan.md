# PojimPortal Web App Implementation Plan - Update for Treasurer Recording

Building an offline-first contribution tracker for "Pojim Self Help Group". This update adds specific capabilities for the Treasurer (Admin) to record member contributions and loans.

**Note:** This is a frontend-only implementation with client-side state management (mock data + localStorage) as per session constraints.

## Scope & Non-Goals
- **Scope:**
    - Authentication flow (mocked credentials for member/admin).
    - Sidebar navigation with user profile context.
    - Dashboard with high-level stats (Admin sees group totals).
    - Shares tracking table (Members see theirs, Admin can see/record all).
    - Loan management (Short/Long term rules).
    - Treasurer Admin Panel: Record contributions and loans for any member.
    - Member list for Admin.
    - Responsive UI using Tailwind CSS and Shadcn UI components.
- **Non-Goals:**
    - Real Supabase/Postgres backend.
    - Multi-device sync (offline-first per device).

## Affected Areas
- `src/context/DataContext.tsx`: Update to support admin operations on other users.
- `src/components/layout/Sidebar.tsx`: Add Admin-only navigation items.
- `src/pages/AdminManagement.tsx`: New page for Treasurer to manage members and record data.
- `src/App.tsx`: Add routes for new admin pages.

## Phases (Updated)

### Phase 7: Treasurer Admin Features
- **Admin Management Page:** Create a view for the treasurer to see all members.
- **Record Contribution:** Modal for Admin to select a member and add a share amount.
- **Record Loan:** Modal for Admin to select a member and issue a short/long term loan.
- **Data Context Update:** Add `allShares`, `allLoans`, `allUsers` to `DataContext` and functions like `adminAddShare(userId, amount)`.
- **Owner:** `frontend_engineer`

### Phase 8: Final Review & Polish
- Ensure Admin can see aggregate financial data (Financial Summary) correctly based on ALL data.
- Verify consistency between Admin recorded data and Member viewed data.
- **Owner:** `quick_fix_engineer`

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Implement the Admin recording UI and DataContext updates.
2. quick_fix_engineer — Final polish and cross-page data consistency check.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 7
- **Scope:** Create the Admin Management page. Update `DataContext.tsx` to include an `allUsers` mock array and methods for admin to add shares/loans for specific `userIds`. Update `Sidebar.tsx` to show "Member Management" only for Admin.
- **Files:** `src/context/DataContext.tsx`, `src/pages/AdminManagement.tsx`, `src/components/layout/Sidebar.tsx`, `src/App.tsx`
- **Acceptance criteria:** As an Admin, I can select a member from a list and add a Ksh. 1000 contribution to their account. As that member (logging in after), I see that contribution in "My Shares".

### 2. quick_fix_engineer
- **Phases:** 8
- **Scope:** Ensure `FinancialSummary.tsx` uses the new `allShares` and `allLoans` from `DataContext` instead of static mock data. Add toast notifications for admin actions.
- **Files:** `src/pages/FinancialSummary.tsx`, `src/pages/AdminManagement.tsx`
- **Acceptance criteria:** The "Group Net Worth" in Financial Summary updates automatically when the admin records a new contribution.
