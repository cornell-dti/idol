import React, { useEffect, useState } from 'react';
import { Form, Segment, Label, Button, Dropdown } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
// import { DevPortfolio, DevPortfolioSubmission } from '../../../../../common-types/index';
import styles from './DevPortfolioForm.module.css';

const DevPortfolioForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  console.log(userInfo);

  const [devPortfolio, setDevPortfolio] = useState<DevPortfolio | undefined>(undefined);
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [openPR, setOpenPR] = useState('');
  const [reviewedPR, setReviewedPR] = useState('');

  useEffect(() => {
    DevPortfolioAPI.getAllDevPortfolios().then((devPortfolios) => setDevPortfolios(devPortfolios));
  }, []);

  const requestDevPortfolio = (
    devPortfolioRequest: DevPortfolioSubmission,
    devPortfolio: DevPortfolio
  ) => {
    devPortfolio?.submissions.push(devPortfolioRequest);
    DevPortfolioAPI.requestDevPortfolio(devPortfolio);
  };

  const submitDevPortfolio = () => {
    if (!devPortfolio) {
      Emitters.generalError.emit({
        headerMsg: 'No Dev Portfolio Selected',
        contentMsg: 'Please select a dev portfolio assignment!'
      });
    } else {
      const newDevPortfolioSubmission: DevPortfolioSubmission = {
        member: userInfo,
        openedPRs: [openPR],
        reviewedPRs: [reviewedPR],
        status: 'pending'
      };
      requestDevPortfolio(newDevPortfolioSubmission, devPortfolio);
      Emitters.generalSuccess.emit({
        headerMsg: 'Dev Portfolio Assignment submitted!',
        contentMsg: `The leads were notified of your submission and your submission will be graded soon!`
      });
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
            {devPortfolios && !devPortfolio ? (
              <Dropdown
                placeholder="Select a Portfolio Assignment: "
                fluid
                search
                selection
                options={devPortfolios.map((assignment) => ({
                  key: assignment.name,
                  text: assignment.deadline,
                  value: assignment.name
                }))}
                onChange={(_, data) =>
                  setDevPortfolio(devPortfolios.find((assignment) => assignment.name === data.key))
                }
              />
            ) : undefined}

            {devPortfolio ? (
              <div className={styles.row_direction}>
                <div>
                  <Segment>
                    <h4>{devPortfolio.name}</h4>
                    <Label>{`deadline: ${devPortfolio.deadline}`}</Label>
                  </Segment>
                </div>

                <Button
                  negative
                  onClick={() => {
                    setDevPortfolio(undefined);
                  }}
                  className={styles.inline}
                >
                  Clear
                </Button>
              </div>
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
