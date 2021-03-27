import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardGroup, Loader } from 'semantic-ui-react';
import { UserContext } from '../../UserProvider/UserProvider';
import { Member, MembersAPI } from '../../API/MembersAPI';
import Emitters from '../../EventEmitter/constant-emitters';
import { backendURL } from '../../environment';
import styles from './SiteDeployer.module.css';
import APIWrapper from '../../API/APIWrapper';

const SiteDeployer: React.FC = () => {
  const userEmail = useContext(UserContext).user?.email;

  const getUser = async (email: string): Promise<Member> => {
    const mem = await MembersAPI.getMember(email);
    return mem;
  };

  const [isLoading, setLoading] = useState(true);
  const [pullRequests, setPullRequests] = useState<{ body: string }[]>([]);

  const loadPullRequests = () => {
    APIWrapper.get(`${backendURL}/getIDOLChangesPR`, {}).then((resp) => {
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
        .then((mem) => {
          if (mem.role !== 'lead') {
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
            headerMsg:
              "Couldn't get member! Refresh the page if you believe this is an error.",
            contentMsg: `Error was: ${error}`
          });
        });
    }
  }, []);

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

  const PRToCard = (pullRequest: { body: string }, key: number) => (
    <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }} key={key}>
      <Card.Content>{pullRequest.body}</Card.Content>
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

  const onTriggerPullFromIDOL = () => {
    APIWrapper.post(`${backendURL}/pullIDOLChanges`, {}).then((resp) => {
      if (resp.data.updated) {
        alert('Workflow triggered!');
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
        No valid member json PR open. Refresh the UI after requesting to pull
        the IDOL changes (once the PR is created by the Github Actions
        workflow).
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
