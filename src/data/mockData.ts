export interface StudentProgress {
  subject: string;
  percentage: number;
  grade: string;
  trend: "up" | "down" | "stable";
}

export interface ActivityLog {
  time: string;
  icon: string;
  title: string;
  subtext: string;
}

export interface AIInsight {
  type: "warning" | "good" | "info";
  text: string;
}

export interface UpcomingAlert {
  type: "assignment" | "test" | "meeting" | "payment";
  title: string;
  date: string;
  relativeTime: string;
  statusDot: "red" | "green" | "yellow" | "blue";
}

export interface Assignment {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  submissionStatus: "submitted" | "pending" | "late";
  score?: string;
}

export interface MockTest {
  id: string;
  subject: string;
  title: string;
  score: number;
  totalMarks: number;
  classAverage: number;
  date: string;
}

export interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late" | "leave";
  reason?: string;
}

export interface GradeBreakdown {
  term: string;
  gpa: number;
  subjects: {
    name: string;
    marksObtained: number;
    totalMarks: number;
    grade: string;
  }[];
}

export interface ChildData {
  id: string;
  fullName: string;
  rollNo: number;
  grade: string;
  schoolName: string;
  avatarEmoji: string;
  gpa: number;
  attendancePercent: number;
  weeklyStudyHours: number;
  
  // Today's Snapshot
  classesAttendedToday: number;
  totalClassesToday: number;
  assignmentsDueCount: number;
  assignmentsDueStatus: "On track" | "Pending" | "None";
  studyHoursToday: number;
  latestMockTestScore: number;
  
  // Charts & Metrics
  weeklyScoreTrend: number[]; // Last 8 weeks
  subjectPerformance: StudentProgress[];
  aiInsights: AIInsight[];
  upcomingAlerts: UpcomingAlert[];
  activityTimeline: ActivityLog[];
  activityHeatmap: number[]; // 56 entries for 8 weeks
  
  // Pages detail data
  academicProgress: {
    gpaTrend: { term: string; gpa: number }[];
    gradesBreakdown: GradeBreakdown[];
  };
  attendanceHistory: AttendanceRecord[];
  assignments: Assignment[];
  mockTests: MockTest[];
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar?: string;
}

export interface Message {
  id: string;
  sender: "parent" | "teacher";
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  teacher: Teacher;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  category: "exam" | "event" | "general";
}

export interface GuidanceResource {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  imageUrl?: string;
  link?: string;
}

export interface Invoice {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending";
  datePaid?: string;
  invoiceUrl?: string;
}

export interface ParentProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  avatarEmoji: string;
}

export interface MockDatabase {
  parent: ParentProfile;
  children: ChildData[];
  chats: ChatThread[];
  notices: Notice[];
  guidance: GuidanceResource[];
  invoices: Invoice[];
}

// Generate daily attendance list for the last 30 days
const generateAttendance = (presentRate: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const today = new Date();
  for (let i = 30; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // skip Saturdays (weekend in Nepal)
    if (d.getDay() === 6) continue;
    
    const rand = Math.random();
    let status: "present" | "absent" | "late" | "leave" = "present";
    let reason: string | undefined = undefined;
    
    if (rand > presentRate) {
      const typeRand = Math.random();
      if (typeRand < 0.5) {
        status = "absent";
        reason = "Sick leave";
      } else if (typeRand < 0.8) {
        status = "late";
        reason = "Traffic delay";
      } else {
        status = "leave";
        reason = "Family event";
      }
    }
    
    records.push({
      date: d.toISOString().split("T")[0],
      status,
      reason,
    });
  }
  return records;
};

// Generate 56-day heatmap study hours activity
const generateHeatmap = (baseHours: number): number[] => {
  return Array.from({ length: 56 }, () => {
    const isWeekend = Math.random() > 0.8;
    if (isWeekend) return Math.floor(Math.random() * 2); // 0 or 1 hour on weekend
    const modifier = Math.random() > 0.7 ? 1.5 : 1;
    return Math.min(4, Math.floor(Math.random() * baseHours * modifier));
  });
};

export const mockDatabase: MockDatabase = {
  parent: {
    id: "p1",
    email: "reena.sharma@example.com",
    fullName: "Reena Sharma",
    phoneNumber: "+977-9841234567",
    avatarEmoji: "RS",
  },
  children: [
    {
      id: "c1",
      fullName: "Aarav Sharma",
      rollNo: 12,
      grade: "Grade 10 (Section A)",
      schoolName: "NoteSwift Secondary School",
      avatarEmoji: "AS",
      gpa: 3.82,
      attendancePercent: 94.5,
      weeklyStudyHours: 14.5,
      classesAttendedToday: 5,
      totalClassesToday: 6,
      assignmentsDueCount: 1,
      assignmentsDueStatus: "On track",
      studyHoursToday: 2.25,
      latestMockTestScore: 85,
      weeklyScoreTrend: [75, 78, 82, 80, 85, 88, 84, 89],
      subjectPerformance: [
        { subject: "Mathematics", percentage: 88, grade: "A", trend: "up" },
        { subject: "Science", percentage: 92, grade: "A+", trend: "up" },
        { subject: "English", percentage: 84, grade: "B+", trend: "stable" },
        { subject: "Social Studies", percentage: 79, grade: "B", trend: "down" },
        { subject: "Nepali", percentage: 82, grade: "B+", trend: "stable" },
      ],
      aiInsights: [
        {
          type: "warning",
          text: "Trigonometry score dipped. Recommended action: Review identity practice sheets.",
        },
        {
          type: "good",
          text: "Science lab performance improved to A. Strong analytical detail in reports.",
        },
        {
          type: "info",
          text: "Weekly target met: 3.5 study hours completed in Social Studies.",
        },
      ],
      upcomingAlerts: [
        {
          type: "assignment",
          title: "Science Project Submission",
          date: "2026-06-24",
          relativeTime: "Tomorrow",
          statusDot: "yellow",
        },
        {
          type: "test",
          title: "Math Trigonometry Quiz",
          date: "2026-06-26",
          relativeTime: "This week",
          statusDot: "red",
        },
        {
          type: "meeting",
          title: "Parent-Teacher Meeting (PTA)",
          date: "2026-07-02",
          relativeTime: "Next week",
          statusDot: "blue",
        },
        {
          type: "payment",
          title: "Tuition & Lab Fee Payment",
          date: "2026-06-30",
          relativeTime: "This week",
          statusDot: "yellow",
        },
      ],
      activityTimeline: [
        {
          time: "09:30 AM",
          icon: "BookOpen",
          title: "Attended Mathematics Class",
          subtext: "Covered Algebra II and Quadratic Equations",
        },
        {
          time: "11:15 AM",
          icon: "Award",
          title: "Completed Science Quiz",
          subtext: "Scored 9/10 in 'Gravitational Force' test",
        },
        {
          time: "02:00 PM",
          icon: "FileDown",
          title: "Downloaded English Notes",
          subtext: "Downloaded 'Short Story Analysis' study material",
        },
        {
          time: "04:30 PM",
          icon: "CheckCircle",
          title: "Submitted Social Studies Homework",
          subtext: "Uploaded 'Historical Movements of Nepal' essay",
        },
      ],
      activityHeatmap: generateHeatmap(3),
      academicProgress: {
        gpaTrend: [
          { term: "Grade 9 Term 1", gpa: 3.65 },
          { term: "Grade 9 Term 2", gpa: 3.70 },
          { term: "Grade 9 Final", gpa: 3.75 },
          { term: "Grade 10 Term 1", gpa: 3.82 },
        ],
        gradesBreakdown: [
          {
            term: "Grade 10 Term 1",
            gpa: 3.82,
            subjects: [
              { name: "Mathematics", marksObtained: 88, totalMarks: 100, grade: "A" },
              { name: "Science", marksObtained: 92, totalMarks: 100, grade: "A+" },
              { name: "English", marksObtained: 84, totalMarks: 100, grade: "B+" },
              { name: "Social Studies", marksObtained: 79, totalMarks: 100, grade: "B" },
              { name: "Nepali", marksObtained: 82, totalMarks: 100, grade: "B+" },
            ],
          },
          {
            term: "Grade 9 Final",
            gpa: 3.75,
            subjects: [
              { name: "Mathematics", marksObtained: 85, totalMarks: 100, grade: "A" },
              { name: "Science", marksObtained: 89, totalMarks: 100, grade: "A" },
              { name: "English", marksObtained: 82, totalMarks: 100, grade: "B+" },
              { name: "Social Studies", marksObtained: 81, totalMarks: 100, grade: "B+" },
              { name: "Nepali", marksObtained: 80, totalMarks: 100, grade: "B+" },
            ],
          },
        ],
      },
      attendanceHistory: generateAttendance(0.93),
      assignments: [
        {
          id: "as-1",
          subject: "Mathematics",
          title: "Trigonometry Heights and Distances Worksheet",
          dueDate: "2026-06-20",
          submissionStatus: "submitted",
          score: "18/20",
        },
        {
          id: "as-2",
          subject: "Science",
          title: "Chemical reactions and balancing equations experiment report",
          dueDate: "2026-06-18",
          submissionStatus: "submitted",
          score: "23/25",
        },
        {
          id: "as-3",
          subject: "English",
          title: "Essay: Climate change impacts in Nepal's mountains",
          dueDate: "2026-06-25",
          submissionStatus: "pending",
        },
        {
          id: "as-4",
          subject: "Social Studies",
          title: "History timeline of Nepal's unification",
          dueDate: "2026-06-15",
          submissionStatus: "late",
          score: "14/20",
        },
        {
          id: "as-5",
          subject: "Nepali",
          title: "Nepali Byakaran - Shabda Barga exercise",
          dueDate: "2026-06-28",
          submissionStatus: "pending",
        },
      ],
      mockTests: [
        {
          id: "mt-1",
          subject: "Mathematics",
          title: "Set Theory & Probability Mock Test",
          score: 85,
          totalMarks: 100,
          classAverage: 76,
          date: "2026-06-10",
        },
        {
          id: "mt-2",
          subject: "Science",
          title: "Light reflection & refraction MCQ test",
          score: 92,
          totalMarks: 100,
          classAverage: 79,
          date: "2026-06-12",
        },
        {
          id: "mt-3",
          subject: "English",
          title: "Grammar: Tenses, active/passive & vocabulary",
          score: 84,
          totalMarks: 100,
          classAverage: 82,
          date: "2026-06-15",
        },
        {
          id: "mt-4",
          subject: "Social Studies",
          title: "Constitution of Nepal Mock Exam",
          score: 79,
          totalMarks: 100,
          classAverage: 72,
          date: "2026-06-17",
        },
      ],
    },
    {
      id: "c2",
      fullName: "Ishan Sharma",
      rollNo: 18,
      grade: "Grade 7 (Section B)",
      schoolName: "NoteSwift Secondary School",
      avatarEmoji: "IS",
      gpa: 3.45,
      attendancePercent: 88.2,
      weeklyStudyHours: 9.2,
      classesAttendedToday: 4,
      totalClassesToday: 6,
      assignmentsDueCount: 2,
      assignmentsDueStatus: "Pending",
      studyHoursToday: 1.0,
      latestMockTestScore: 78,
      weeklyScoreTrend: [70, 72, 71, 75, 74, 78, 76, 78],
      subjectPerformance: [
        { subject: "Mathematics", percentage: 72, grade: "C+", trend: "stable" },
        { subject: "Science", percentage: 78, grade: "B", trend: "up" },
        { subject: "English", percentage: 85, grade: "A", trend: "up" },
        { subject: "Social Studies", percentage: 80, grade: "B+", trend: "stable" },
        { subject: "Nepali", percentage: 75, grade: "B-", trend: "down" },
      ],
      aiInsights: [
        {
          type: "warning",
          text: "Attendance dropped to 88.2%. Aim for 90%+ to stay on track.",
        },
        {
          type: "good",
          text: "English vocabulary remains strong. 100% scored on spelling dictation.",
        },
        {
          type: "info",
          text: "Fractions support suggested. Practice sheets available in assignments.",
        },
      ],
      upcomingAlerts: [
        {
          type: "assignment",
          title: "Math Fractions Worksheet",
          date: "2026-06-24",
          relativeTime: "Tomorrow",
          statusDot: "yellow",
        },
        {
          type: "assignment",
          title: "Nepali Essay - Yo Mero Desh",
          date: "2026-06-25",
          relativeTime: "In 2 days",
          statusDot: "yellow",
        },
        {
          type: "test",
          title: "Science Weekly Quiz",
          date: "2026-06-26",
          relativeTime: "This week",
          statusDot: "red",
        },
        {
          type: "meeting",
          title: "Parent-Teacher Meeting (PTA)",
          date: "2026-07-02",
          relativeTime: "Next week",
          statusDot: "blue",
        },
      ],
      activityTimeline: [
        {
          time: "10:00 AM",
          icon: "BookOpen",
          title: "Attended Science Class",
          subtext: "Studied plant cells and structure",
        },
        {
          time: "12:30 PM",
          icon: "Award",
          title: "Submitted English Quiz",
          subtext: "Scored 10/10 in 'Opposite Words' assignment",
        },
        {
          time: "03:00 PM",
          icon: "PlayCircle",
          title: "Watched Mathematics Video Lecture",
          subtext: "Viewed 'Understanding Fractions' video tutorial",
        },
      ],
      activityHeatmap: generateHeatmap(2),
      academicProgress: {
        gpaTrend: [
          { term: "Grade 6 Term 1", gpa: 3.2 },
          { term: "Grade 6 Term 2", gpa: 3.3 },
          { term: "Grade 6 Final", gpa: 3.4 },
          { term: "Grade 7 Term 1", gpa: 3.45 },
        ],
        gradesBreakdown: [
          {
            term: "Grade 7 Term 1",
            gpa: 3.45,
            subjects: [
              { name: "Mathematics", marksObtained: 72, totalMarks: 100, grade: "C+" },
              { name: "Science", marksObtained: 78, totalMarks: 100, grade: "B" },
              { name: "English", marksObtained: 85, totalMarks: 100, grade: "A" },
              { name: "Social Studies", marksObtained: 80, totalMarks: 100, grade: "B+" },
              { name: "Nepali", marksObtained: 75, totalMarks: 100, grade: "B-" },
            ],
          },
        ],
      },
      attendanceHistory: generateAttendance(0.88),
      assignments: [
        {
          id: "as-1b",
          subject: "English",
          title: "Write a short paragraph about your best friend",
          dueDate: "2026-06-20",
          submissionStatus: "submitted",
          score: "16/20",
        },
        {
          id: "as-2b",
          subject: "Mathematics",
          title: "Exercises on Fractions and Decimals",
          dueDate: "2026-06-24",
          submissionStatus: "pending",
        },
        {
          id: "as-3b",
          subject: "Nepali",
          title: "Essay: Yo Mero Desh (My Country)",
          dueDate: "2026-06-25",
          submissionStatus: "pending",
        },
        {
          id: "as-4b",
          subject: "Social Studies",
          title: "Draw a map of your local government ward",
          dueDate: "2026-06-12",
          submissionStatus: "submitted",
          score: "17/20",
        },
      ],
      mockTests: [
        {
          id: "mt-1b",
          subject: "Mathematics",
          title: "Introduction to Fractions Class Quiz",
          score: 72,
          totalMarks: 100,
          classAverage: 74,
          date: "2026-06-11",
        },
        {
          id: "mt-2b",
          subject: "Science",
          title: "Cell biology weekly test",
          score: 78,
          totalMarks: 100,
          classAverage: 75,
          date: "2026-06-14",
        },
        {
          id: "mt-3b",
          subject: "English",
          title: "Opposite and Synonymous Words Exam",
          score: 85,
          totalMarks: 100,
          classAverage: 78,
          date: "2026-06-18",
        },
      ],
    },
  ],
  chats: [
    {
      id: "ch-1",
      teacher: {
        id: "t-1",
        name: "Mr. Kiran Adhikari",
        subject: "Mathematics",
      },
      lastMessage: "Perfect. Let me know if you need any additional worksheets.",
      lastMessageTime: "2026-06-22T10:45:00Z",
      unreadCount: 0,
      messages: [
        {
          id: "m-1",
          sender: "teacher",
          text: "Hello Mrs. Sharma, Aarav is doing great in Algebra but needs to focus more on Geometry.",
          timestamp: "2026-06-22T10:30:00Z",
        },
        {
          id: "m-2",
          sender: "parent",
          text: "Thank you for the update, Mr. Adhikari. I will ensure he practices geometry at home.",
          timestamp: "2026-06-22T10:40:00Z",
        },
        {
          id: "m-3",
          sender: "teacher",
          text: "Perfect. Let me know if you need any additional worksheets.",
          timestamp: "2026-06-22T10:45:00Z",
        },
      ],
    },
    {
      id: "ch-2",
      teacher: {
        id: "t-2",
        name: "Ms. Sarita Thapa",
        subject: "Science",
      },
      lastMessage: "No worries, please have him submit it as soon as possible.",
      lastMessageTime: "2026-06-21T09:15:00Z",
      unreadCount: 1,
      messages: [
        {
          id: "m-4",
          sender: "teacher",
          text: "Hi, I noticed Aarav did not submit his chemistry project on time. Is everything alright?",
          timestamp: "2026-06-21T08:50:00Z",
        },
        {
          id: "m-5",
          sender: "parent",
          text: "My apologies, Ms. Thapa. Aarav was unwell yesterday, but he is completing it today.",
          timestamp: "2026-06-21T09:05:00Z",
        },
        {
          id: "m-6",
          sender: "teacher",
          text: "No worries, please have him submit it as soon as possible.",
          timestamp: "2026-06-21T09:15:00Z",
        },
      ],
    },
    {
      id: "ch-3",
      teacher: {
        id: "t-3",
        name: "Mr. Dev Raj Giri",
        subject: "English",
      },
      lastMessage: "Aarav is showing great writing skills in his class essay.",
      lastMessageTime: "2026-06-19T14:30:00Z",
      unreadCount: 0,
      messages: [
        {
          id: "m-7",
          sender: "teacher",
          text: "Aarav is showing great writing skills in his class essay.",
          timestamp: "2026-06-19T14:30:00Z",
        },
      ],
    },
  ],
  notices: [
    {
      id: "no-1",
      title: "First Terminal Examination Schedule & Guidelines",
      content: "The First Terminal Examinations for academic year 2083/2084 are scheduled to start from July 10, 2026. The detailed routine will be distributed in classes and has been uploaded here. Students must maintain 75% attendance to qualify for the examinations. Please clear all outstanding library books and quarterly dues by July 5, 2026.",
      date: "2026-06-20",
      author: "Principal - NoteSwift Academy",
      category: "exam",
    },
    {
      id: "no-2",
      title: "Parent-Teacher Association (PTA) General Meeting",
      content: "We cordially invite all parents and guardians to the PTA General Meeting on Friday, July 2, 2026, at 1:00 PM in the school auditorium. We will discuss academic calendars, extra-curricular activities, and safety updates. Your valuable feedback is highly appreciated.",
      date: "2026-06-18",
      author: "School Administration",
      category: "event",
    },
    {
      id: "no-3",
      title: "Monsoon Health Advisory & Dress Code Update",
      content: "With the onset of the monsoon season, we advise parents to send children with rain gear and umbrellas. Additionally, school tracksuits can be worn on days with heavy rain forecasts. Let's work together to ensure health and safety.",
      date: "2026-06-15",
      author: "School Health Section",
      category: "general",
    },
  ],
  guidance: [
    {
      id: "rg-1",
      title: "Exploring Careers in STEM fields (Nepal Context)",
      category: "Career Planning",
      description: "A comprehensive guide on opportunities, universities, and tracks for science, technology, engineering, and math graduates in Nepal and abroad.",
      readTime: "8 min read",
    },
    {
      id: "rg-2",
      title: "Choosing the Right Stream: Science vs Management vs Humanities",
      category: "Academic Streams",
      description: "Advice on assessing student aptitude, interests, and matching them with the perfect HSEB +2 stream path after Grade 10 SEE exams.",
      readTime: "5 min read",
    },
    {
      id: "rg-3",
      title: "How to Support Your Child During Exam Stress",
      category: "Mental Well-being",
      description: "Practical steps parents can take at home to build a distraction-free, supportive environment that minimizes terminal test anxieties.",
      readTime: "6 min read",
    },
    {
      id: "rg-4",
      title: "Developing Strong Study Habits in Middle School",
      category: "Study Tips",
      description: "Effective techniques including the Pomodoro timer, structured schedules, and habit tracking suited for grades 6 to 8 students.",
      readTime: "4 min read",
    },
  ],
  invoices: [
    {
      id: "INV-2026-001",
      description: "Admission & Term 1 Fees",
      amount: 20000,
      dueDate: "2026-04-10",
      status: "paid",
      datePaid: "2026-04-05",
      invoiceUrl: "#",
    },
    {
      id: "INV-2026-005",
      description: "Tuition & Transportation Fee (April)",
      amount: 15000,
      dueDate: "2026-05-15",
      status: "paid",
      datePaid: "2026-05-12",
      invoiceUrl: "#",
    },
    {
      id: "INV-2026-009",
      description: "Tuition & Science Lab Fee (May)",
      amount: 10000,
      dueDate: "2026-06-30",
      status: "pending",
      invoiceUrl: "#",
    },
  ],
};
