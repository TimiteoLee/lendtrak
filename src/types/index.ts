export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  value: number;
  photo_url?: string;
  condition: string;
  created_at: string;
}

export interface Person {
  id: string;
  name: string;
  relationship: "friend" | "family" | "coworker" | "neighbor" | "other";
  phone?: string;
  email?: string;
  created_at: string;
}

export interface Loan {
  id: string;
  tool_id: string;
  person_id: string;
  borrowed_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  condition_out: string;
  condition_in?: string;
  location?: string;
  notes?: string;
  fee_amount: number;
  fee_paid: boolean;
  created_at: string;
  // joined
  tool?: Tool;
  person?: Person;
}

export type LoanStatus = "active" | "returned" | "overdue";
