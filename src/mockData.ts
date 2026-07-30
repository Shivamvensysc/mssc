export interface Candidate {
  id: string;
  name: string;
  email: string;
  applicationNumber: string;
  phone: string;
  status: string;
}

export const MOCK_CANDIDATES: Candidate[] = [
  { id: "1", name: "John Doe", email: "john@example.com", applicationNumber: "APP-001", phone: "9876543210", status: "Approved" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", applicationNumber: "APP-002", phone: "8765432109", status: "Pending" },
  { id: "3", name: "Alice Johnson", email: "alice@example.com", applicationNumber: "APP-003", phone: "7654321098", status: "Rejected" },
  { id: "4", name: "Bob Brown", email: "bob@example.com", applicationNumber: "APP-004", phone: "6543210987", status: "Pending" },
];