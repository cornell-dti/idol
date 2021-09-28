import React, { useEffect, useState } from 'react';
import { Button, Card, CardGroup, Loader, Modal } from 'semantic-ui-react';
import ReactMarkdown from 'react-markdown';
import { useUserEmail } from '../Common/UserProvider';
import { Member, MembersAPI } from '../../API/MembersAPI';
import { Emitters } from '../../utils';
import { backendURL } from '../../environment';
import styles from './SiteDeployer.module.css';
import APIWrapper from '../../API/APIWrapper';
import PermissionsAPI from '../../API/PermissionsAPI';
import 'prismjs/themes/prism.css';

require('prismjs');

const SiteDeployer: React.FC = () => {
  const userEmail = useUserEmail();

  const getUser = async (email: string): Promise<Member> => {
    const mem = await MembersAPI.getMember(email);
    return mem;
  };

  const [isLoading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<{ body: string }[]>([]);

  const loadPullRequests = () => {
    APIWrapper.get(`${backendURL}/getIDOLChangesPR`).then((resp) => {
      if (!resp.data.pr) {
        setPullRequests([]);
        setLoading(false);
        return;
      }
      setPullRequests([resp.data.pr]);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail)
        .then(async (mem) => {
          if (!((await PermissionsAPI.isAdmin().catch((err) => false)) || mem.role === 'lead')) {
            Emitters.generalError.emit({
              headerMsg: 'Access Denied',
              contentMsg: `Insufficient permissions.`
            });
          } else {
            loadPullRequests();
          }
        })
        .catch((error) => {
          Emitters.generalError.emit({
            headerMsg: "Couldn't get member! Refresh the page if you believe this is an error.",
            contentMsg: `Error was: ${error}`
          });
        });
    }
  }, [userEmail]);

  const onClickAccept = () => {
    setLoading(true);
    APIWrapper.post(`${backendURL}/acceptIDOLChanges`, {}).then((resp) => {
      if (resp.data.merged) {
        setPullRequests([]);
      } else {
        Emitters.generalError.emit({
          headerMsg: "Couldn't accept IDOL changes PR!",
          contentMsg: resp.data.error
        });
      }
      setLoading(false);
    });
  };

  const onClickReject = () => {
    setLoading(true);
    APIWrapper.post(`${backendURL}/rejectIDOLChanges`, {}).then((resp) => {
      if (resp.data.closed) {
        setPullRequests([]);
      } else {
        Emitters.generalError.emit({
          headerMsg: "Couldn't reject IDOL changes PR!",
          contentMsg: resp.data.error
        });
      }
      setLoading(false);
    });
  };

  const onClickRefresh = () => {
    setLoading(true);
    loadPullRequests();
  };

  const PRToCard = (pullRequest: { body: string }, key: number) => {
    const fullText = pullRequest.body;
    const diffSplit = fullText.split('@@');
    const atSplitRes = [
      diffSplit.shift() as string,
      diffSplit.filter((v) => v !== '').join('@@') as string
    ];
    const afterDiffSplit = atSplitRes[1].split('`');
    const afterSplitRes = [
      (afterDiffSplit.shift() as string).trim(),
      afterDiffSplit.filter((v) => v !== '').join('`') as string
    ];
    const diffs = `@@ ${afterSplitRes[0]}`.split('\n').map((l) => {
      const line = `${l}\n`;
      if (line.startsWith('@@')) {
        return <span style={{ backgroundColor: 'rgba(0,0,255,0.2)' }}>{line}</span>;
      }
      if (line.startsWith('+')) {
        return <span style={{ backgroundColor: 'rgba(0,255,0,0.2)' }}>{line}</span>;
      }
      if (line.startsWith('-')) {
        return <span style={{ backgroundColor: 'rgba(255,0,0,0.2)' }}>{line}</span>;
      }
      return line;
    });
    const rest = afterSplitRes[1].trim();

    return (
      <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }} key={key}>
        <Card.Content>
          <h2>Diffs</h2>
          <pre className="language-diff-json diff-highlight">
            <code className="language-diff-json diff-highlight">{diffs}</code>
          </pre>
        </Card.Content>
        <Card.Content>
          <ReactMarkdown>{rest}</ReactMarkdown>
        </Card.Content>
        <Card.Content extra>
          <div className="ui one buttons" style={{ width: '100%' }}>
            <Button
              basic
              color="green"
              onClick={() => {
                onClickAccept();
              }}
            >
              Accept & Deploy
            </Button>
            <Button
              basic
              color="red"
              onClick={() => {
                onClickReject();
              }}
            >
              Reject Changes
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  };

  const onTriggerPullFromIDOL = () => {
    APIWrapper.post(`${backendURL}/pullIDOLChanges`, {}).then((resp) => {
      if (resp.data.updated) {
        Emitters.generalSuccess.emit({
          headerMsg: 'pull-from-idol workflow triggered!',
          contentMsg: `Our github bot is now chugging away migrating our data changes!`,
          child: (
            <Modal.Content>
              <p>
                Come monitor it over on{' '}
                <a href="https://github.com/cornell-dti/idol/actions?query=workflow%3A%22Pull+from+IDOL%22">
                  our github!
                </a>
              </p>
            </Modal.Content>
          )
        });
      } else {
        Emitters.generalError.emit({
          headerMsg: "Couldn't trigger the pull-from-idol workflow!",
          contentMsg: resp.data.error
        });
      }
    });
  };

  const TopButtons = () => (
    <div className="ui one buttons" style={{ marginBottom: '2rem' }}>
      <Button
        basic
        color="blue"
        onClick={() => {
          onTriggerPullFromIDOL();
        }}
      >
        Pull Changes From IDOL
      </Button>
      <Button
        basic
        color="purple"
        onClick={() => {
          onClickRefresh();
        }}
      >
        Refresh UI
      </Button>
    </div>
  );

  const EmptyCard = () => (
    <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }} key={-1}>
      <Card.Content>
        No valid member json PR open. Refresh the UI after requesting to pull the IDOL changes (once
        the PR is created by the Github Actions workflow).
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <Loader data-testid="AddUser" active={true} size="massive" />;
  }

  return (
    <div className={styles.content}>
      <TopButtons />
      <CardGroup>
        {pullRequests.length === 0 ? <EmptyCard /> : pullRequests.map(PRToCard)}
      </CardGroup>
    </div>
  );
};

export default SiteDeployer;
