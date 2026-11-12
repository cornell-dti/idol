import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { createHash } from 'crypto';
import { Button, Card, Input, LabelledCheckbox } from '../../../design-system-2026/components';
import { Combobox } from '../../../design-system-2026/components/Combobox/Combobox';
import { PlusIcon } from '../../../design-system-2026/icons';
import { Emitters, getChattedOtherNetIds } from '../../../utils';
import { useSelf } from '../../../components/Common/FirestoreDataProvider';
import { MembersAPI } from '../../../API/MembersAPI';
import CoffeeChatsDashboard from './CoffeeChatsDashboard';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';

const CoffeeChatsForm: React.FC = () => {
  const userInfo = useSelf()!;
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
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
  const [suggestions, setSuggestions] = useState<CoffeeChatSuggestions | null>(null);
  const [suggestionsFailed, setSuggestionsFailed] = useState(false);
  const [newbieMatch, setNewbieMatch] = useState(false);
  const [checkingNewbie, setCheckingNewbie] = useState(false);

  useEffect(() => {
    let active = true;
    setSuggestions(null);
    setSuggestionsFailed(false);
    CoffeeChatAPI.getCoffeeChatSuggestions(userInfo.email)
      .then((next) => {
        if (!next) throw new Error('Missing suggestions');
        if (active) setSuggestions(next);
      })
      .catch(() => {
        if (active) setSuggestionsFailed(true);
      });
    return () => {
      active = false;
    };
  }, [userInfo.email]);

  // The existing checker handles the dynamic newbie rule in addition to the
  // member responses returned by the suggestions endpoint.
  useEffect(() => {
    let active = true;
    setNewbieMatch(false);
    setCheckingNewbie(false);
    if (member && !isNonIDOLMember && bingoBoard.flat().includes('a newbie')) {
      setCheckingNewbie(true);
      CoffeeChatAPI.checkMemberMeetsCategory(member, userInfo, 'a newbie')
        .then((result) => {
          if (active) setNewbieMatch(result.status === 'pass');
        })
        .catch(() => {
          /* Suggestions are optional; the category checker still runs on selection. */
        })
        .finally(() => {
          if (active) setCheckingNewbie(false);
        });
    }
    return () => {
      active = false;
    };
  }, [member, isNonIDOLMember, bingoBoard, userInfo]);

  const suggestedCategories = Array.from(new Set(bingoBoard.flat().filter(Boolean))).filter(
    (name) =>
      name === 'a newbie'
        ? newbieMatch
        : suggestions?.[name]?.some(
            (person) => person.netid.trim().toLowerCase() === member?.netid.trim().toLowerCase()
          )
  );

  useEffect(() => {
    MembersAPI.getAllMembers()
      .then((members) => setMembersList(members))
      .catch(() => setLoadError(true));
    CoffeeChatAPI.getCoffeeChatsByUser(userInfo)
      .then((coffeeChats) => {
        const filteredChats = coffeeChats.filter((chat) => !chat.isArchived);
        setApprovedChats(filteredChats.filter((chat) => chat.status === 'approved'));
        setPendingChats(filteredChats.filter((chat) => chat.status === 'pending'));
        setRejectedChats(filteredChats.filter((chat) => chat.status === 'rejected'));
        const archivedChats = coffeeChats.filter((chat) => chat.isArchived);
        setArchivedChats(archivedChats);
        setIsChatLoading(false);
      })
      .catch(() => setLoadError(true));
    CoffeeChatAPI.getCoffeeChatBingoBoard()
      .then((board) => setBingoBoard(board))
      .catch(() => setLoadError(true));
  }, [userInfo]);

  useEffect(() => {
    let active = true;
    setMemberMeetsCategory('no data');
    setErrorMessage('');
    if (member && category)
      CoffeeChatAPI.checkMemberMeetsCategory(member, userInfo, category)
        .then((result) => {
          if (active) {
            setMemberMeetsCategory(result.status);
            setErrorMessage(result.message);
          }
        })
        .catch(() => {
          if (active)
            setErrorMessage(
              'Could not verify this category. Your submission will still be reviewed.'
            );
        });
    return () => {
      active = false;
    };
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

  const netIdsAlreadyChatted = getChattedOtherNetIds(approvedChats, pendingChats, archivedChats);

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
    if (!member || !member.firstName.trim()) {
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

      const coffeeChat = await CoffeeChatAPI.createCoffeeChat(newCoffeeChat);
      if (!coffeeChat?.uuid) throw new Error('Could not submit coffee chat.');
      setPendingChats((pending) => [...pending, coffeeChat]);
      Emitters.generalSuccess.emit({
        headerMsg: 'Coffee Chat submitted!',
        contentMsg: 'Coffee chat submitted.'
      });
      resetState();
    }
  };

  const memberLabel = (person: IdolMember) =>
    `${person.firstName} ${person.lastName} (${person.netid})${netIdsAlreadyChatted.has(person.netid.trim().toLowerCase()) ? ' · Previously chatted' : ''}`;
  return (
    <div className={styles.page}>
      <Head>
        <title>Coffee Chats · IDOL</title>
      </Head>
      <h1 className="idol-heading-1">Coffee Chats</h1>
      {loadError && (
        <Card>
          <p role="alert">Could not load coffee chat data.</p>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Try again
          </Button>
        </Card>
      )}
      <Card header="Submit coffee chats">
        <form
          className={styles.form}
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy) return;
            setBusy(true);
            try {
              await submitCoffeeChat();
            } catch {
              Emitters.generalError.emit({
                headerMsg: 'Could not submit coffee chat',
                contentMsg: 'Please try again. Your draft has been kept.'
              });
            } finally {
              setBusy(false);
            }
          }}
        >
          <p>
            Submit your coffee chats to earn credit for the Coffee Chat Bingo! Fill out this form
            after each chat to receive your credit.
          </p>
          {isNonIDOLMember ? (
            <Input
              id="coffee-name"
              label="Which member did you coffee chat?"
              required
              placeholder="Full name"
              value={member?.firstName ?? ''}
              onChange={(event) => setMember(createMember(event.target.value))}
              disabled={busy}
            />
          ) : (
            <Combobox
              id="coffee-member"
              label="Which member did you coffee chat?"
              required
              placeholder="Search members"
              options={membersList
                .slice()
                .sort((a, b) => a.firstName.localeCompare(b.firstName))
                .map(memberLabel)}
              value={member ? memberLabel(member) : ''}
              onValueChange={(value) => {
                if (!busy) setMember(membersList.find((person) => memberLabel(person) === value));
              }}
            />
          )}
          <LabelledCheckbox
            label="Member not listed"
            checked={isNonIDOLMember}
            disabled={busy}
            onCheckedChange={(value) => {
              setIsNonIDOLMember(value);
              setMember(undefined);
              setCategory('');
              setMemberMeetsCategory('no data');
            }}
          />
          {member?.netid === userInfo.netid && (
            <p className={styles.warning}>Cannot coffee chat yourself.</p>
          )}
          <Combobox
            id="coffee-category"
            label="Which category does this coffee chat fulfill?"
            required
            placeholder="Select a category"
            options={Array.from(new Set(bingoBoard.flat().filter(Boolean)))}
            value={category}
            onValueChange={(value) => {
              if (!busy) setCategory(value);
            }}
          />
          {member && !isNonIDOLMember && member.netid !== userInfo.netid && (
            <section className={styles.categorySuggestions} aria-label="Suggested categories">
              <p className={styles.suggestionLabel}>Suggested for {member.firstName}</p>
              {suggestionsFailed ? (
                <p className={styles.gray}>
                  Could not load suggestions. You can still select a category above.
                </p>
              ) : (
                <>
                  {(!suggestions || checkingNewbie) && (
                    <p className={styles.gray} role="status">
                      Finding matching categories…
                    </p>
                  )}
                  {suggestions && !checkingNewbie && suggestedCategories.length === 0 && (
                    <p className={styles.gray}>
                      No matching categories found in their responses. You can still choose another
                      category.
                    </p>
                  )}
                  <div className={styles.categoryChips}>
                    {suggestedCategories.map((name) => {
                      const taken = [...approvedChats, ...pendingChats].some(
                        (chat) => chat.category === name
                      );
                      return (
                        <button
                          type="button"
                          key={name}
                          className={styles.categoryChip}
                          aria-pressed={category === name}
                          disabled={busy || taken}
                          onClick={() => setCategory(name)}
                        >
                          {name}
                          {taken ? ' · Already submitted' : ''}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </section>
          )}
          {errorMessage && (
            <p className={styles.warning} role="status">
              {memberMeetsCategory === 'fail' ? 'Warning: ' : ''}
              {errorMessage}
            </p>
          )}
          <Input
            id="coffee-slack"
            label="Submit a Slack link"
            required
            value={slackLink}
            onChange={(event) => setSlackLink(event.target.value)}
            disabled={busy}
            placeholder="https://cornelldti.slack.com/archives/..."
            hint="Open your post in #coffee-chats and choose Copy link."
          />
          <div className={styles.actions}>
            <Button
              type="submit"
              icon={<PlusIcon size={16} />}
              disabled={busy || isChatLoading || loadError}
            >
              {busy ? 'Submitting…' : 'Submit coffee chat'}
            </Button>
          </div>
        </form>
      </Card>
      <CoffeeChatsDashboard
        approvedChats={approvedChats}
        pendingChats={pendingChats}
        rejectedChats={rejectedChats}
        archivedChats={archivedChats}
        isChatLoading={isChatLoading}
        setPendingChats={setPendingChats}
        setApprovedChats={setApprovedChats}
        bingoBoard={bingoBoard}
        resetState={resetState}
        userInfo={userInfo}
      />
    </div>
  );
};
export default CoffeeChatsForm;
