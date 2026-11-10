import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import APIWrapper from '../../../API/APIWrapper';
import { Emitters } from '../../../utils';
import TeamEventCreditDashboard from './TeamEventsCreditDashboard';

jest.mock('../../../components/Common/FirestoreDataProvider', () => ({ useSelf: () => null }));
jest.mock('../../../API/APIWrapper', () => ({ get: jest.fn(), delete: jest.fn() }));

const attendance: TeamEventAttendance = {
  uuid: 'request-1',
  member: {
    netid: 'cw945',
    email: 'cw945@cornell.edu',
    firstName: 'Casey',
    lastName: 'Wang',
    pronouns: '',
    semesterJoined: '',
    graduation: '',
    major: '',
    hometown: '',
    about: '',
    subteams: [],
    role: 'developer',
    roleDescription: 'Developer'
  },
  eventUuid: 'event-1',
  image: 'eventProofs/cw945/proof',
  status: 'pending',
  reason: ''
};

function Dashboard() {
  const [pendingAttendance, setPendingAttendance] = useState([attendance]);
  return (
    <TeamEventCreditDashboard
      allTEC={[]}
      approvedAttendance={[]}
      pendingAttendance={pendingAttendance}
      rejectedAttendance={[]}
      isAttendanceLoading={false}
      setPendingAttendance={setPendingAttendance}
      requiredPeriodCredits={0}
      tecCounts={[]}
      tecDeadlines={[]}
      tecConfig={{
        periodEndDates: [],
        requiredMemberTecCredits: 0,
        requiredLeadTecCredits: 0,
        considerEventKind: false,
        requiredMemberInternalTecCredits: 0,
        requiredMemberExternalTecCredits: 0,
        requiredLeadInternalTecCredits: 0,
        requiredLeadExternalTecCredits: 0
      }}
      remainingInternalCredits={0}
      remainingExternalCredits={0}
      internalCounts={[]}
      externalCounts={[]}
    />
  );
}

test('closes cancellation after deleting the request even if proof cleanup fails', async () => {
  const api = APIWrapper as jest.Mocked<typeof APIWrapper>;
  api.get.mockResolvedValue({ data: { url: 'https://example.com/proof.jpg' } });
  api.delete
    .mockResolvedValueOnce({ data: { error: 'Could not delete request' }, status: 500 })
    .mockResolvedValueOnce({ data: {}, status: 200 })
    .mockResolvedValueOnce({ data: { error: 'Could not delete image' }, status: 500 });
  const warning = jest.spyOn(Emitters.generalError, 'emit');

  render(<Dashboard />);
  fireEvent.click(screen.getByRole('tab', { name: 'Pending' }));
  fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  const dialog = within(screen.getByRole('dialog'));
  fireEvent.click(dialog.getByRole('button', { name: 'Cancel request' }));

  expect(await dialog.findByRole('alert')).toHaveTextContent('Could not cancel the request');
  expect(api.delete).toHaveBeenCalledTimes(1);
  fireEvent.click(dialog.getByRole('button', { name: 'Cancel request' }));

  expect(await screen.findByText('No pending requests yet.')).toBeInTheDocument();
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(api.delete).toHaveBeenLastCalledWith(
    expect.stringContaining(`/image/${attendance.image}`)
  );
  expect(warning).toHaveBeenCalledWith({
    headerMsg: 'Credit request cancelled',
    contentMsg: 'Your request was cancelled, but we could not remove the proof image.'
  });
  warning.mockRestore();
});
