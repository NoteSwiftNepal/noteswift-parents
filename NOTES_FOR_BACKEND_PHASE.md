# NoteSwift Backend Phase Integration Guide: Parent Portal Support (Revised)

This guide details the integration steps required in `noteswift-backend` to support the Parent Portal frontend application. It optimizes implementation by **reusing the backend's existing OTP and phone verification service**, avoiding database pollution with duplicate verification collections.

---

## 1. Modular Folder Structure for Parent Sub-App

In alignment with the backend's modular structure, create a new modular sub-app under `src/apps/parent/`:

```
src/apps/parent/
├── app.ts                          # Sub-app configuration & router mounting
├── controllers/
│   └── parentController.ts         # Authentication, student linking, and profile logic
├── middlewares/
│   └── parentAuth.ts               # Protects routes by validating parent JWT tokens
├── models/
│   └── Parent.model.ts             # Mongoose Parent Schema definition
└── routes/
    └── parentRoutes.ts             # Endpoint routing definitions
```

### Mount the Sub-App (`src/index.ts`)
```diff
+ import parentApp from './apps/parent/app';

// Mount platform-specific apps
app.use('/api/admin', adminApp);
app.use('/api/teacher', teacherApp);
app.use('/api/student', studentApp);
+ app.use('/api/parent', parentApp);
```

---

## 2. Reusing Built-in OTP Services

The backend already has a fully-featured Twilio-based phone OTP service located in:
`src/apps/student/services/phoneOTPService.ts`

This service stores pending SMS verification codes in `global.phoneOTPStore` with a 10-minute expiry duration. We reuse this system directly instead of creating a new database model.

### Import Usage in Parent Controller:
```typescript
import { sendPhoneOTP, verifyPhoneOTP } from "@student/services/phoneOTPService";
```

---

## 3. Core Types & Authentication Schema Modifications

### A. Extend Authentication Roles (`src/core/types/auth.types.ts`)
Extend the authorized session claims to include the `"parent"` role:
```typescript
export interface SessionPayload {
    user_id: string;
    role: "admin" | "student" | "teacher" | "parent"; // Added "parent"
    iat?: number;
    exp?: number;
}

export interface AuthUser {
    id: string;
    name: string;
    role: "admin" | "student" | "teacher" | "parent"; // Added "parent"
}
```

### B. Parent Schema Model (`src/apps/parent/models/Parent.model.ts`)
Creates a new `parents` collection in MongoDB.
```typescript
import mongoose, { Schema, model, Document } from "mongoose";

export interface TParent extends Document {
  email?: string;
  fullName: string;
  phoneNumber: string;                 // Format: +977-98XXXXXXXX
  avatarEmoji: string;
  linkedStudents: mongoose.Types.ObjectId[];
  notificationPreferences: {
    emailDigest: boolean;
    smsAlerts: boolean;
    pushAlerts: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<TParent>({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true, index: true },
  avatarEmoji: { type: String, default: "NP" },
  linkedStudents: [{ type: Schema.Types.ObjectId, ref: "Student" }],
  notificationPreferences: {
    emailDigest: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: true },
    pushAlerts: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Virtual to populate compatibility 'id' field matching frontend expectations
ParentSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
ParentSchema.set("toJSON", { virtuals: true });

export const ParentModel = mongoose.models.Parent || model<TParent>("Parent", ParentSchema);
```

---

## 4. Auth Middleware (`src/apps/parent/middlewares/parentAuth.ts`)

Extract and validate JWT tokens signed with `SESSION_SECRET` for the `"parent"` role:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import JsonResponse from "@core/lib/Response";
import { ParentModel } from '../models/Parent.model';
import { SessionPayload, AuthUser } from '@core/types/auth.types';

export const authenticateParent = async (req: Request, res: Response, next: NextFunction) => {
  const jsonResponse = new JsonResponse(res);
  try {
    let token: string | undefined;
    
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.substring(7);
    } else if (req.cookies?.session) {
      token = req.cookies.session;
    }

    if (!token) return jsonResponse.notAuthorized("Session token required");

    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET not defined");

    const decoded = jwt.verify(token, secret) as SessionPayload;

    if (decoded.role !== 'parent') {
      return jsonResponse.notAuthorized("Access denied: Parent role required");
    }

    const parent = await ParentModel.findById(decoded.user_id);
    if (!parent) return jsonResponse.notAuthorized("Parent profile not found");

    req.user = {
      id: parent._id.toString(),
      name: parent.fullName,
      role: "parent"
    } as AuthUser;

    res.locals.parent = parent;
    next();
  } catch (error) {
    return jsonResponse.notAuthorized("Invalid or expired token");
  }
};
```

---

## 5. Endpoints Implementation

### A. Authentication & Verification

#### **`POST /api/parent/auth/send-otp`**
* **Request Body**:
  ```json
  {
    "phoneNumber": "+977-98XXXXXXXX",
    "purpose": "login" // or "register"
  }
  ```
* **For Register (With metadata parameters)**:
  ```json
  {
    "phoneNumber": "+977-98XXXXXXXX",
    "purpose": "register",
    "fullName": "Reena Sharma",
    "email": "reena@example.com"
  }
  ```
* **Controller Logic**:
  1. Validate Nepalese phone number format (`^\+977-98\d{8}$` or `^98\d{8}$`).
  2. Normalize the phone number.
  3. If `purpose === "register"`: Check if `ParentModel.exists({ phoneNumber })` is true. If yes, return `400 Client Error` ("Phone number already registered").
  4. If `purpose === "login"`: Check if parent exists. If no, return `400 Client Error` ("Account not found. Please register first.").
  5. Call the existing OTP delivery logic:
     ```typescript
     const result = await sendPhoneOTP(phoneNumber);
     if (!result.success) {
       return res.status(500).json({ success: false, message: result.message });
     }
     ```
  6. Return `200 OK` `{ "success": true }`.
  *(Note: For registration, because the OTP generator saves verification to memory directly, temporarily keep registration names/emails in client state. When the parent subsequently posts to `/verify-otp`, they pass the phone number, OTP code, AND the optional `fullName`/`email` so the account can be created upon verification success).*

#### **`POST /api/parent/auth/verify-otp`**
* **Request Body**:
  ```json
  {
    "phoneNumber": "+977-98XXXXXXXX",
    "otpCode": "XXXXXX",
    "fullName": "Reena Sharma", // Optional (For registration creation)
    "email": "reena@example.com" // Optional (For registration creation)
  }
  ```
* **Controller Logic**:
  1. Call backend validator:
     ```typescript
     const otpResult = await verifyPhoneOTP(phoneNumber, otpCode);
     if (!otpResult.success) {
       return res.status(400).json({ success: false, message: otpResult.message });
     }
     ```
  2. Find or create the Parent document:
     ```typescript
     let parent = await ParentModel.findOne({ phoneNumber });
     if (!parent) {
       if (!fullName) {
         return res.status(400).json({ success: false, message: "Registration details required for new accounts" });
       }
       // Auto-generate initials for default avatarEmoji (e.g. Reena Sharma -> RS)
       const avatarEmoji = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'NP';
       
       parent = new ParentModel({
         phoneNumber,
         fullName,
         email,
         avatarEmoji
       });
       await parent.save();
     }
     ```
  3. Sign JWT session:
     ```typescript
     const session: SessionPayload = {
       user_id: parent._id.toString(),
       role: "parent"
     };
     const token = jwt.sign(session, process.env.SESSION_SECRET!, { expiresIn: "30d" });
     ```
  4. Query and aggregate the parent's `children` profiles list.
  5. Return:
     ```json
     {
       "token": "JWT_TOKEN",
       "parent": {
         "id": "parent_mongodb_id",
         "fullName": "Reena Sharma",
         "phoneNumber": "+977-98XXXXXXXX",
         "email": "reena@example.com",
         "avatarEmoji": "RS"
       },
       "children": [ /* Aggregated ChildData Array */ ]
     }
     ```

---

### B. Child Student Linking

#### **`POST /api/parent/link-student`**
* **Request Body**:
  ```json
  {
    "linkCode": "NSP-XXXX-XXXX"
  }
  ```
* **Controller Logic**:
  1. Parse the alphanumeric link code. Retrieve the `studentId` linked to this code from Redis/memory (set by the Student app's `/api/student/generate-link-code` endpoint).
  2. If expired or not found, return `400 Bad Request` ("Invalid or expired linking code").
  3. Load parent profile: `const parent = res.locals.parent;`
  4. Check if `parent.linkedStudents.includes(studentId)`. If yes, return `400 Bad Request` ("Student already linked").
  5. Save change:
     ```typescript
     parent.linkedStudents.push(studentId);
     await parent.save();
     ```
  6. Query and assemble the child's academic metrics profile: `linkedStudent` (see section 6).
  7. Return:
     ```json
     {
       "success": true,
       "linkedStudent": { /* ChildData */ }
     }
     ```

---

### C. Parent Profile Settings

#### **`PUT /api/parent/profile`**
* **Request Body**:
  ```json
  {
    "fullName": "Updated Name",
    "email": "new-email@example.com",
    "notificationPreferences": {
      "emailDigest": true,
      "smsAlerts": true,
      "pushAlerts": false
    }
  }
  ```
* **Controller Logic**:
  1. Save changes to `res.locals.parent` and return success.

---

## 6. Assembling Child Dashboards (`ChildData` Schema)

For each ID in the `linkedStudents` array, query backend collections to compile the required analytical structure expected by the Parent Portal:

### 1. Basic Student Info
* `id`: `student._id`
* `fullName`: `student.full_name`
* `grade`: Map student's grade number (e.g. `10` -> `"Grade 10"`).
* `avatarEmoji`: `student.avatarEmoji` (Default: `"🎓"`).

### 2. Attendance (`attendancePercent` & `attendanceHistory`)
* Query completed `LiveClass` documents targeted at the student's batch or grade.
* Calculate `attendancePercent`:
  $$\text{Percent} = \frac{\text{Classes student joined (exists in attendee logs)}}{\text{Total completed class sessions}} \times 100$$
* Map `attendanceHistory` from the class records:
  ```json
  {
    "date": "2026-06-24",
    "status": "present", // or "absent"
    "reason": "Class session attended"
  }
  ```

### 3. Assignments Tracker
* Query `Assignment` documents where `studentId` or the student's `batchId` is targeted.
* Look for matching student submissions in the `submissions` list:
  * If a submission exists:
    * Status: `"submitted"`.
    * Score: `submission.score` / `assignment.totalMarks`.
  * If no submission exists:
    * If `deadline` is in the past: status is `"late"`.
    * If `deadline` is in the future: status is `"pending"`.
* Map to frontend structure:
  ```json
  {
    "id": "assignment_id",
    "title": "Algebra Homework 3",
    "subject": "Mathematics",
    "dueDate": "2026-06-28",
    "submissionStatus": "submitted",
    "score": "18/20"
  }
  ```

### 4. GPA & Academic Progress
* **`recentGpa`**: GPA calculated from the latest terminal test scores.
* **`subjectPerformance`**: Aggregate test scores per subject, convert average percentages into grades (A+, A, B, etc.), and determine trend (`"up"` if the latest score is above average, `"down"` if below, or `"stable"`).
* **`academicProgress.gpaTrend`**: Historical GPA term scores.
* **`academicProgress.gradesBreakdown`**: Term-by-term detail listing subject names, marks obtained, total marks, and letter grades.

### 5. Mock Tests
* Query `Test` documents taken by the student.
* Map score, maximum marks, and overall class average calculated from other student test submissions:
  ```json
  {
    "id": "test_id",
    "title": "Unit Practice Test 4",
    "subject": "Physics",
    "score": 42,
    "totalMarks": 50,
    "classAverage": 38,
    "date": "2026-06-18"
  }
  ```
