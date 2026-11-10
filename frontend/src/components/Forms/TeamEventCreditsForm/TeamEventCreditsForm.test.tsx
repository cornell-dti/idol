import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import ImagesAPI from '../../../API/ImagesAPI';
import TecConfigAPI from '../../../API/TecConfigAPI';
import { Emitters } from '../../../utils';
import TeamEventCreditForm from './TeamEventCreditsForm';

jest.mock('../../Common/FirestoreDataProvider', () => ({
  useSelf: () => ({ email: 'cw945@cornell.edu', role: 'developer' })
}));
jest.mock('../../../API/TeamEventsAPI');
jest.mock('../../../API/ImagesAPI');
jest.mock('../../../API/TecConfigAPI');

test('keeps only failed proofs available to retry after a partial submission', async () => {
  const events = TeamEventsAPI as jest.Mocked<typeof TeamEventsAPI>;
  const images = ImagesAPI as jest.Mocked<typeof ImagesAPI>;
  const config = TecConfigAPI as jest.Mocked<typeof TecConfigAPI>;
  events.getAllTeamEventInfo.mockResolvedValue([
    {
      name: 'Team lunch',
      date: '2026-10-01',
      numCredits: '1',
      maxCredits: '2',
      hasHours: false,
      isInitiativeEvent: false,
      uuid: 'event-1'
    }
  ]);
  events.getTeamEventAttendanceByUser.mockResolvedValue([]);
  config.getTecConfig.mockResolvedValue({
    periodEndDates: ['2099-12-31'],
    requiredMemberTecCredits: 2,
    requiredLeadTecCredits: 2,
    considerEventKind: false,
    requiredMemberInternalTecCredits: 0,
    requiredMemberExternalTecCredits: 0,
    requiredLeadInternalTecCredits: 0,
    requiredLeadExternalTecCredits: 0
  });
  images.uploadImage.mockResolvedValue(undefined);
  images.getImage.mockResolvedValue('https://example.com/proof.jpg');
  events.requestTeamEventCredit
    .mockImplementationOnce(async (request) => ({ ...request, uuid: 'request-1' }))
    .mockRejectedValueOnce(new Error('Could not submit credit request'))
    .mockImplementationOnce(async (request) => ({ ...request, uuid: 'request-2' }));

  const error = jest.spyOn(Emitters.generalError, 'emit');
  const success = jest.spyOn(Emitters.generalSuccess, 'emit');
  const failedFile = new File(['second'], 'second.png', { type: 'image/png' });

  try {
    const { container } = render(<TeamEventCreditForm />);
    fireEvent.click(await screen.findByText('Select a Team Event'));
    fireEvent.click(await screen.findByText('Team lunch'));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    const [first, second] = Array.from(container.querySelectorAll('input[type="file"]'));
    fireEvent.change(first, {
      target: { files: [new File(['first'], 'first.png', { type: 'image/png' })] }
    });
    fireEvent.change(second, { target: { files: [failedFile] } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(success).not.toHaveBeenCalled();
    expect(Array.from(container.querySelectorAll('input[type="file"]'))).toEqual([second]);
    const failedProof = events.requestTeamEventCredit.mock.calls[1][0].image;

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => expect(success).toHaveBeenCalledTimes(1));
    expect(events.requestTeamEventCredit).toHaveBeenCalledTimes(3);
    expect(events.requestTeamEventCredit).toHaveBeenLastCalledWith(
      expect.objectContaining({ image: failedProof })
    );
    expect(images.uploadImage).toHaveBeenLastCalledWith(failedFile, failedProof, {
      throwOnError: true
    });
  } finally {
    error.mockRestore();
    success.mockRestore();
  }
});
