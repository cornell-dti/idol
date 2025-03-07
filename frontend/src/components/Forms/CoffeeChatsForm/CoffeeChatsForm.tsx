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
  const [archivedChats, setArchivedChats] = useState<CoffeeChat[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [slackLink, setSlackLink] = useState<string>('');
  const [bingoBoard, setBingoBoard] = useState<string[][]>([[]]);
  const [memberMeetsCategory, setMemberMeetsCategory] =
    useState<MemberMeetsCategoryStatus>('no data');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    MembersAPI.getAllMembers().then((members) => setMembersList(members));
    CoffeeChatAPI.getCoffeeChatsByUser(userInfo).then((coffeeChats) => {
      const filteredChats = coffeeChats.filter((chat) => !chat.isArchived);
      setApprovedChats(filteredChats.filter((chat) => chat.status === 'approved'));
      setPendingChats(filteredChats.filter((chat) => chat.status === 'pending'));
      setRejectedChats(filteredChats.filter((chat) => chat.status === 'rejected'));
      const archivedChats = coffeeChats.filter((chat) => chat.isArchived);
      setArchivedChats(archivedChats);
      setIsChatLoading(false);
    });
    CoffeeChatAPI.getCoffeeChatBingoBoard().then((board) => setBingoBoard(board));
  }, [userInfo]);

  useEffect(() => {
    if (member && category) {
      CoffeeChatAPI.checkMemberMeetsCategory(member, userInfo, category).then((result) => {
        setMemberMeetsCategory(result.status);
        setErrorMessage(result.message);
      });
    }
  }, [category, member, userInfo]);

  const createMember = (name: string): IdolMember => ({
    netid: `${createHash('sha256').update(name).digest('hex')}`,
    email: `${createHash('sha256').update(name).digest('hex')}`,
    firstName: name,
    lastName: '',
    pronouns: '',
    semesterJoined: '',
    graduation: '',
    major: '',
    college: 'eng',
    hometown: '',
    about: '',
    subteams: [],
    role: 'developer',
    roleDescription: 'Developer'
  });

  const coffeeChatExists = (): boolean =>
    approvedChats.some((chat) => chat.otherMember.netid === member?.netid) ||
    pendingChats.some((chat) => chat.otherMember.netid === member?.netid);

  const coffeeChatCategoryExists = (): boolean =>
    approvedChats.some((chat) => chat.category === category) ||
    pendingChats.some((chat) => chat.category === category);

  const resetState = () => {
    setMember(undefined);
    setCategory('');
    setSlackLink('');
    setIsNonIDOLMember(false);
    setMemberMeetsCategory('no data');
  };

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
        contentMsg: 'Pending or approved submission exists for this member!'
      });
    } else if (coffeeChatCategoryExists()) {
      Emitters.generalError.emit({
        headerMsg: 'Coffee Chat Category Filled',
        contentMsg: 'There is already a pending or approved coffee chat in this category!'
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
        date: new Date().getTime(),
        isArchived: false,
        memberMeetsCategory,
        errorMessage
      };

      CoffeeChatAPI.createCoffeeChat(newCoffeeChat).then((coffeeChat) => {
        setPendingChats((pending) => [...pending, coffeeChat]);
      });
      Emitters.generalSuccess.emit({
        headerMsg: 'Coffee Chat submitted!',
        contentMsg: `The leads were notified of your submission, and your coffee chat will be approved soon!`
      });
      resetState();
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
                setCategory('');
                setMemberMeetsCategory('no data');
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
          {member?.netid === userInfo.netid ? (
            <div className={styles.warning}>Warning: Cannot coffee chat yourself</div>
          ) : (
            ''
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
          {memberMeetsCategory === 'fail' && errorMessage ? (
            <div className={styles.warning}>Warning: {errorMessage}</div>
          ) : (
            ''
          )}
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
          archivedChats={archivedChats}
          isChatLoading={isChatLoading}
          setPendingChats={setPendingChats}
          bingoBoard={bingoBoard}
          setApprovedChats={setApprovedChats}
          resetState={resetState}
          userInfo={userInfo}
        />
      </Form>
    </div>
  );
};

export default CoffeeChatsForm;
