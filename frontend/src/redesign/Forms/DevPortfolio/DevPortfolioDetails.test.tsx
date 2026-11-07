import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import DevPortfolioDetails from './DevPortfolioDetails';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';

jest.mock('../../BreadcrumbContext', () => ({ useBreadcrumbTitle: jest.fn() }));
jest.mock('../../../API/DevPortfolioAPI', () => ({
  __esModule: true,
  default: { getDevPortfolioInfo: jest.fn(), getUsersDevPortfolioSubmissions: jest.fn() }
}));
const info = DevPortfolioAPI.getDevPortfolioInfo as jest.Mock;
const submissions = DevPortfolioAPI.getUsersDevPortfolioSubmissions as jest.Mock;
const assignment: DevPortfolioInfo = {
  uuid: 'test-portfolio',
  name: 'Portfolio test',
  earliestValidDate: Date.now() - 1000,
  deadline: Date.now() + 86400000,
  lateDeadline: null
};
const base: DevPortfolioSubmission = {
  member: { firstName: 'Test', lastName: 'Member', netid: 'test1' } as IdolMember,
  openedPRs: [],
  reviewedPRs: [],
  otherPRs: [],
  status: 'pending',
  documentationText: 'Original documentation'
};
beforeEach(() => {
  jest.clearAllMocks();
  info.mockResolvedValue(assignment);
  submissions.mockResolvedValue([
    base,
    {
      ...base,
      status: 'valid',
      documentationText: 'Updated documentation',
      text: 'Exception explanation'
    }
  ]);
});
beforeAll(() => {
  Object.defineProperty(window, 'PointerEvent', { configurable: true, value: MouseEvent });
});
afterAll(() => {
  Reflect.deleteProperty(window, 'PointerEvent');
});
test('member detail shows their submissions newest first and offers read-only detail actions', async () => {
  render(<DevPortfolioDetails uuid={assignment.uuid} />);
  await screen.findByText('Your submissions');
  const table = screen.getByRole('table', { name: 'Portfolio test submissions' });
  const rows = within(table).getAllByRole('row');
  expect(rows).toHaveLength(3);
  expect(within(rows[1]).getByText('Updated documentation')).toBeInTheDocument();
  expect(within(rows[1]).getByText('Latest')).toBeInTheDocument();
  fireEvent.click(within(rows[1]).getByRole('button', { name: 'View details' }));
  const dialog = await screen.findByRole('dialog');
  expect(within(dialog).getByText('Exception explanation')).toBeInTheDocument();
  expect(within(dialog).getByText('Updated documentation')).toBeInTheDocument();
  expect(screen.queryByText('Regrade all')).not.toBeInTheDocument();
  expect(screen.queryByText('Export CSV')).not.toBeInTheDocument();
  expect(info).toHaveBeenCalledWith(assignment.uuid);
  expect(submissions).toHaveBeenCalledWith(assignment.uuid);
});
test('an empty assignment offers a consumer submission action', async () => {
  submissions.mockResolvedValue([]);
  render(<DevPortfolioDetails uuid={assignment.uuid} />);
  await screen.findByText('No submissions yet');
  expect(screen.getByRole('link', { name: 'Go to submission form' })).toHaveAttribute(
    'href',
    `/forms/devPortfolio?assignment=${assignment.uuid}`
  );
});
