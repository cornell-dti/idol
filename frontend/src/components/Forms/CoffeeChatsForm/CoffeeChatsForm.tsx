import React, { useEffect, useState } from 'react';
import { Form, Dropdown, Icon } from 'semantic-ui-react';
import { createHash } from 'crypto';
import { Emitters } from '../../../utils';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { MembersAPI } from '../../../API/MembersAPI';
import CoffeeChatsDashboard from './CoffeeChatsDashboard';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChatsForm: React.FC = () => {
  const userInfo = useSelf()!;
  const [member, setMember] = useState<IdolMember | undefined>(undefined);
  const [isNonIDOLMember, setIsNonIDOLMember] = useState<boolean>(false);
  const [category, setCategory] = useState('');
  const [membersList, setMembersList] = useState<IdolMember[]>([]);
  const [approvedChats, setApprovedChats] = useState<CoffeeChat[]>([]);
  const [pendingChats, setPendingChats] = useState<CoffeeChat[]>([]);
  const [rejectedChats, setRejectedChats] = useState<CoffeeChat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [slackLink, setSlackLink] = useState<string>('');
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);

  useEffect(() => {
    MembersAPI.getAllMembers().then((members) => setMembersList(members));
    CoffeeChatAPI.getCoffeeChatsByUser(userInfo).then((coffeeChats) => {
      setApprovedChats(coffeeChats.filter((chat) => chat.status === 'approved'));
      setPendingChats(coffeeChats.filter((chat) => chat.status === 'pending'));
      setRejectedChats(coffeeChats.filter((chat) => chat.status === 'rejected'));
      setIsChatLoading(false);
    });
    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => setBingoBoard(board));
  }, [userInfo]);

  const createMember = (name: string): IdolMember => ({
    netid: `${createHash('sha256').update(name).digest('hex')}`,
    email: `${createHash('sha256').update(name).digest('hex')}`,
    firstName: name,
    lastName: '',
    pronouns: '',
    graduation: '',
    major: '',
    hometown: '',
    about: '',
    subteams: [],
    role: 'developer',
    roleDescription: 'Developer'
  });

  const coffeeChatExists = (): boolean =>
    approvedChats.some((chat) => chat.otherMember.netid === member?.netid) ||
    pendingChats.some((chat) => chat.otherMember.netid === member?.netid);

  const submitCoffeeChat = async () => {
    if (!member) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Member Selected',
        contentMsg: 'Please select a team member!'
      });
    } else if (!slackLink) {
      Emitters.generalError.emit({
        headerMsg: 'No Slack Link Entered',
        contentMsg: 'Please enter a link to your Slack post in #coffee-chats!'
      });
    } else if (!category) {
      Emitters.generalError.emit({
        headerMsg: 'No Category Selected',
        contentMsg: 'Please select a category!'
      });
    } else if (member.netid === userInfo.netid) {
      Emitters.generalError.emit({
        headerMsg: 'Cannot Coffee Chat Yourself',
        contentMsg: 'Please submit a coffee chat with another member!'
      });
    } else if (coffeeChatExists()) {
      Emitters.generalError.emit({
        headerMsg: 'Coffee Chat Exists',
        contentMsg: 'Cannot coffee chat the same member for more than one category!'
      });
    } else {
      const newCoffeeChat: CoffeeChat = {
        uuid: '',
        submitter: userInfo,
        otherMember: member,
        isNonIDOLMember,
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
      setIsNonIDOLMember(false);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label className={styles.bold}>
              Which team member did you coffee chat? <span className={styles.red_color}>*</span>
            </label>
            <div
              onClick={() => {
                setIsNonIDOLMember((prev) => !prev);
                setMember(undefined);
              }}
              style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <Icon name={isNonIDOLMember ? 'check square' : 'square outline'} size="small" />
              Member not listed
            </div>
          </div>
          {!isNonIDOLMember ? (
            <Dropdown
              placeholder="Select a team member"
              fluid
              search={(options, query) =>
                options.filter((option) =>
                  `${option.text}`.toLowerCase().includes(query.toLowerCase())
                )
              }
              selection
              value={member?.netid ?? ''}
              text={member ? `${member.firstName} ${member.lastName} (${member.netid})` : ''}
              options={membersList
                .sort((m1, m2) =>
                  `${m1.firstName} ${m1.lastName}`.localeCompare(`${m2.firstName} ${m2.lastName}`)
                )
                .map((member) => ({
                  key: member.netid,
                  value: member.netid,
                  text: `${member.firstName} ${member.lastName} (${member.netid})`,
                  content: (
                    <div className={styles.flex_start}>
                      {member.firstName} {member.lastName} ({member.netid})
                    </div>
                  )
                }))}
              onChange={(_, data) => {
                setMember(membersList.find((member) => member.netid === data.value));
                setIsNonIDOLMember(false);
              }}
            />
          ) : (
            <Form.Input
              fluid
              placeholder="Full Name (e.g., John Doe)"
              type="string"
              onChange={(name) => {
                setMember(createMember(name.target.value));
                setIsNonIDOLMember(true);
              }}
            />
          )}
        </div>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Which category does this coffee chat fulfill?{' '}
            <span className={styles.red_color}>*</span>
          </label>
          <Dropdown
            placeholder="Select a category"
            fluid
            search={(options, query) =>
              options.filter((option) => option.key.toLowerCase().includes(query.toLowerCase()))
            }
            selection
            value={category}
            text={category}
            options={bingoBoard.flat().map((category, _) => ({
              key: category,
              label: <div className={styles.flex_start}>{category}</div>,
              value: category
            }))}
            onChange={(_, data) => {
              const foundCategory = bingoBoard.flat().find((category) => category === data.value);
              setCategory(foundCategory || '');
            }}
          />
        </div>
        <div className={styles.inline}>
          <label className={styles.bold}>
            Submit a Slack link to your coffee chat! <span className={styles.red_color}>*</span>
          </label>
          <p className={styles.margin_bottom_zero}>
            Go to your coffee chat post in the #coffee-chats channel, and click on 'Copy link'.
            Example: https://cornelldti.slack.com/archives/CDXP35346/p1729873261010759
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
          bingoBoard={bingoBoard}
        />
      </Form>
    </div>
  );
};

export default CoffeeChatsForm;
