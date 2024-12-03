import React, { useState } from 'react';
import { Modal, Form } from 'semantic-ui-react';
import styles from './NotifyMemberModal.module.css';
import { Member, MembersAPI } from '../../API/MembersAPI';
import { Emitters } from '../../utils';

const NotifyMemberModal = (props: {
  all: boolean;
  member?: Member;
  members?: Member[];
  trigger: JSX.Element;
  endOfSemesterReminder?: boolean;
  type: 'tec' | 'coffee chat';
}): JSX.Element => {
  const { member, members, all, trigger, endOfSemesterReminder, type } = props;
  const [open, setOpen] = useState(false);
  const subject = !all && member ? `${member.firstName} ${member.lastName}` : 'everyone';

  const notifyMember = async (members: Member[]) => {
    if (type === 'tec') {
      await MembersAPI.notifyMemberTeamEvents(members, endOfSemesterReminder || false);
    } else if (type === 'coffee chat') {
      await MembersAPI.notifyMemberCoffeeChat(members);
    }
  };

  const handleSubmit = async () => {
    if (all && members) {
      await notifyMember(members);
      Emitters.generalSuccess.emit({
        headerMsg: 'Reminder sent!',
        contentMsg: `A ${type === 'tec' ? 'TEC' : 'coffee chat'} email reminder was successfully sent to everyone!`
      });
    } else if (member) {
      await notifyMember([member]);
      Emitters.generalSuccess.emit({
        headerMsg: 'Reminder sent!',
        contentMsg: `A ${type === 'tec' ? 'TEC' : 'coffee chat'} email reminder was successfully sent to ${member.firstName} ${member.lastName}!`
      });
    }
    setOpen(false);
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={trigger}
    >
      <Modal.Header> Are you sure you want to notify {subject}?</Modal.Header>
      <Modal.Content>
        This will send an email to {subject} reminding them that they{' '}
        {type === 'tec'
          ? 'do not have enough TEC Credits completed yet this semester'
          : 'should submit coffee chats'}
        .
        <Form>
          <div className={styles.buttonsWrapper}>
            <Form.Button onClick={() => setOpen(false)}>Cancel</Form.Button>
            <Form.Button
              content="Yes"
              labelPosition="right"
              icon="checkmark"
              onClick={handleSubmit}
              positive
            />
          </div>
        </Form>
      </Modal.Content>
    </Modal>
  );
};
export default NotifyMemberModal;
