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
  const [pullRequests, setPullRequests] = useState(['PR #1', 'PR #2']);

  const loadPullRequests = () => {
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
    console.log(pullRequest);
  };

  const onClickReject = (pullRequest: any) => {
    console.log(pullRequest);
  };

  const PRToCard = (pullRequest: any, key: number) => (
    <Card style={{ width: '100%' }} key={key}>
      <Card.Content>{pullRequest}</Card.Content>
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
      console.log('IDOL changes ');
      console.log(resp);
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
    </div>
  );

  return (
    <div className={styles.content}>
      <TopButtons />
      <CardGroup>{pullRequests.map(PRToCard)}</CardGroup>
    </div>
  );
};

export default SiteDeployer;
