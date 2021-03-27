import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, CardGroup, Form, TextArea } from 'semantic-ui-react';
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

  const history = useHistory();

  // No loading for now, but for future reference
  const [isLoading, setLoading] = useState(false);
  const [pullRequests, setPullRequests] = useState<any[]>([]);

  const loadPullRequests = () => {
    APIWrapper.get(`${backendURL}/getIDOLChangesPR`, {}).then((resp: any) => {
      if(!resp.data.pr){
        Emitters.generalError.emit({
          headerMsg: 'Couldn\'t get IDOL changes PR!',
          contentMsg: resp.data.error
        });
        return;
      }
      setPullRequests([resp.data.pr]);
    });
    setLoading(false);
  };

  useEffect(() => {
    if (userEmail) {
      getUser(userEmail)
        .then((mem) => {
          if (mem.role != 'lead') {
            Emitters.generalError.emit({
              headerMsg: 'Access Denied',
              contentMsg: `Insufficient permissions.`
            });
            history.push('/');
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
          history.push('/');
        });
    }
  }, [userEmail]);

  const onClickAccept = (pullRequest: any) => {
    APIWrapper.post(`${backendURL}/acceptIDOLChanges`, {}).then((resp) => {
      if(resp.data.merged){
        setPullRequests([]);
      }
    });
  };

  const onClickReject = (pullRequest: any) => {
    APIWrapper.post(`${backendURL}/rejectIDOLChanges`, {}).then((resp) => {
      if(resp.data.closed){
        setPullRequests([]);
      }
    });
  };

  const onClickRefresh = () => {
    loadPullRequests();
  }

  const PRToCard = (pullRequest: any, key: number) => (
    <Card style={{ width: '100%', whiteSpace: 'pre-wrap' }} key={key}>
      <Card.Content>{pullRequest.body}</Card.Content>
      <Card.Content extra>
        <div className="ui one buttons" style={{ width: '100%' }}>
          <Button
            basic
            color="green"
            onClick={() => {
              onClickAccept(pullRequest);
            }}
          >
            Accept & Deploy
          </Button>
          <Button
            basic
            color="red"
            onClick={() => {
              onClickReject(pullRequest);
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
      if(resp.data.updated){
        alert("Workflow triggered!");
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
      <Card.Content>No valid member json PR open. Refresh the UI after requesting to pull the IDOL changes (once the PR is created by the Github Actions workflow).</Card.Content>
    </Card>
  );

  return (
    <div className={styles.content}>
      <TopButtons />
      <CardGroup>{ pullRequests.length == 0 ? <EmptyCard /> : pullRequests.map(PRToCard)}</CardGroup>
    </div>
  );
};

export default SiteDeployer;
