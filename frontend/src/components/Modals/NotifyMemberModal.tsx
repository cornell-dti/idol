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
  endOfPeriodReminder?: boolean;
  type: 'tec' | 'coffee chat' | 'period';
}): JSX.Element => {
  const { member, members, all, trigger, endOfPeriodReminder, type } = props;
  const [open, setOpen] = useState(false);
  const subject = !all && member ? `${member.firstName} ${member.lastName}` : 'everyone';

  const notifyMember = async (member: Member) => {
    if (type === 'tec') {
      await MembersAPI.notifyMemberTeamEvents(member, endOfPeriodReminder || false);
    } else if (type === 'period') {
      await MembersAPI.notifyMemberPeriod(member);
    } else if (type === 'coffee chat') {
      await MembersAPI.notifyMemberCoffeeChat(member);
    }
  };

  const handleSubmit = async () => {
    if (all && members) {
      await Promise.all(members.map(notifyMember));
      Emitters.generalSuccess.emit({
        headerMsg: 'Reminder sent!',
        contentMsg: `A ${type === 'tec' || type === 'period' ? 'TEC' : 'coffee chat'} email reminder was successfully sent to everyone!`
      });
    } else if (member) {
      await notifyMember(member);
      Emitters.generalSuccess.emit({
        headerMsg: 'Reminder sent!',
        contentMsg: `A ${type === 'tec' || type === 'period' ? 'TEC' : 'coffee chat'} email reminder was successfully sent to ${member.firstName} ${member.lastName}!`
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
        {type === 'tec' && 'do not have enough TEC Credits completed yet this period'}
        {type === 'coffee chat' && 'should submit coffee chats'}
        {type === 'period' && 'do not have enough TEC Credits completed yet this period'}.
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
