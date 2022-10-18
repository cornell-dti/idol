import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Button, Icon, Divider } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import { DevPortfolioDashboard } from '../../Admin/DevPortfolio/AdminDevPortfolio';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './DevPortfolioForm.module.css';

const GITHUB_PR_REGEX = /.*github.com\/([._a-zA-Z0-9-]+)\/([._a-zA-Z0-9-]+)\/pull\/([0-9]+).*/;

const DevPortfolioForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;

  const [devPortfolio, setDevPortfolio] = useState<DevPortfolio | undefined>(undefined);
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [openPRs, setOpenPRs] = useState(['']);
  const [reviewPRs, setReviewedPRs] = useState(['']);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    refreshDevPortfolios();
  }, []);

  const sendSubmissionRequest = (
    devPortfolioRequest: DevPortfolioSubmission,
    devPortfolio: DevPortfolio
  ) => {
    DevPortfolioAPI.makeDevPortfolioSubmission(devPortfolio.uuid, devPortfolioRequest).then(
      (val) => {
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
          refreshDevPortfolios();
        }
      }
    );
  };

  const refreshDevPortfolios = () => {
    setIsLoading(true);
    DevPortfolioAPI.getAllDevPortfolios(false).then((devPortfolios) => {
      setIsLoading(false);
      setDevPortfolios(devPortfolios);
    });
  };

  const submitDevPortfolio = () => {
    if (!devPortfolio) {
      Emitters.generalError.emit({
        headerMsg: 'No Dev Portfolio selected',
        contentMsg: 'Please select a dev portfolio assignment!'
      });
      return;
    }
    const latestDeadline = devPortfolio.lateDeadline
      ? devPortfolio.lateDeadline
      : devPortfolio?.deadline;
    if (!openPRs[0] || openPRs[0].length === 0 || !reviewPRs[0] || reviewPRs[0].length === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No opened or reviewed PR url submitted',
        contentMsg: 'Please paste a link to a opened and reviewed PR!'
      });
    } else if (
      openPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null) ||
      reviewPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null)
    ) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid PR link',
        contentMsg: 'One or more links to PRs are not valid links.'
      });
    } else if (new Date(latestDeadline) < new Date()) {
      Emitters.generalError.emit({
        headerMsg: 'The deadline for this dev portfolio has passed',
        contentMsg: 'Please select another dev portfolio.'
      });
    } else if (new Date(latestDeadline) > new Date()) {
      Emitters.generalError.emit({
        headerMsg: 'This dev portfolio is not open yet',
        contentMsg: 'Please select another dev portfolio.'
      });
    } else {
      const newDevPortfolioSubmission: DevPortfolioSubmission = {
        member: userInfo,
        openedPRs: openPRs.map((pr) => ({
          url: pr,
          status: 'pending'
        })),
        reviewedPRs: reviewPRs.map((pr) => ({
          url: pr,
          status: 'pending'
        }))
      };
      sendSubmissionRequest(newDevPortfolioSubmission, devPortfolio);
      setDevPortfolio(undefined);
      setOpenPRs(['']);
      setReviewedPRs(['']);
    }
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
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
                onKeyDown={keyDownHandler}
                placeholder="Select a Portfolio Assignment: "
                fluid
                search
                selection
                options={devPortfolios
                  .sort((a, b) => a.deadline - b.deadline)
                  .map((assignment) => ({
                    key: assignment.uuid,
                    text: `${assignment.name} (Due:  ${new Date(
                      assignment.deadline
                    ).toDateString()})`,
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
            <label className={styles.bold}>
              Opened Pull Request Github Link: <span className={styles.red_color}>*</span>
            </label>
            {openPRs.map((openPR, index) => (
              <div className={styles.prInputContainer} key={index}>
                <input
                  onKeyDown={keyDownHandler}
                  type="text"
                  onChange={(e) => {
                    setOpenPRs((prs) => {
                      const newOpenPRs = [...prs];
                      newOpenPRs[index] = e.target.value;
                      return newOpenPRs;
                    });
                  }}
                  value={openPR}
                  name="openPR"
                  placeholder="Opened PR"
                />
                <div className={styles.btnContainer}>
                  {openPRs.length !== 1 ? (
                    <Button
                      icon
                      onClick={() => {
                        const rows = [...openPRs];
                        rows.splice(index, 1);
                        setOpenPRs(rows);
                      }}
                    >
                      <Icon name="trash alternate" />
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}
            <div className="row">
              <div className="col-sm-12">
                <button onClick={() => setOpenPRs([...openPRs, ''])}>Add New</button>
              </div>
            </div>
          </div>

          <div className={styles.inline}>
            <label className={styles.bold}>
              Reviewed Pull Request Github Link: <span className={styles.red_color}>*</span>
            </label>
            {reviewPRs.map((reviewPR, index) => (
              <div className={styles.prInputContainer} key={index}>
                <input
                  onKeyDown={keyDownHandler}
                  type="text"
                  onChange={(e) => {
                    setReviewedPRs((prs) => {
                      const newReviewPRs = [...prs];
                      newReviewPRs[index] = e.target.value;
                      return newReviewPRs;
                    });
                  }}
                  value={reviewPR}
                  name="reviewedPR"
                  placeholder="Reviewed PR"
                />
                <div className={styles.btnContainer}>
                  {reviewPRs.length !== 1 ? (
                    <Button
                      icon
                      onClick={() => {
                        const rows = [...reviewPRs];
                        rows.splice(index, 1);
                        setReviewedPRs(rows);
                      }}
                    >
                      <Icon name="trash alternate" />
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}
            <div className="row">
              <div className="col-sm-12">
                <button onClick={() => setReviewedPRs([...reviewPRs, ''])}>Add New</button>
              </div>
            </div>
          </div>
        </div>

        <Form.Button floated="right" onClick={submitDevPortfolio}>
          Submit
        </Form.Button>
      </Form>

      <div className={styles.dashboard}>
        <Divider />
        <DevPortfolioDashboard
          isLoading={isLoading}
          devPortfolios={devPortfolios.filter((portfolio) => portfolio.submissions.length)}
          setDevPortfolios={setDevPortfolios}
          setIsLoading={setIsLoading}
          isAdminView={false}
        />
      </div>
    </div>
  );
};

export default DevPortfolioForm;
