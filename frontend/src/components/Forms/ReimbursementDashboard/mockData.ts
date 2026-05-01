// Mock data used until the reimbursement APIs are wired up to the real Firestore.
// Types come from common-types/index.d.ts (ambient), so changes to those types
// will surface as compile errors here.

export const MOCK_USER_EMAIL = 'jdoe@cornell.edu';

export const mockReimbursementTeam: ReimbursementTeam = {
  teamId: 'design',
  teamName: 'Design',
  budget: 500,
  totalSpent: 100,
  assignedAdmins: ['lead@cornell.edu']
};

const dateOfPurchase = new Date('2026-02-25').getTime();
const dateSubmitted = new Date('2026-02-27').getTime();

export const mockReimbursementRequests: ReimbursementRequest[] = [
  {
    requestId: 'req-001',
    requesterId: MOCK_USER_EMAIL,
    requesterPhoneNumber: '1234567891',
    requesterAddress: '1234 Doe Ave',
    teamId: 'design',
    amount: 50,
    reason: 'Team social snacks',
    attendees: ['Alice', 'Bob', 'Charlie'],
    dateOfPurchase,
    dateSubmitted,
    status: 'approved',
    receiptUrl: '',
    messages: [],
    statusLog: [
      {
        status: 'pending',
        changedBy: MOCK_USER_EMAIL,
        changedAt: dateSubmitted,
        note: 'Submitted'
      },
      { status: 'approved', changedBy: 'lead@cornell.edu', changedAt: dateSubmitted, note: '' }
    ],
    isImmutable: false,
    resolvedAt: null
  },
  {
    requestId: 'req-002',
    requesterId: MOCK_USER_EMAIL,
    requesterPhoneNumber: '1234567891',
    requesterAddress: '1234 Doe Ave',
    teamId: 'design',
    amount: 50,
    reason: 'Figma plugin license',
    attendees: [],
    dateOfPurchase,
    dateSubmitted,
    status: 'pending',
    receiptUrl: '',
    messages: [],
    statusLog: [
      { status: 'pending', changedBy: MOCK_USER_EMAIL, changedAt: dateSubmitted, note: 'Submitted' }
    ],
    isImmutable: false,
    resolvedAt: null
  },
  {
    requestId: 'req-003',
    requesterId: MOCK_USER_EMAIL,
    requesterPhoneNumber: '1234567891',
    requesterAddress: '1234 Doe Ave',
    teamId: 'design',
    amount: 120,
    reason: 'Workshop supplies',
    attendees: [],
    dateOfPurchase,
    dateSubmitted,
    status: 'needs_changes',
    receiptUrl: '',
    messages: [
      {
        authorId: 'lead@cornell.edu',
        content: 'Please attach an itemized receipt.',
        sentAt: dateSubmitted
      }
    ],
    statusLog: [
      {
        status: 'pending',
        changedBy: MOCK_USER_EMAIL,
        changedAt: dateSubmitted,
        note: 'Submitted'
      },
      {
        status: 'needs_changes',
        changedBy: 'lead@cornell.edu',
        changedAt: dateSubmitted,
        note: 'Itemized receipt missing'
      }
    ],
    isImmutable: false,
    resolvedAt: null
  }
];
