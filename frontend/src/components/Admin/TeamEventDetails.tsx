import React from 'react';
import { Card, Button, Header, Modal, Icon } from 'semantic-ui-react';
import { Member } from '../../API/MembersAPI';

type TeamEvent = {
  name: string;
  date: string;
  numCredits: string;
  hasHours: boolean;
  membersPending: Member[];
  membersApproved: Member[];
};

const TeamEventDetails = (props: { teamEvent: TeamEvent }): JSX.Element => {
  const { teamEvent } = props;
  const [firstOpen, setFirstOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);

  return (
    <>
      <Card onClick={() => setFirstOpen(true)}>
        <Card.Content>
          <Card.Header>{teamEvent.name} </Card.Header>
          <Card.Meta>{teamEvent.date}</Card.Meta>
        </Card.Content>
      </Card>

      <Modal onClose={() => setFirstOpen(false)} onOpen={() => setFirstOpen(true)} open={firstOpen}>
        <Modal.Header>Team Event Detals</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Header>{teamEvent.name}</Header>
            <p>
              <strong>Date:</strong> {teamEvent.date}
            </p>
            <p>
              <strong>Credits:</strong> {teamEvent.numCredits}
            </p>
            <p>
              <strong>Has Hours?:</strong> {teamEvent.hasHours ? 'Yes' : 'No'}
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setSecondOpen(true)}>
            <Icon name="trash" style={{ margin: 'auto' }}></Icon>
          </Button>

          <Button content="Close" color="red" onClick={() => setFirstOpen(false)}></Button>

          <Button
            content="Save"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setFirstOpen(false)}
            positive
          />
        </Modal.Actions>

        <Modal onClose={() => setSecondOpen(false)} open={secondOpen} size="small">
          <Modal.Header>Delete Team Event</Modal.Header>
          <Modal.Content>
            <p>Are you sure that you want to delete this event?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button content="Go Back" onClick={() => setSecondOpen(false)}></Button>
            <Button
              content="Delete Event"
              color="red"
              onClick={() => {
                setSecondOpen(false);
                setFirstOpen(false);
              }}
            ></Button>
          </Modal.Actions>
        </Modal>
      </Modal>
    </>
  );
};
export default TeamEventDetails;
