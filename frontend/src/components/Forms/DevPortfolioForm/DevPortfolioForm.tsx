import React, { useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './DevPortfolioForm.module.css';

const DevPortfolioForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;

  const devPortfolios: DevPortfolio[] = [
    {
      name: 'test 1',
      deadline: Date.parse('06 May 2022 00:00:00 GMT'),
      earliestValidDate: Date.parse('01 May 2022 00:00:00 GMT'),
      submissions: [],
      uuid: 'xyz'
    },
    {
      name: 'test 2',
      deadline: Date.parse('20 Jan 2022 00:00:00 GMT'),
      earliestValidDate: Date.parse('01 Jan 2022 00:00:00 GMT'),
      submissions: [],
      uuid: 'abc'
    },
    {
      name: 'test abc',
      deadline: Date.parse('30 Dec 2022 00:00:00 GMT'),
      earliestValidDate: Date.parse('20 Nov 2022 00:00:00 GMT'),
      submissions: [],
      uuid: '123'
    }
  ];

  const [devPortfolio, setDevPortfolio] = useState<DevPortfolio | undefined>(undefined);
  // const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [openPR, setOpenPR] = useState('');
  const [reviewedPR, setReviewedPR] = useState('');

  // useEffect(() => {
  //   DevPortfolioAPI.getAllDevPortfolios().then((devPortfolios) => setDevPortfolios(devPortfolios));
  // }, []);

  const requestDevPortfolio = (
    devPortfolioRequest: DevPortfolioSubmission,
    devPortfolio: DevPortfolio
  ) => {
    devPortfolio?.submissions.push(devPortfolioRequest);
    DevPortfolioAPI.requestDevPortfolio(devPortfolio).then((val) => {
      if (val.error) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't submit dev assignment!",
          contentMsg: val.error
        });
      } else {
        Emitters.generalSuccess.emit({
          headerMsg: 'Dev Portfolio Assignment submitted!',
          contentMsg: `The leads were notified of your submission and your submission will be graded soon!`
        });
      }
    });
  };

  const submitDevPortfolio = () => {
    if (!devPortfolio) {
      Emitters.generalError.emit({
        headerMsg: 'No Dev Portfolio selected',
        contentMsg: 'Please select a dev portfolio assignment!'
      });
    } else if (!openPR || !reviewedPR) {
      Emitters.generalError.emit({
        headerMsg: 'No opened or reviewed PR url submitted',
        contentMsg: 'Please paste a link to a opened or reviewed PR!'
      });
    } else {
      const newDevPortfolioSubmission: DevPortfolioSubmission = {
        member: userInfo,
        openedPRs: [{ url: openPR, status: 'pending' }],
        reviewedPRs: [{ url: reviewedPR, status: 'pending' }]
      };
      requestDevPortfolio(newDevPortfolioSubmission, devPortfolio);
      setDevPortfolio(undefined);
      setOpenPR('');
      setReviewedPR('');
    }
  };

  return (
    <div>
      <Form className={styles.form_style}>
        <h1>Submit Dev Portfolio Assignment</h1>
        <p>Submit the recent pull requests you have opened or reviewed here.</p>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Select a Dev Portfolio Assignment <span className={styles.red_color}>*</span>
          </label>
          <div className={styles.center_and_flex}>
            {devPortfolios ? (
              <Dropdown
                placeholder="Select a Portfolio Assignment: "
                fluid
                search
                selection
                options={devPortfolios.map((assignment) => ({
                  key: assignment.uuid,
                  text: assignment.name,
                  value: assignment.uuid
                }))}
                onChange={(_, data) => {
                  setDevPortfolio(
                    devPortfolios.find((assignment) => assignment.uuid === data.value)
                  );
                }}
              />
            ) : undefined}
          </div>

          <div className={styles.inline}>
            <Form.Input
              fluid
              label="Opened Pull Request Github Link: "
              value={openPR}
              onChange={(assignment) => setOpenPR(assignment.target.value)}
              required
            />
          </div>

          <div className={styles.inline}>
            <Form.Input
              fluid
              label="Reviewed Pull Request Github Link: "
              value={reviewedPR}
              onChange={(assignment) => setReviewedPR(assignment.target.value)}
              required
            />
          </div>
        </div>

        <Form.Button floated="right" onClick={submitDevPortfolio}>
          Submit
        </Form.Button>
      </Form>
    </div>
  );
};

export default DevPortfolioForm;
