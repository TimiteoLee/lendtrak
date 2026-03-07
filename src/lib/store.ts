import { supabase } from "./supabase";
import { Tool, Person, Loan } from "@/types";

// Tools
export async function getTools(): Promise<Tool[]> {
  const { data } = await supabase
    .from("tools")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Tool[]) || [];
}

export async function getTool(id: string): Promise<Tool | undefined> {
  const { data } = await supabase.from("tools").select("*").eq("id", id).single();
  return data as Tool | undefined;
}

export async function saveTool(tool: Omit<Tool, "id" | "created_at">): Promise<Tool> {
  const { data } = await supabase.from("tools").insert(tool).select().single();
  return data as Tool;
}

export async function updateTool(id: string, updates: Partial<Tool>): Promise<Tool | undefined> {
  const { id: _id, created_at: _ca, ...rest } = updates as Tool;
  const { data } = await supabase.from("tools").update(rest).eq("id", id).select().single();
  return data as Tool | undefined;
}

export async function deleteTool(id: string): Promise<void> {
  await supabase.from("tools").delete().eq("id", id);
}

// People
export async function getPeople(): Promise<Person[]> {
  const { data } = await supabase
    .from("people")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as Person[]) || [];
}

export async function getPerson(id: string): Promise<Person | undefined> {
  const { data } = await supabase.from("people").select("*").eq("id", id).single();
  return data as Person | undefined;
}

export async function savePerson(person: Omit<Person, "id" | "created_at">): Promise<Person> {
  const { data } = await supabase.from("people").insert(person).select().single();
  return data as Person;
}

export async function updatePerson(id: string, updates: Partial<Person>): Promise<Person | undefined> {
  const { id: _id, created_at: _ca, ...rest } = updates as Person;
  const { data } = await supabase.from("people").update(rest).eq("id", id).select().single();
  return data as Person | undefined;
}

export async function deletePerson(id: string): Promise<void> {
  await supabase.from("people").delete().eq("id", id);
}

// Loans
export async function getLoans(): Promise<Loan[]> {
  const { data } = await supabase
    .from("loans")
    .select("*, tool:tools(*), person:people(*)")
    .order("created_at", { ascending: false });
  return (data as Loan[]) || [];
}

export async function getLoan(id: string): Promise<Loan | undefined> {
  const { data } = await supabase
    .from("loans")
    .select("*, tool:tools(*), person:people(*)")
    .eq("id", id)
    .single();
  return data as Loan | undefined;
}

export async function getLoansForTool(toolId: string): Promise<Loan[]> {
  const { data } = await supabase
    .from("loans")
    .select("*, tool:tools(*), person:people(*)")
    .eq("tool_id", toolId)
    .order("created_at", { ascending: false });
  return (data as Loan[]) || [];
}

export async function getLoansForPerson(personId: string): Promise<Loan[]> {
  const { data } = await supabase
    .from("loans")
    .select("*, tool:tools(*), person:people(*)")
    .eq("person_id", personId)
    .order("created_at", { ascending: false });
  return (data as Loan[]) || [];
}

export async function getActiveLoans(): Promise<Loan[]> {
  const { data } = await supabase
    .from("loans")
    .select("*, tool:tools(*), person:people(*)")
    .is("actual_return_date", null)
    .order("created_at", { ascending: false });
  return (data as Loan[]) || [];
}

export async function saveLoan(
  loan: Omit<Loan, "id" | "created_at" | "tool" | "person">
): Promise<Loan> {
  const { data } = await supabase.from("loans").insert(loan).select().single();
  return data as Loan;
}

export async function returnLoan(
  id: string,
  conditionIn: string,
  notes?: string
): Promise<Loan | undefined> {
  const updates: Record<string, unknown> = {
    actual_return_date: new Date().toISOString(),
    condition_in: conditionIn,
  };
  if (notes) updates.notes = notes;

  const { data } = await supabase
    .from("loans")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  return data as Loan | undefined;
}

export async function deleteLoan(id: string): Promise<void> {
  await supabase.from("loans").delete().eq("id", id);
}

// Stats
export async function getStats() {
  const [tools, loans, activeLoans] = await Promise.all([
    getTools(),
    getLoans(),
    getActiveLoans(),
  ]);

  const totalValue = tools.reduce((sum, t) => sum + Number(t.value), 0);
  const lentOutValue = activeLoans.reduce(
    (sum, l) => sum + Number(l.tool?.value || 0),
    0
  );
  const totalFees = loans.reduce((sum, l) => sum + Number(l.fee_amount), 0);
  const overdue = activeLoans.filter(
    (l) =>
      l.expected_return_date &&
      new Date(l.expected_return_date) < new Date()
  );

  return {
    totalTools: tools.length,
    activeLoans: activeLoans.length,
    totalValue,
    lentOutValue,
    totalFees,
    overdueCount: overdue.length,
  };
}
