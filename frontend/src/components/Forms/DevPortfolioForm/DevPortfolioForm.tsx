import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Button, Icon, Divider, TextArea, Message } from 'semantic-ui-react';
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
  const isTpm = userInfo.role === 'tpm';

  const [devPortfolio, setDevPortfolio] = useState<DevPortfolio | undefined>(undefined);
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [openPRs, setOpenPRs] = useState(['']);
  const [reviewPRs, setReviewedPRs] = useState(['']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [text, setText] = useState<string | undefined>(undefined);
  const [documentationText, setDocumentationText] = useState<string>('');

  useEffect(() => {
    refreshDevPortfolios();
  }, []);

  const sendSubmissionRequest = async (
    devPortfolioRequest: DevPortfolioSubmission,
    devPortfolio: DevPortfolio
  ) => {
    await DevPortfolioAPI.makeDevPortfolioSubmission(devPortfolio.uuid, devPortfolioRequest).then(
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
    DevPortfolioAPI.getAllDevPortfolioInfo().then((allDevPortfolioInfo) => {
      setIsLoading(false);
      setDevPortfolios(
        allDevPortfolioInfo
          .map((devPortfolioInfo) => devPortfolioInfo as DevPortfolio)
          .filter((devPortfolio) => devPortfolio.earliestValidDate <= Date.now())
      );
    });
  };

  const submitDevPortfolio = () => {
    const openedEmpty = !openPRs[0] || openPRs[0].length === 0;
    const reviewedEmpty = !reviewPRs[0] || reviewPRs[0].length === 0;
    const textEmpty = !text;

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

    if (!isTpm && (openedEmpty || reviewedEmpty)) {
      Emitters.generalError.emit({
        headerMsg: 'No opened or reviewed PR url submitted',
        contentMsg: 'Please paste a link to a opened and reviewed PR!'
      });
    } else if (
      (!openedEmpty && openPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null)) ||
      (!reviewedEmpty && reviewPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null))
    ) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid PR link',
        contentMsg: 'One or more links to PRs are not valid links.'
      });
    } else if (isTpm && textEmpty) {
      Emitters.generalError.emit({
        headerMsg: 'Paragraph Submission Empty',
        contentMsg: 'Please write something for the paragraph section of the assignment.'
      });
    } else if (!documentationText) {
      Emitters.generalError.emit({
        headerMsg: 'Documentation Empty',
        contentMsg: 'Please write something for the documentation section of the assignment.'
      });
    } else if (new Date(latestDeadline) < new Date()) {
      Emitters.generalError.emit({
        headerMsg: 'The deadline for this dev portfolio has passed',
        contentMsg: 'Please select another dev portfolio.'
      });
    } else if (new Date(devPortfolio.earliestValidDate) > new Date()) {
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
        })),
        status: 'pending',
        documentationText,
        ...(text && { text })
      };
      sendSubmissionRequest(newDevPortfolioSubmission, devPortfolio);
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
                value={devPortfolio?.uuid}
                options={devPortfolios
                  .sort((a, b) => a.deadline - b.deadline)
                  .map((assignment) => ({
                    key: assignment.uuid,
                    text: `${assignment.name} (Due:  ${new Date(
                      assignment.deadline
                    ).toDateString()}) ${
                      assignment.lateDeadline
                        ? `(Late Due: ${new Date(assignment.lateDeadline).toDateString()})`
                        : ''
                    }`,
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

          {isTpm ? (
            <div className={styles.inline}>
              <label className={styles.bold}>
                Paragraph Response: <span className={styles.red_color}>*</span>
              </label>
              <p>
                Since you are a technical project manager, your portfolio needs to include 1-2
                paragraphs with the following information: <br />
                1. What did you personally do these past two weeks?
                <br />
                2. What did the team do the past two weeks?
              </p>

              <TextArea value={text} onChange={(e) => setText(e.target.value)} />

              <p>
                In addition, if you have created and/or reviewed pull requests, please include those
                links. There is no required minimum or maximum but please do include them when you
                do them.
              </p>
            </div>
          ) : (
            <></>
          )}
          <PRInputs
            prs={openPRs}
            setPRs={setOpenPRs}
            placeholder="Opened PR"
            label="Opened Pull Request Github Link:"
            isTpm={isTpm}
          />
          <PRInputs
            prs={reviewPRs}
            setPRs={setReviewedPRs}
            placeholder="Reviewed PR"
            label="Reviewed Pull Request Github Link:"
            isTpm={isTpm}
          />
          <DocumentationInput
            setDocumentationText={setDocumentationText}
            documentationText={documentationText}
          />
        </div>
        <Message info>
          <Message.Header>Please note</Message.Header>
          Additional submissions to a dev portfolio assignment <b>replace</b> previous submissions
          with respect to grading.
        </Message>
        <Form.Button floated="right" onClick={submitDevPortfolio}>
          Submit
        </Form.Button>
      </Form>

      <div className={styles.dashboard}>
        <Divider />
        <DevPortfolioDashboard
          isLoading={isLoading}
          devPortfolios={devPortfolios}
          setDevPortfolios={setDevPortfolios}
          setIsLoading={setIsLoading}
          isAdminView={false}
        />
      </div>
    </div>
  );
};

const DocumentationInput = ({
  documentationText,
  setDocumentationText
}: {
  documentationText: string;
  setDocumentationText: React.Dispatch<React.SetStateAction<string>>;
}) => (
  <div>
    <label className={styles.bold}>
      Documentation: <span className={styles.red_color}>*</span>
    </label>
    <p>Please provide a link to at least one piece of documentation you added/updated.</p>
    <TextArea value={documentationText} onChange={(e) => setDocumentationText(e.target.value)} />
  </div>
);

const PRInputs = ({
  prs,
  setPRs,
  label,
  placeholder,
  isTpm
}: {
  prs: string[];
  setPRs: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  placeholder: string;
  isTpm: boolean;
}) => {
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <div className={styles.inline}>
      <label className={styles.bold}>
        {label} {!isTpm && <span className={styles.red_color}>*</span>}
      </label>
      {prs.map((pr, index) => (
        <div className={styles.prInputContainer} key={index}>
          <input
            onKeyDown={keyDownHandler}
            type="text"
            onChange={(e) => {
              setPRs((prs) => {
                const newPRs = [...prs];
                newPRs[index] = e.target.value;
                return newPRs;
              });
            }}
            value={pr}
            placeholder={placeholder}
          />
          <div className={styles.btnContainer}>
            {prs.length !== 1 ? (
              <Button
                icon
                onClick={() => {
                  const rows = [...prs];
                  rows.splice(index, 1);
                  setPRs(rows);
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
          <button onClick={() => setPRs([...prs, ''])}>Add New</button>
        </div>
      </div>
    </div>
  );
};

export default DevPortfolioForm;
