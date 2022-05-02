import DevPortfolioDao from '../src/dao/DevPortfolioDao';
import { fakeDevPortfolio } from './data/createData';
import { devPortfolioCollection } from '../src/firebase';

const mockDP = fakeDevPortfolio();
const mockDP2 = fakeDevPortfolio();
const mockDP3 = fakeDevPortfolio();

beforeAll(async () => {
  await DevPortfolioDao.createNewInstance(mockDP);
  await DevPortfolioDao.createNewInstance(mockDP2);
  await DevPortfolioDao.createNewInstance(mockDP3);
});

/* Cleanup database after running DevPortfolioDao tests */
afterAll(async () => {
  await devPortfolioCollection.doc(mockDP.uuid).delete();
  await devPortfolioCollection.doc(mockDP2.uuid).delete();
  await devPortfolioCollection.doc(mockDP3.uuid).delete();
});

// test('Make new submission', () => {
//   const mockDPSubmission = mockDPSubmissions.dp1 as DevPortfolioSubmission;
//   return DevPortfolioDao.makeDevPortfolioSubmission(mockDP.uuid, mockDPSubmission).then((submission) => {
//       expect(submission.status !== 'pending');
//     });
// });

test('Create new instances and get all instances', () => {
  DevPortfolioDao.createNewInstance(mockDP);
  DevPortfolioDao.createNewInstance(mockDP2);
  DevPortfolioDao.createNewInstance(mockDP3);
  return DevPortfolioDao.getAllInstances().then((allSubmissions) => {
    expect(allSubmissions.length === 3);
    expect(allSubmissions.find((submission) => submission === mockDP));
  });
});
