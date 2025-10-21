import { Button, Dropdown } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import { LEAD_ROLES } from 'common-types/constants';
import { Emitters, getDateString, getTimeString } from '../../utils';
import { useHasMemberPermission, useMember, useMembers } from '../Common/FirestoreDataProvider';
import { useUserEmail } from '../Common/UserProvider/UserProvider';
import InterviewSlotDeleteModal from '../Modals/InterviewSlotDeleteModal';
import styles from './SchedulingSidePanel.module.css';
import { useInterviewSlotStatus, useSetSlotsContext } from './SlotHooks';
import InterviewSchedulerAPI from '../../API/InterviewSchedulerAPI';

const SchedulingSidePanel: React.FC<{
  displayedSlot: InterviewSlot;
  scheduler: InterviewScheduler;
  refresh: () => Promise<void>;
}> = ({ displayedSlot, scheduler, refresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [lead, setLead] = useState(displayedSlot.lead);
  const [slotMembers, setSlotMembers] = useState(displayedSlot.members);
  const [applicant, setApplicant] = useState(displayedSlot.applicant);

  const isMember = useHasMemberPermission();
  const userEmail = useUserEmail();
  const members = useMembers();
  const self = useMember(userEmail);
  const isLead = self && LEAD_ROLES.includes(self.role);

  const slotStatus = useInterviewSlotStatus(displayedSlot);
  const { setSlots, setSelectedSlot } = useSetSlotsContext();

  useEffect(() => {
    setIsEditing(false);
    setLead(displayedSlot.lead);
    setSlotMembers(displayedSlot.members);
    setApplicant(displayedSlot.applicant);
  }, [displayedSlot]);

  const getMember = (email: string): IdolMember | null =>
    members.find((mem) => mem.email === email) ?? null;

  const leadOptions = [
    { text: 'Vacant' },
    ...members
      .filter((mem) => LEAD_ROLES.includes(mem.role))
      .map((mem) => ({
        text: `${mem.firstName} ${mem.lastName}`,
        value: mem.email
      }))
  ];

  const memberOptions = [
    { text: 'Vacant' },
    ...members.map((mem) => ({
      text: `${mem.firstName} ${mem.lastName}`,
      value: mem.email
    }))
  ];

  const applicantOptions = [
    { text: 'Vacant' },
    ...scheduler.applicants.map((app) => ({
      text: `${app.firstName} ${app.lastName}`,
      value: app.email
    }))
  ];

  const displayNameOrVacant = (person: Applicant | null) =>
    person ? (
      <span>
        {`${person.firstName} ${person.lastName}`} {person.email === userEmail && <em>(You)</em>}
      </span>
    ) : (
      <strong>Vacant</strong>
    );

  const displayCensoredName = (person: Applicant | null) => {
    if (!person) return <strong>Vacant</strong>;
    if (person.email === '') return <strong>Occupied</strong>;
    return displayNameOrVacant(person);
  };

  const handleAdminEditSave = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const edits: InterviewSlotEdit = {
      uuid: displayedSlot.uuid,
      interviewSchedulerUuid: displayedSlot.interviewSchedulerUuid,
      lead,
      members: slotMembers,
      applicant
    };

    InterviewSchedulerAPI.updateSlot(edits, false).then((val) => {
      setIsEditing(false);
      setSelectedSlot(undefined);
      if (val) {
        setSlots((prev) =>
          prev.map((slot) => (slot.uuid === edits.uuid ? { ...slot, ...edits } : slot))
        );
        Emitters.generalSuccess.emit({
          headerMsg: 'Edit Time Slot',
          contentMsg: `You have successfully edited time slot!`
        });
      } else {
        Emitters.generalError.emit({
          headerMsg: 'Edit Time Slot',
          contentMsg: 'Could not edit time slot!'
        });
      }
    });
  };

  const handleSignUpCancel = (isSigningUp: boolean) => {
    const leadEdit = isSigningUp ? getMember(userEmail) : null;
    const applicantEdit = isSigningUp
      ? scheduler.applicants.find((app) => app.email === userEmail)
      : null;
    let membersEdit: (IdolMember | null)[];
    if (isSigningUp) {
      const index = slotMembers.findIndex((item) => item === null);
      membersEdit =
        index !== -1
          ? [...slotMembers.slice(0, index), getMember(userEmail), ...slotMembers.slice(index + 1)]
          : slotMembers;
    } else {
      membersEdit = slotMembers.map((mem) => {
        if (!mem) return null;
        return mem.email === userEmail ? null : mem;
      });
    }

    const edits: InterviewSlotEdit = {
      uuid: displayedSlot.uuid,
      interviewSchedulerUuid: displayedSlot.interviewSchedulerUuid,
      lead: isLead ? leadEdit : undefined,
      applicant: !isMember ? applicantEdit : undefined,
      members: isMember && !isLead ? membersEdit : undefined
    };

    InterviewSchedulerAPI.updateSlot(edits, !isMember).then((val) => {
      setSelectedSlot(undefined);
      if (val) {
        setSlots((prev) =>
          prev.map((slot) =>
            slot.uuid === edits.uuid
              ? {
                  ...slot,
                  lead: edits.lead ?? slot.lead,
                  applicant: edits.applicant ?? slot.applicant,
                  members: edits.members ?? slot.members
                }
              : slot
          )
        );
        Emitters.generalSuccess.emit({
          headerMsg: `${isSigningUp ? 'Sign Up' : 'Cancel'} Time Slot`,
          contentMsg: `You have successfully ${isSigningUp ? 'signed up for' : 'cancelled'} this time slot!`
        });
      } else {
        Emitters.generalError.emit({
          headerMsg: `${isSigningUp ? 'Sign Up' : 'Cancel'} Time Slot`,
          contentMsg: `Could not ${isSigningUp ? 'sign up for' : 'cancel'} this time slot. Another user may have edited this time slot already.`
        });
        refresh();
        setSelectedSlot(undefined);
      }
    });
  };

  return (
    <div>
      <p>Date: {getDateString(displayedSlot.startTime, true)}</p>
      <p>
        Time: {getTimeString(displayedSlot.startTime)} -{' '}
        {getTimeString(displayedSlot.startTime + scheduler.duration)}
      </p>
      <p>Room: {displayedSlot.room}</p>
      <hr />
      {isMember && (
        <>
          <div>
            <div>
              <p>Lead: {!isEditing && displayNameOrVacant(displayedSlot.lead)}</p>
              {isEditing && (
                <Dropdown
                  search
                  selection
                  value={lead?.email}
                  options={leadOptions}
                  onChange={(_, data) =>
                    setLead(data.value === undefined ? null : getMember(data.value as string))
                  }
                />
              )}
            </div>
            <p>Members:</p>
            <ul>
              {displayedSlot.members.map((member, index) =>
                isEditing ? (
                  <li key={member?.netid} className={styles.memberListItem}>
                    <Dropdown
                      search
                      selection
                      value={slotMembers[index]?.email}
                      options={memberOptions}
                      onChange={(_, data) =>
                        setSlotMembers(
                          slotMembers.map((mem, i) => {
                            if (i === index) {
                              return data.value === undefined
                                ? null
                                : getMember(data.value as string);
                            }
                            return mem;
                          })
                        )
                      }
                    />
                  </li>
                ) : (
                  <li key={member?.netid}>{displayNameOrVacant(member)}</li>
                )
              )}
            </ul>
          </div>
          <hr />
        </>
      )}
      {(isLead || !isMember) && (
        <div>
          <p>
            Applicant:{' '}
            {!isEditing &&
              (isLead
                ? displayNameOrVacant(displayedSlot.applicant)
                : displayCensoredName(displayedSlot.applicant))}
          </p>
          {isEditing && (
            <Dropdown
              search
              selection
              value={applicant?.email}
              options={applicantOptions}
              onChange={(_, data) => {
                setApplicant(
                  data.value === undefined
                    ? null
                    : scheduler.applicants.find((app) => app.email === (data.value as string)) ??
                        null
                );
              }}
            />
          )}
        </div>
      )}
      <div className={styles.buttonContainer}>
        {isLead && (
          <>
            <InterviewSlotDeleteModal slot={displayedSlot} setSlots={setSlots} />
            <Button basic onClick={handleAdminEditSave}>
              {isEditing ? 'Save' : 'Edit'}
            </Button>
            {isEditing && (
              <Button basic color="red" onClick={() => setIsEditing(false)}>
                Cancel Editing
              </Button>
            )}
          </>
        )}
        {scheduler.isOpen && !isLead && (slotStatus === 'possessed' || slotStatus === 'vacant') && (
          <Button
            basic
            color={slotStatus === 'possessed' ? 'red' : undefined}
            onClick={() => handleSignUpCancel(slotStatus === 'vacant')}
          >
            {slotStatus === 'possessed' ? 'Cancel Sign Up' : 'Sign Up'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SchedulingSidePanel;
