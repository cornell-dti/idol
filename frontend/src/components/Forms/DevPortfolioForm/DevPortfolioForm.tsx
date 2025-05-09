import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Button, Icon, Divider, TextArea, Message } from 'semantic-ui-react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';
import { DevPortfolioDashboard } from '../../Admin/DevPortfolio/AdminDevPortfolio';
import { useSelf } from '../../Common/FirestoreDataProvider';
import styles from './DevPortfolioForm.module.css';

const GITHUB_PR_REGEX = /.*github.com\/([._a-zA-Z0-9-]+)\/([._a-zA-Z0-9-]+)\/pull\/([0-9]+).*/;
const GITHUB_PERSONAL_REPO_REGEX = /.*github.com\/([._a-zA-Z0-9-]+)\/([._a-zA-Z0-9-]+)\/?$/;

const DevPortfolioForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const isTpm = userInfo.role === 'tpm';
  const isDevAdvisor = userInfo.role === 'dev-advisor';
  const isOpenedPROptional = isTpm || isDevAdvisor;

  const [devPortfolio, setDevPortfolio] = useState<DevPortfolio | undefined>(undefined);
  const [devPortfolios, setDevPortfolios] = useState<DevPortfolio[]>([]);
  const [openPRs, setOpenPRs] = useState(['']);
  const [reviewPRs, setReviewedPRs] = useState(['']);
  const [otherPRs, setOtherPRs] = useState(['']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitRepo, setIsSubmitRepo] = useState<boolean>(false);
  const [text, setText] = useState<string | undefined>(undefined);
  const [documentationText, setDocumentationText] = useState<string>('');
  const [openOther, setOpenOther] = useState(false);

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
          setDevPortfolio(undefined);
          setOpenPRs(['']);
          setReviewedPRs(['']);
          setOtherPRs(['']);
          setText('');
          setDocumentationText('');
          setOpenOther(false);
          setIsSubmitRepo(false);
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
    const finalPRs = openPRs.filter((pr) => pr !== '');
    const finalReviewedPRs = reviewPRs.filter((pr) => pr !== '');
    const finalOtherPRs = otherPRs.filter((pr) => pr !== '');
    const openedEmpty = !finalPRs[0] || finalPRs[0].length === 0;
    const reviewedEmpty = !finalReviewedPRs[0] || finalReviewedPRs[0].length === 0;
    const otherEmpty = !finalOtherPRs[0] || finalOtherPRs[0].length === 0;
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

    if (!isOpenedPROptional && otherEmpty && (openedEmpty || reviewedEmpty)) {
      Emitters.generalError.emit({
        headerMsg: 'No opened or reviewed PR url submitted',
        contentMsg: 'Please paste a link to a opened and reviewed PR!'
      });
    } else if (
      (!openedEmpty &&
        isSubmitRepo &&
        finalPRs.some((pr) => pr.match(GITHUB_PERSONAL_REPO_REGEX) === null)) ||
      (!openedEmpty &&
        !isSubmitRepo &&
        finalPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null)) ||
      (!reviewedEmpty && finalReviewedPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null)) ||
      (!otherEmpty && finalOtherPRs.some((pr) => pr.match(GITHUB_PR_REGEX) === null))
    ) {
      Emitters.generalError.emit({
        headerMsg: isSubmitRepo ? 'Invalid Personal Repository/PR Link' : 'Invalid PR Link',
        contentMsg: isSubmitRepo
          ? 'One or more links to Repos and PRs are not valid links.'
          : 'One or more links to PRs are not valid links.'
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
    } else if (!isDevAdvisor && !otherEmpty && textEmpty) {
      Emitters.generalError.emit({
        headerMsg: 'Explanation Empty',
        contentMsg: 'Please write an explanation for your other PR submission.'
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
        openedPRs: finalPRs.map((pr) => ({
          url: pr,
          status: 'pending'
        })),
        reviewedPRs: finalReviewedPRs.map((pr) => ({
          url: pr,
          status: 'pending'
        })),
        otherPRs: finalOtherPRs.map((pr) => ({
          url: pr,
          status: 'pending'
        })),
        status: 'pending',
        documentationText,
        ...(text && { text }),
        submitRepo: isSubmitRepo
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
                value={devPortfolio?.uuid ?? ''}
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
                do them. However, you must open at least 2 PR's in total during the entire semester.
              </p>
            </div>
          ) : (
            <></>
          )}
          <PRInputs
            prs={openPRs}
            setPRs={setOpenPRs}
            placeholder={isSubmitRepo ? 'Personal Repository' : 'Opened PR'}
            label={
              isSubmitRepo ? 'Personal Repository Github Link:' : 'Opened Pull Request Github Link:'
            }
            openOther={openOther}
            isRequired={!isOpenedPROptional}
            isRepo={isSubmitRepo}
            setRepo={setIsSubmitRepo}
          />
          <PRInputs
            prs={reviewPRs}
            setPRs={setReviewedPRs}
            placeholder="Reviewed PR"
            label="Reviewed Pull Request Github Link:"
            openOther={openOther}
            isRequired={!isDevAdvisor}
            isRepo={isSubmitRepo}
            setRepo={setIsSubmitRepo}
          />
          {isTpm ? (
            <></>
          ) : (
            <OtherPRInputs
              otherPRs={otherPRs}
              setOtherPRs={setOtherPRs}
              openOther={openOther}
              setOpenOther={setOpenOther}
              explanationText={text}
              setExplanationText={setText}
            />
          )}
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
      Documentation or Testing: <span className={styles.red_color}>*</span>
    </label>
    <p>
      Please provide a link to at least one piece of documentation or test(s) you added/updated. If
      it's included in the PRs you added above, you may simply write "Documentation located in PR
      (insert PR number here)" or "Testing located in PR (insert PR number here)". If you made a
      separate PR updating documentation/testing in the codebase, please link that PR here.
    </p>
    <TextArea value={documentationText} onChange={(e) => setDocumentationText(e.target.value)} />
  </div>
);

const PRInputs = ({
  prs,
  setPRs,
  label,
  placeholder,
  openOther,
  isRequired,
  isRepo,
  setRepo
}: {
  prs: string[];
  setPRs: React.Dispatch<React.SetStateAction<string[]>>;
  label: string;
  placeholder: string;
  openOther: boolean;
  isRequired: boolean;
  isRepo: boolean;
  setRepo: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <div className={styles.inline}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className={styles.bold}>
          {label} {isRequired && !openOther && <span className={styles.red_color}>*</span>}
        </label>
        {(placeholder === 'Opened PR' || placeholder === 'Personal Repository') && (
          <div
            onClick={() => {
              setRepo((prev) => !prev);
            }}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          >
            <Icon name={isRepo ? 'check square' : 'square outline'} size="small" />
            Submit personal repository
          </div>
        )}
      </div>

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
              <></>
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

const OtherPRInputs = ({
  otherPRs,
  setOtherPRs,
  openOther,
  setOpenOther,
  explanationText,
  setExplanationText
}: {
  otherPRs: string[];
  setOtherPRs: React.Dispatch<React.SetStateAction<string[]>>;
  openOther: boolean;
  setOpenOther: React.Dispatch<React.SetStateAction<boolean>>;
  explanationText: string | undefined;
  setExplanationText: React.Dispatch<React.SetStateAction<string | undefined>>;
}) => {
  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <div className={styles.inline}>
      <Icon
        className={styles.btnContainer}
        name={openOther ? 'angle down' : 'angle right'}
        onClick={() => setOpenOther(!openOther)}
      />
      <span className={styles.bold}>Other PRs</span>
      {openOther ? (
        <>
          <div className={styles.center_and_flex}>
            {' '}
            This section is only for submitting PR links when you believe you have an exception for
            one of the above requirements. Please submit the PR links, as well as an explanation for
            what the links are for and why you have this exception.{' '}
          </div>
          <br />
          <label className={styles.bold}>
            Other Pull Request Github Link: {<span className={styles.red_color}>*</span>}
          </label>
          {otherPRs.map((pr, index) => (
            <div className={styles.prInputContainer} key={index}>
              <input
                onKeyDown={keyDownHandler}
                type="text"
                onChange={(e) => {
                  setOtherPRs((prs) => {
                    const newPRs = [...prs];
                    newPRs[index] = e.target.value;
                    return newPRs;
                  });
                }}
                value={pr}
                placeholder={'Other PR'}
              />
              <div className={styles.btnContainer}>
                {otherPRs.length !== 1 ? (
                  <Button
                    icon
                    onClick={() => {
                      const rows = [...otherPRs];
                      rows.splice(index, 1);
                      setOtherPRs(rows);
                    }}
                  >
                    <Icon name="trash alternate" />
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
          <div className="row">
            <div className="col-sm-12">
              <button onClick={() => setOtherPRs([...otherPRs, ''])}>Add New</button>
            </div>
          </div>
          <div>
            <br />
            <label className={styles.bold}>
              Explanation: {<span className={styles.red_color}>*</span>}
            </label>
            <TextArea
              value={explanationText}
              onChange={(e) => setExplanationText(e.target.value)}
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default DevPortfolioForm;
