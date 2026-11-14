import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Pill } from '../../../design-system-2026/components';
import {
  ArrowSquareOutIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  TrashIcon
} from '../../../design-system-2026/icons';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';

const statusColor = { approved: 'green', pending: 'blue', rejected: 'red' } as const;
const statusLabel = { approved: 'Approved', pending: 'Pending', rejected: 'Rejected' } as const;

export function CoffeeChatStatus({ status }: { status: CoffeeChat['status'] }): JSX.Element {
  return <Pill color={statusColor[status]}>{statusLabel[status]}</Pill>;
}

type Props = {
  coffeeChat?: CoffeeChat;
  category: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCoffeeChatRequest: (coffeeChat: CoffeeChat) => void | Promise<void>;
  userInfo: IdolMember;
  submittedChats: CoffeeChat[];
  approvedArchivedChats: CoffeeChat[];
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  category,
  open,
  setOpen,
  deleteCoffeeChatRequest,
  userInfo,
  submittedChats,
  approvedArchivedChats
}) => {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => {
    setConfirm(false);
    setQuery('');
  }, [open, coffeeChat, category]);
  const [suggestions, setSuggestions] = useState<CoffeeChatSuggestions>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let membersInCategory: MemberDetails[] = [];
  if (suggestions && category && category in suggestions) {
    membersInCategory = suggestions[category];
  } else {
    membersInCategory = [];
  }

  const history = [...submittedChats, ...approvedArchivedChats];
  const previousReasons = (netid: string) =>
    Array.from(
      new Set(
        history
          .filter(
            (chat) => chat.otherMember.netid.trim().toLowerCase() === netid.trim().toLowerCase()
          )
          .map((chat) => `${chat.category}${chat.status === 'pending' ? ' (pending)' : ''}`)
      )
    );
  const search = query.trim().toLowerCase();
  const filteredMembers = membersInCategory
    .filter((person) =>
      `${person.name} ${person.netid} ${previousReasons(person.netid).join(' ')}`
        .toLowerCase()
        .includes(search)
    )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    let active = true;
    const fetchMembers = async () => {
      setIsLoading(true);
      setFailed(false);
      try {
        const next = await CoffeeChatAPI.getCoffeeChatSuggestions(userInfo.email);
        if (!next) throw new Error('Missing suggestions');
        if (active) setSuggestions(next);
      } catch (error) {
        if (!active) return;
        setFailed(true);
        Emitters.generalError.emit({
          headerMsg: 'Something went wrong',
          contentMsg: 'Could not retrieve coffee chat suggestions.'
        });
      }
      if (active) setIsLoading(false);
    };

    if (open && !coffeeChat) fetchMembers();
    return () => {
      active = false;
    };
  }, [userInfo.email, open, coffeeChat]);

  const detailTitle = coffeeChat
    ? `Coffee Chat with ${coffeeChat.otherMember.firstName} ${coffeeChat.otherMember.lastName}`
    : 'Coffee chat suggestions';
  return (
    <Modal
      id="coffee-chat-details"
      width={coffeeChat ? undefined : 840}
      open={open}
      onOpenChange={(next) => {
        if (!busy) setOpen(next);
      }}
      title={confirm ? 'Delete this coffee chat?' : detailTitle}
      description={confirm ? 'This removes your submission and frees its category.' : category}
      footer={
        <>
          {coffeeChat && coffeeChat.status !== 'rejected' && !confirm && (
            <Button
              variant="secondaryDanger"
              className={styles.footerStart}
              disabled={busy}
              icon={<TrashIcon size={16} />}
              onClick={() => setConfirm(true)}
            >
              Delete
            </Button>
          )}
          {confirm ? (
            <>
              <Button variant="secondary" disabled={busy} onClick={() => setConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                disabled={busy}
                icon={<TrashIcon size={16} />}
                onClick={async () => {
                  if (!coffeeChat) return;
                  setBusy(true);
                  try {
                    await deleteCoffeeChatRequest(coffeeChat);
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? 'Deleting…' : 'Delete coffee chat'}
              </Button>
            </>
          ) : (
            <Button disabled={busy} icon={<CheckIcon size={16} />} onClick={() => setOpen(false)}>
              Done
            </Button>
          )}
        </>
      }
    >
      {coffeeChat ? (
        <div className={styles.details}>
          <dl className={styles.chatFacts}>
            <div>
              <dt>Member</dt>
              <dd>
                {coffeeChat.otherMember.firstName} {coffeeChat.otherMember.lastName}
                {!coffeeChat.isNonIDOLMember && (
                  <span className={styles.gray}> ({coffeeChat.otherMember.netid})</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <CoffeeChatStatus status={coffeeChat.status} />
              </dd>
            </div>
            {coffeeChat.date > 0 && (
              <div>
                <dt>Submitted</dt>
                <dd>
                  {new Date(coffeeChat.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </dd>
              </div>
            )}
            {coffeeChat.reason && (
              <div className={styles.chatFactWide}>
                <dt>Reason</dt>
                <dd>{coffeeChat.reason}</dd>
              </div>
            )}
          </dl>
          <a
            className={styles.slackLink}
            href={coffeeChat.slackLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Slack post
            <ArrowSquareOutIcon size={16} aria-hidden />
          </a>
        </div>
      ) : (
        <div className={styles.details}>
          {isLoading && <p role="status">Loading suggestions…</p>}
          {failed && (
            <p role="alert">Could not retrieve suggestions. Close and reopen to try again.</p>
          )}
          {!isLoading && !failed && membersInCategory.length === 0 && (
            <p>
              You have not submitted a coffee chat for this category. No suggestions are available
              yet.
            </p>
          )}
          {!failed && (
            <div className={styles.suggestionsToolbar}>
              <Input
                id="coffee-suggestions-search"
                aria-label="Search coffee chat suggestions"
                placeholder="Search by name, NetID, or previous category"
                icon={<MagnifyingGlassIcon size={18} />}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <p className={styles.suggestionCount} role="status">
                {isLoading
                  ? 'Loading…'
                  : `${filteredMembers.length} ${
                      filteredMembers.length === 1 ? 'member' : 'members'
                    }`}
              </p>
            </div>
          )}
          <div className={styles.suggestionResults}>
            {!isLoading &&
              !failed &&
              membersInCategory.length > 0 &&
              filteredMembers.length === 0 && <p>No members match your search.</p>}
            {!isLoading && !failed && (
              <ul className={styles.suggestionsGrid}>
                {filteredMembers.map((person) => {
                  const reasons = previousReasons(person.netid);
                  return (
                    <li key={person.netid} className={styles.suggestionMember}>
                      <p>
                        {person.name} <span className={styles.gray}>({person.netid})</span>
                      </p>
                      {reasons.length > 0 && (
                        <p className={styles.previousReason}>
                          Previously chatted for {reasons.join('; ')}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};
export default CoffeeChatModal;
