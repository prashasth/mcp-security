// Seed data for the Matrix Technologies demo.
// The three personas are linked to real Descope users by their Descope user ID.

export type Employee = {
  id: string;
  name: string;
  email: string;
  title: string;
  department: string;
  managerId: string | null;
  salary: number; // AUD per year
  descopeUserId?: string;
};

export type ExpenseStatus = "pending" | "approved" | "rejected";

export type Expense = {
  id: string;
  employeeId: string;
  description: string;
  amount: number; // AUD
  status: ExpenseStatus;
  submittedAt: string;
  decidedBy?: string;
  decidedAt?: string;
};

export type AuditEntry = {
  at: string;
  actor: string; // who did it, or "anonymous"
  channel: "portal" | "mcp";
  action: string;
};

export type Db = {
  employees: Employee[];
  expenses: Expense[];
  audit: AuditEntry[];
};

export function seedData(): Db {
  return {
    employees: [
      {
        id: "e1",
        name: "Emma Clarke",
        email: process.env.EMAIL_EMMA || "emma.clarke@matrix.example",
        title: "Software Engineer",
        department: "Engineering",
        managerId: "e2",
        salary: 135000,
        descopeUserId: process.env.DESCOPE_USER_ID_EMMA || "U3MSmhJmv2xYuGEYHLxisXLWPH4V",
      },
      {
        id: "e2",
        name: "Mark Davies",
        email: process.env.EMAIL_MARK || "mark.davies@matrix.example",
        title: "Engineering Manager",
        department: "Engineering",
        managerId: "e7",
        salary: 185000,
        descopeUserId: process.env.DESCOPE_USER_ID_MARK || "U3MSmhLW6XLfYbfFLEgDf4rNx5kd",
      },
      {
        id: "e3",
        name: "Hannah Lee",
        email: process.env.EMAIL_HANNAH || "hannah.lee@matrix.example",
        title: "HR Director",
        department: "People",
        managerId: "e7",
        salary: 172000,
        descopeUserId: process.env.DESCOPE_USER_ID_HANNAH || "U3MSmhHvhhrMsBcZEWMijgdQEaLz",
      },
      {
        id: "e4",
        name: "Raj Patel",
        email: "raj.patel@matrix.example",
        title: "Senior Software Engineer",
        department: "Engineering",
        managerId: "e2",
        salary: 158000,
      },
      {
        id: "e5",
        name: "Sofia Martinez",
        email: "sofia.martinez@matrix.example",
        title: "Account Executive",
        department: "Sales",
        managerId: "e6",
        salary: 118000,
      },
      {
        id: "e6",
        name: "Daniel Kim",
        email: "daniel.kim@matrix.example",
        title: "Sales Manager",
        department: "Sales",
        managerId: "e7",
        salary: 165000,
      },
      {
        id: "e7",
        name: "Olivia Chen",
        email: "olivia.chen@matrix.example",
        title: "Chief Executive Officer",
        department: "Executive",
        managerId: null,
        salary: 320000,
      },
    ],
    expenses: [
      { id: "x1", employeeId: "e1", description: "Flight to Sydney for client visit", amount: 480, status: "pending", submittedAt: "2026-11-18" },
      { id: "x2", employeeId: "e1", description: "Team lunch", amount: 120, status: "approved", submittedAt: "2026-11-02", decidedBy: "Mark Davies", decidedAt: "2026-11-03" },
      { id: "x3", employeeId: "e4", description: "Conference ticket: DevSecCon", amount: 899, status: "pending", submittedAt: "2026-11-15" },
      { id: "x4", employeeId: "e5", description: "Client dinner", amount: 260, status: "pending", submittedAt: "2026-11-19" },
      { id: "x5", employeeId: "e2", description: "Ergonomic laptop stand", amount: 85, status: "pending", submittedAt: "2026-11-20" },
    ],
    audit: [],
  };
}
