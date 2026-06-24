# NoteSwift Parents Portal

Frontend interface for the NoteSwift Parents Portal. This dashboard allows parents to track student academic progress, attendance history, assignments, exam reports, payment invoices, and communicate directly with teachers.

This repository represents the frontend implementation (Phase 1). It operates with in-memory mock data to demonstrate the dashboard features and interactions before backend integration.

---

## Key Features

* **Multi-Student Context Switcher**: A top bar dropdown component that dynamically updates the dashboard context between linked children (e.g., Aarav Sharma and Ishan Sharma).
* **Overview Dashboard**: Display cards highlighting attendance metrics, homework alerts, study logs, and recent marks.
* **Academic Analytics**: Term-wise progress logs, grade breakdown tables, and cumulative GPA charts.
* **Attendance History**: Visual calendar grid representing attendance status (present, late, leave, absent) for the last 30 days.
* **Assignments Tracker**: Filters to organize homework by submission status (Pending, Submitted, Late) alongside grade outcomes.
* **Mock Exam Reports**: Performance charts comparing the student's marks against the class average.
* **Direct Messages**: Active conversation threads with teachers featuring simulated async responses.
* **Career Guidance Hub**: Curated learning resources, study tips, and academic track information tailored to the student's grade level.
* **Fee Statements**: Ledger lists to track billed and paid amounts with mock payment gateways (connectIPS, eSewa, Khalti, and cards).
* **Account Settings**: Management form to update parent profile information and adjust notification alert preferences.

---

## Tech Stack

* **Core Framework**: Next.js 15 (using App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **UI Primitives**: Radix UI (Shadcn UI)

---

## Local Setup

Follow these instructions to configure and run the application locally:

### 1. Prerequisites
Ensure you have Node.js (version 18.x or higher) and npm installed.

### 2. Navigate to the Directory
Change to the parents portal workspace directory:
```bash
cd noteswift-parents
```

### 3. Install Dependencies
Run npm install to retrieve the required packages:
```bash
npm install
```

### 4. Start the Development Server
Run the local next development server:
```bash
npm run dev
```
The server starts on port `9003`. Open http://localhost:9003 in your browser to access the portal.

---

## Data Mocking and Seeding

This phase does not require an active database server or seeding scripts:

* **Mock Database File**: All data schemas, lists, and records are stored in `src/data/mockData.ts`.
* **State Management**: Data is managed on the client side via the `ParentAuthProvider` in `src/context/parent-auth-context.tsx`. Actions such as sending messages, paying outstanding bills, or changing profile info mutate the React state locally and preserve configuration contexts using `localStorage`.

---

## Demo Credentials & Simulation Bypass

NoteSwift Parents Portal leverages a passwordless mobile verification flow. To simulate or login during local development:

* **Demo Phone Number**: `9841234567`
* **Demo OTP Bypass Code**: `123456`
* **Demo Student Linking Code**: `NSP-4X8K-92LQ` (Allows adding student Aarav Sharma to empty parent accounts)

---

## Data Mocking vs. Live Production Toggle

The frontend is built with a dual-mode switch that controls whether it uses in-memory mock data (for quick design feedback) or communicates with real backend APIs.

### Configuration Toggle
Create a `.env.local` or `.env.production` file at the root of `noteswift-parents/` and specify:

```env
# Set to false to connect to your live backend server:
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Alternatively, you can manually toggle this inside `src/config/app-config.ts` by editing the boolean export:
```typescript
export const USE_MOCK_DATA = false; // Switches all API calls to fetch from production endpoint
```

---

## Code Quality and Verification

To verify typescript typings and check for compilation errors:
```bash
npm run typecheck
```

To build a production bundle:
```bash
npm run build
```

---

## Phase 2 Integration

For detailed descriptions of the required database schemas, OTP authentication APIs, student linking code caches, and request/response payloads necessary to build the unified backend, see `NOTES_FOR_BACKEND_PHASE.md` in this directory.
