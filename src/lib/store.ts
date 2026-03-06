import { Tool, Person, Loan } from "@/types";

const TOOLS_KEY = "lendtrak_tools";
const PEOPLE_KEY = "lendtrak_people";
const LOANS_KEY = "lendtrak_loans";

function generateId(): string {
  return crypto.randomUUID();
}

function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

// Tools
export function getTools(): Tool[] {
  return getItems<Tool>(TOOLS_KEY);
}

export function getTool(id: string): Tool | undefined {
  return getTools().find((t) => t.id === id);
}

export function saveTool(tool: Omit<Tool, "id" | "created_at">): Tool {
  const tools = getTools();
  const newTool: Tool = {
    ...tool,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  tools.push(newTool);
  setItems(TOOLS_KEY, tools);
  return newTool;
}

export function updateTool(id: string, updates: Partial<Tool>): Tool | undefined {
  const tools = getTools();
  const index = tools.findIndex((t) => t.id === id);
  if (index === -1) return undefined;
  tools[index] = { ...tools[index], ...updates };
  setItems(TOOLS_KEY, tools);
  return tools[index];
}

export function deleteTool(id: string): void {
  setItems(TOOLS_KEY, getTools().filter((t) => t.id !== id));
}

// People
export function getPeople(): Person[] {
  return getItems<Person>(PEOPLE_KEY);
}

export function getPerson(id: string): Person | undefined {
  return getPeople().find((p) => p.id === id);
}

export function savePerson(person: Omit<Person, "id" | "created_at">): Person {
  const people = getPeople();
  const newPerson: Person = {
    ...person,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  people.push(newPerson);
  setItems(PEOPLE_KEY, people);
  return newPerson;
}

export function updatePerson(id: string, updates: Partial<Person>): Person | undefined {
  const people = getPeople();
  const index = people.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  people[index] = { ...people[index], ...updates };
  setItems(PEOPLE_KEY, people);
  return people[index];
}

export function deletePerson(id: string): void {
  setItems(PEOPLE_KEY, getPeople().filter((p) => p.id !== id));
}

// Loans
export function getLoans(): Loan[] {
  const loans = getItems<Loan>(LOANS_KEY);
  const tools = getTools();
  const people = getPeople();
  return loans.map((loan) => ({
    ...loan,
    tool: tools.find((t) => t.id === loan.tool_id),
    person: people.find((p) => p.id === loan.person_id),
  }));
}

export function getLoan(id: string): Loan | undefined {
  return getLoans().find((l) => l.id === id);
}

export function getLoansForTool(toolId: string): Loan[] {
  return getLoans().filter((l) => l.tool_id === toolId);
}

export function getLoansForPerson(personId: string): Loan[] {
  return getLoans().filter((l) => l.person_id === personId);
}

export function getActiveLoans(): Loan[] {
  return getLoans().filter((l) => !l.actual_return_date);
}

export function saveLoan(loan: Omit<Loan, "id" | "created_at" | "tool" | "person">): Loan {
  const loans = getItems<Loan>(LOANS_KEY);
  const newLoan: Loan = {
    ...loan,
    id: generateId(),
    created_at: new Date().toISOString(),
  };
  loans.push(newLoan);
  setItems(LOANS_KEY, loans);
  return newLoan;
}

export function returnLoan(
  id: string,
  conditionIn: string,
  notes?: string
): Loan | undefined {
  const loans = getItems<Loan>(LOANS_KEY);
  const index = loans.findIndex((l) => l.id === id);
  if (index === -1) return undefined;
  loans[index] = {
    ...loans[index],
    actual_return_date: new Date().toISOString(),
    condition_in: conditionIn,
    notes: notes || loans[index].notes,
  };
  setItems(LOANS_KEY, loans);
  return loans[index];
}

export function deleteLoan(id: string): void {
  setItems(LOANS_KEY, getItems<Loan>(LOANS_KEY).filter((l) => l.id !== id));
}

// Stats
export function getStats() {
  const tools = getTools();
  const loans = getLoans();
  const activeLoans = loans.filter((l) => !l.actual_return_date);
  const totalValue = tools.reduce((sum, t) => sum + t.value, 0);
  const lentOutValue = activeLoans.reduce(
    (sum, l) => sum + (l.tool?.value || 0),
    0
  );
  const totalFees = loans.reduce((sum, l) => sum + l.fee_amount, 0);
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
