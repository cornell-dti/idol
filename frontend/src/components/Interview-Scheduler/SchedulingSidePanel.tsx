import { getDateString, getTimeString } from '../../utils';
import { useHasAdminPermission, useHasMemberPermission } from '../Common/FirestoreDataProvider';
import { useUserEmail } from '../Common/UserProvider/UserProvider';
import styles from './SchedulingSidePanel.module.css';

const SchedulingSidePanel: React.FC<{
  displayedSlot?: InterviewSlot;
  duration: number;
}> = ({ displayedSlot, duration }) => {
  const isAdmin = useHasAdminPermission();
  const isMember = useHasMemberPermission();
  const userEmail = useUserEmail();

  const displayNameOrVacant = (
    person: { email: string; firstName: string; lastName: string } | null
  ): string =>
    person
      ? `${person.firstName} ${person.lastName} ${person.email === userEmail ? '(You)' : ''}`
      : 'Vacant';

  const displayCensoredName = (
    person: { email: string; firstName: string; lastName: string } | null
  ): string => {
    if (!person) return 'Vacant';
    if (person.email === '') return 'Occupied';
    return displayNameOrVacant(person);
  };

  return (
    <div className={styles.sidebarContainer}>
      <p>Scroll over to review timeslots. Click to show more information, sign up, or cancel.</p>
      {displayedSlot && (
        <div>
          <p>Date: {getDateString(displayedSlot.startTime, true)}</p>
          <p>
            Time: {getTimeString(displayedSlot.startTime)} -{' '}
            {getTimeString(displayedSlot.startTime + duration)}
          </p>
          <p>Room: {displayedSlot.room}</p>
          {isMember && (
            <div>
              <p>Lead: {displayNameOrVacant(displayedSlot.lead)}</p>
              <p>Members:</p>
              <ul>
                {displayedSlot.members.map((member) => (
                  <li>{displayNameOrVacant(member)}</li>
                ))}
              </ul>
            </div>
          )}
          {(isAdmin || !isMember) && (
            <p>
              Applicant:{' '}
              {isAdmin
                ? displayNameOrVacant(displayedSlot.applicant)
                : displayCensoredName(displayedSlot.applicant)}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default SchedulingSidePanel;
