import React, { useEffect, useState } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';
import { Emitters } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { MembersAPI } from '../../../API/MembersAPI';
import CoffeeChatsDashboard from './CoffeeChatsDashboard';
import styles from './CoffeeChatsForm.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChatsForm: React.FC = () => {
  const userInfo = useSelf()!;
  const [member, setMember] = useState<IdolMember | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [membersList, setMembersList] = useState<IdolMember[]>([]);
  const [approvedChats, setApprovedChats] = useState<CoffeeChat[]>([]);
  const [pendingChats, setPendingChats] = useState<CoffeeChat[]>([]);
  const [rejectedChats, setRejectedChats] = useState<CoffeeChat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [slackLink, setSlackLink] = useState<string>('');

  useEffect(() => {
    MembersAPI.getAllMembers().then((members) => setMembersList(members));
    CoffeeChatAPI.getCoffeeChatsByUser(userInfo).then((coffeeChat) => {
      setApprovedChats(coffeeChat.filter((chat) => chat.status === 'approved'));
      setPendingChats(coffeeChat.filter((chat) => chat.status === 'pending'));
      setRejectedChats(coffeeChat.filter((chat) => chat.status === 'rejected'));
      setIsChatLoading(false);
    });
  }, [userInfo]);

  const coffeeChatExists = async (): Promise<boolean> => {
    const chats = await CoffeeChatAPI.getCoffeeChatsByUser(userInfo);
    return chats.some((chat) => chat.otherMember.netid === member?.netid);
  };

  const submitCoffeeChat = async () => {
    if (!member) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Member Selected',
        contentMsg: 'Please select a team member!'
      });
    } else if (!slackLink) {
      Emitters.generalError.emit({
        headerMsg: 'No Image Entered',
        contentMsg: 'Please enter an image link!'
      });
    } else if (!category) {
      Emitters.generalError.emit({
        headerMsg: 'No Category Entered',
        contentMsg: 'Please enter a category!'
      });
    } else if (member.netid === userInfo.netid) {
      Emitters.generalError.emit({
        headerMsg: 'Cannot Coffee Chat Yourself',
        contentMsg: 'Please submit a coffee chat with another member!'
      });
    } else if (await coffeeChatExists()) {
      Emitters.generalError.emit({
        headerMsg: 'Coffee Chat Exists',
        contentMsg: 'Please submit a coffee chat with a new member!'
      });
    } else {
      const newCoffeeChat: CoffeeChat = {
        uuid: '',
        submitter: userInfo,
        otherMember: member,
        slackLink,
        category,
        status: 'pending' as Status,
        date: new Date().getTime()
      };

      CoffeeChatAPI.createCoffeeChat(newCoffeeChat).then(() => {
        setPendingChats((pending) => [...pending, newCoffeeChat]);
      });
      Emitters.generalSuccess.emit({
        headerMsg: 'Coffee Chat submitted!',
        contentMsg: `The leads were notified of your submission, and your coffee chat will be approved soon!`
      });
      setMember(undefined);
      setCategory('');
      setSlackLink('');
    }
  };

  return (
    <div>
      <Form className={styles.form_style}>
        <h1>Submit Coffee Chats</h1>
        <p>
          Submit your coffee chats to earn credit for the Coffee Chat Bingo! Fill out this form
          after each chat to receive your credit.
        </p>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Select a team member: <span className={styles.red_color}>*</span>
          </label>
          <div className={styles.center_and_flex}>
            {membersList ? (
              <Dropdown
                placeholder="Select a team member"
                fluid
                search={(options, query) =>
                  options.filter((option) => option.key.toLowerCase().includes(query.toLowerCase()))
                }
                selection
                value={member?.netid ?? ''}
                text={member ? `${member.firstName} ${member.lastName}` : ''}
                options={membersList
                  .sort((m1, m2) =>
                    `${m1.firstName} ${m1.lastName}`.localeCompare(`${m2.firstName} ${m2.lastName}`)
                  )
                  .map((member) => ({
                    key: member.netid,
                    label: (
                      <div className={styles.flex_start}>
                        {member.firstName} {member.lastName}
                      </div>
                    ),
                    value: member.netid
                  }))}
                onChange={(_, data) => {
                  setMember(membersList.find((member) => member.netid === data.value));
                }}
              />
            ) : undefined}
          </div>
        </div>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Which category does this coffee chat fulfill?{' '}
            <span className={styles.red_color}>*</span>
          </label>
          <Form.Input
            fluid
            type="string"
            value={category}
            onChange={(category) => setCategory(category.target.value)}
          />
        </div>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Submit a Slack link to your coffee chat! <span className={styles.red_color}>*</span>
          </label>
          <p className={styles.margin_bottom_zero}>
            Go to your coffee chat image in the #coffee-chats channel, and click on 'Copy link to
            file'. Example: https://cornelldti.slack.com/files/U05SULTP4V7/F06LF0ZNCQM/img_4661.jpg
          </p>
          <Form.Input
            fluid
            type="string"
            value={slackLink}
            onChange={(slackLink) => setSlackLink(slackLink.target.value)}
          />
        </div>
        <Form.Button
          floated="right"
          onClick={async () => {
            await submitCoffeeChat();
          }}
        >
          Submit
        </Form.Button>
        <CoffeeChatsDashboard
          approvedChats={approvedChats}
          pendingChats={pendingChats}
          rejectedChats={rejectedChats}
          isChatLoading={isChatLoading}
          setPendingChats={setPendingChats}
        />
      </Form>
    </div>
  );
};

export default CoffeeChatsForm;
