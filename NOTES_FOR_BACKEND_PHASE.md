# Spec for Phase 2: Backend Integration
This document details the database schema modifications, authentication updates, and API endpoints required in `noteswift-backend` during Phase 2 to support the Parent Portal.

---

## 1. Authentication & Roles Expansion

Currently, the backend auth payload limits roles to `admin`, `student`, and `teacher` in `src/core/types/auth.types.ts`.

### Required Changes:
* **Extend `SessionPayload` and `AuthUser` roles**:
  ```typescript
  export interface SessionPayload {
      user_id: string;
      role: "admin" | "student" | "teacher" | "parent"; // Add "parent"
      iat?: number;
      exp?: number;
  }
  ```
* **Authentication Middleware**:
  Extend route guard middleware in the backend (`src/apps/teacher/middlewares/auth.ts` or sibling folders) to authenticate and validate JWTs with the `parent` role.

---

## 2. Database Models & Schema Extensions

A parent entity needs to be introduced, and links between parents and students must be established.

### A. Parent Schema (`Parent.ts` - New Model)
```typescript
import { Schema, model, Document } from "mongoose";

export interface TParent extends Document {
  email: string;
  fullName: string;
  phoneNumber: string;
  passwordHash: string;
  avatarEmoji: string;
  linkedStudents: Schema.Types.ObjectId[]; // Links to Student IDs
  notificationPreferences: {
    emailDigest: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<TParent>({
  email: { type: String, required: true, unique: true, lowercase: true },
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  passwordHash: { type: String, required: true },
  avatarEmoji: { type: String, default: "RS" },
  linkedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  notificationPreferences: {
    emailDigest: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    pushAlerts: { type: Boolean, default: false }
  }
}, { timestamps: true });

export const ParentModel = model<TParent>("Parent", ParentSchema);
```

### B. Student Schema updates (`Student.ts`)
* Add a reciprocal field to check linked parent account reference if needed (optional but helpful for querying).

---

## 3. Required API Endpoints

The parent frontend requires the following REST endpoints under a `/api/parent` router.

### A. Authentication & Account
* **`POST /api/parent/auth/login`**
  * Payload: `{ email, password }`
  * Action: Validates credentials, signs and returns a JWT token with role `"parent"`.
* **`GET /api/parent/profile`**
  * Action: Returns active parent profile information.
* **`PATCH /api/parent/profile`**
  * Payload: `{ fullName, phoneNumber }`
  * Action: Updates parent's contact profile details.
* **`PATCH /api/parent/settings/notifications`**
  * Payload: `{ emailDigest, smsAlerts, pushAlerts }`
  * Action: Updates parent's notification preferences.

### B. Children & Student Context
* **`GET /api/parent/children`**
  * Action: Returns basic info of all linked children (Student objects), including roll no, grade, school name, and summary metrics for their current day snapshot:
    * Classes attended today vs total classes today.
    * Assignments due count + status.
    * Daily study hours tracked.
    * Latest mock test score percentage.
* **`GET /api/parent/children/:childId/academic`**
  * Action: Returns term-wise grades history and GPA semester trajectory records.
* **`GET /api/parent/children/:childId/attendance`**
  * Action: Returns daily attendance history list (past 30 days) and summary stats (attendance percent, present/absent/late/leave counts).
* **`GET /api/parent/children/:childId/assignments`**
  * Action: Returns list of homework assignments, submission status (submitted, pending, late), due dates, and teacher grades/scores.
* **`GET /api/parent/children/:childId/tests`**
  * Action: Returns mock tests list, question counts, test dates, and comparison averages with the class average.

### C. Communication & Info Center
* **`GET /api/parent/messages`**
  * Action: Retrieves a list of chat threads with teachers teaching the linked children.
* **`POST /api/parent/messages/:threadId`**
  * Payload: `{ text }`
  * Action: Appends a parent message to the chat thread and notifies the teacher.
* **`GET /api/parent/notices`**
  * Action: Returns active school notice board announcements and term examination schedules.
* **`GET /api/parent/career-resources`**
  * Action: Retrieves guidance resources list (articles, career suggestions) relevant to the active child's class category.

### D. Fee & Billing
* **`GET /api/parent/payments/invoices`**
  * Action: Retrieves outstanding and settled fee statement records (amount, description, status, due dates).
* **`POST /api/parent/payments/process`**
  * Payload: `{ invoiceId, paymentMethod, amount }`
  * Action: Integrates with Nepalese local payment SDKs (connectIPS, eSewa, or Khalti) to verify signatures, check transaction status, and record payments.
