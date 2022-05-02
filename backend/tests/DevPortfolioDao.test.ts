import DevPortfolioDao from '../src/dao/DevPortfolioDao';
import { fakeDevPortfolio, fakeDevPortfolioSubmission } from './data/createData';
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

test('Make new submission', () =>
  DevPortfolioDao.makeDevPortfolioSubmission(mockDP.uuid, fakeDevPortfolioSubmission).then(
    (submission) => expect(submission.status !== 'pending')
  ));

test('Create new instances and get all instances', () =>
  DevPortfolioDao.getAllInstances().then((allSubmissions) => {
    expect(allSubmissions.some((submission) => submission === mockDP));
    expect(allSubmissions.some((submission) => submission === mockDP2));
    expect(allSubmissions.some((submission) => submission === mockDP3));
  }));
