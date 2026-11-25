import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Modal, Button, Input, Pill } from '../../../design-system-2026/components';
import { useDesignSystemAppearance } from '../../../design-system-2026/components/Theme/Theme';
import {
  ArrowSquareOutIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon
} from '../../../design-system-2026/icons';
import styles from './CoffeeChats.module.css';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';

type Hint = { text: string; x: number; y: number; below: boolean };

/**
 * Explains why a suggestion is disabled. Rendered at the body level with fixed positioning so the
 * modal's scroll area can't clip it and the dialog's focus/pointer handling can't suppress it.
 */
function SuggestionHint({ hint }: { hint: Hint | null }): JSX.Element | null {
  const { theme, accent } = useDesignSystemAppearance();
  if (!hint || typeof document === 'undefined') return null;
  return createPortal(
    <div data-idol-redesign data-idol-theme={theme} data-idol-accent={accent}>
      <div
        aria-hidden="true"
        className={styles.suggestionHint}
        data-below={hint.below || undefined}
        style={{ left: hint.x, top: hint.y }}
      >
        {hint.text}
      </div>
    </div>,
    document.body
  );
}

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
  /**
   * Prefills the submit form with this member and category. Returns a callback to run once the
   * modal has finished closing (and released its scroll lock), e.g. to scroll to the form.
   */
  onSelectSuggestion: (netid: string, category: string) => (() => void) | null;
};

const CoffeeChatModal: React.FC<Props> = ({
  coffeeChat,
  category,
  open,
  setOpen,
  deleteCoffeeChatRequest,
  userInfo,
  submittedChats,
  approvedArchivedChats,
  onSelectSuggestion
}) => {
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState('');
  const [hint, setHint] = useState<Hint | null>(null);
  const showHint = (target: HTMLElement, text: string) => {
    const rect = target.getBoundingClientRect();
    const below = rect.top < 72;
    setHint({
      text,
      x: rect.left + rect.width / 2,
      y: below ? rect.bottom + 6 : rect.top - 6,
      below
    });
  };
  const hideHint = () => setHint(null);
  // Set when a suggestion is picked so the form takes over focus and scroll after closing.
  const afterClose = useRef<(() => void) | null>(null);
  useEffect(() => {
    setConfirm(false);
    setQuery('');
    setHint(null);
    if (open) afterClose.current = null;
  }, [open, coffeeChat, category]);
  // null until the first response arrives; later opens refetch silently over the cached data.
  const [suggestions, setSuggestions] = useState<CoffeeChatSuggestions | null>(null);
  const isLoading = !suggestions && !failed;
  const hasSuggestions = useRef(false);
  hasSuggestions.current = suggestions !== null;

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
    .filter((person) => `${person.name} ${person.netid}`.toLowerCase().includes(search))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    let active = true;
    const fetchMembers = async () => {
      setFailed(false);
      try {
        const next = await CoffeeChatAPI.getCoffeeChatSuggestions(userInfo.email);
        if (!next) throw new Error('Missing suggestions');
        if (active) setSuggestions(next);
      } catch (error) {
        // A failed refresh keeps showing the suggestions we already have.
        if (!active || hasSuggestions.current) return;
        setFailed(true);
        Emitters.generalError.emit({
          headerMsg: 'Something went wrong',
          contentMsg: 'Could not retrieve coffee chat suggestions.'
        });
      }
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
      finalFocus={() => !afterClose.current}
      onOpenChangeComplete={(next) => {
        if (next || !afterClose.current) return;
        afterClose.current();
        afterClose.current = null;
      }}
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
                placeholder="Search by name or NetID"
                icon={<MagnifyingGlassIcon size={18} />}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {isLoading ? (
                <span
                  className={`${styles.suggestionCountSkeleton} idol-skeleton`}
                  aria-hidden="true"
                />
              ) : (
                <p className={styles.suggestionCount} role="status">
                  {`${filteredMembers.length} ${
                    filteredMembers.length === 1 ? 'member' : 'members'
                  }`}
                </p>
              )}
            </div>
          )}
          <div className={styles.suggestionResults} onScroll={hideHint}>
            {isLoading && (
              <ul className={styles.suggestionsGrid} role="status" aria-label="Loading suggestions">
                {Array.from({ length: 12 }, (_, key) => (
                  <li
                    key={key}
                    className={`${styles.suggestionSkeleton} idol-skeleton`}
                    aria-hidden="true"
                  />
                ))}
              </ul>
            )}
            {!isLoading &&
              !failed &&
              membersInCategory.length > 0 &&
              filteredMembers.length === 0 && <p>No members match your search.</p>}
            {!isLoading && !failed && (
              <ul className={styles.suggestionsGrid}>
                {filteredMembers.map((person) => {
                  const reasons = previousReasons(person.netid);
                  const chatted = reasons.length > 0;
                  const reasonText = `Already chatted for ${reasons.join('; ')}`;
                  return (
                    <li key={person.netid}>
                      <button
                        type="button"
                        className={styles.suggestionMember}
                        aria-disabled={chatted || undefined}
                        aria-label={
                          chatted
                            ? `${person.name} (${person.netid}). ${reasonText}`
                            : `Submit a coffee chat with ${person.name} (${person.netid})`
                        }
                        onMouseEnter={(event) =>
                          chatted && showHint(event.currentTarget, reasonText)
                        }
                        onMouseLeave={hideHint}
                        onFocus={(event) => chatted && showHint(event.currentTarget, reasonText)}
                        onBlur={hideHint}
                        onClick={(event) => {
                          // Touch has no hover, so a tap on a disabled card shows the reason instead.
                          if (chatted) {
                            showHint(event.currentTarget, reasonText);
                            return;
                          }
                          afterClose.current = onSelectSuggestion(person.netid, category);
                          setOpen(false);
                        }}
                      >
                        <span className={styles.suggestionName}>
                          {person.name} <span className={styles.gray}>({person.netid})</span>
                        </span>
                        {chatted ? (
                          <CheckIcon size={16} aria-hidden className={styles.suggestionIcon} />
                        ) : (
                          <PlusIcon size={16} aria-hidden className={styles.suggestionIcon} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <SuggestionHint hint={open ? hint : null} />
        </div>
      )}
    </Modal>
  );
};
export default CoffeeChatModal;
