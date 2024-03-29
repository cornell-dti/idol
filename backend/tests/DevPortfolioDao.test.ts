import DevPortfolioDao from '../src/dao/DevPortfolioDao';
import { fakeDevPortfolio } from './data/createData';
import { devPortfolioCollection } from '../src/firebase';

const mockDP = fakeDevPortfolio();
const mockDP2 = fakeDevPortfolio();
const mockDP3 = fakeDevPortfolio();

const devPortfolioDao = new DevPortfolioDao();

beforeAll(async () => {
  await devPortfolioDao.createNewInstance(mockDP);
  await devPortfolioDao.createNewInstance(mockDP2);
  await devPortfolioDao.createNewInstance(mockDP3);
});

/* Cleanup database after running DevPortfolioDao tests */
afterAll(async () => {
  await devPortfolioCollection.doc(mockDP.uuid).delete();
  await devPortfolioCollection.doc(mockDP2.uuid).delete();
  await devPortfolioCollection.doc(mockDP3.uuid).delete();
});

// test('Make new submission', () => {
//   const mockSubmission = fakeDevPortfolioSubmission();
//   return DevPortfolioDao.makeDevPortfolioSubmission(mockDP.uuid, mockSubmission).then(
//     (submission) => expect(submission === mockSubmission)
//   );
// });

test('Get all instances', () =>
  devPortfolioDao.getAllInstances().then((allSubmissions) => {
    expect(allSubmissions.some((submission) => submission === mockDP));
    expect(allSubmissions.some((submission) => submission === mockDP2));
    expect(allSubmissions.some((submission) => submission === mockDP3));
  }));
