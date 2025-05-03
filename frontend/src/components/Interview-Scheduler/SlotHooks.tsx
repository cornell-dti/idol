import { LEAD_ROLES } from 'common-types/constants';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { useHasMemberPermission, useMember } from '../Common/FirestoreDataProvider';
import { useUserEmail } from '../Common/UserProvider/UserProvider';

export const SetSlotsContext = createContext<{
  setSlots: Dispatch<SetStateAction<InterviewSlot[]>>;
  setSelectedSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
  setHoveredSlot: Dispatch<SetStateAction<InterviewSlot | undefined>>;
} | null>(null);

export const EditAvailabilityContext = createContext<{
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  tentativeSlots: InterviewSlot[];
  setTentativeSlots: Dispatch<SetStateAction<InterviewSlot[]>>;
} | null>(null);

export const useInterviewSlotStatus = (slot: InterviewSlot): SlotStatus => {
  const isMember = useHasMemberPermission();
  const userEmail = useUserEmail();

  const self = useMember(userEmail);
  const isLead = self !== undefined && LEAD_ROLES.includes(self.role);

  if (isLead) {
    if (slot.lead === null) return 'vacant';
    return slot.lead !== null && slot.lead.email === userEmail ? 'possessed' : 'occupied';
  }
  if (isMember) {
    if (slot.members.some((mem) => mem && mem.email === userEmail)) return 'possessed';
    return slot.members.some((mem) => mem === null) ? 'vacant' : 'occupied';
  }
  if (slot.applicant === null) return 'vacant';
  return slot.applicant !== null && slot.applicant.email === userEmail ? 'possessed' : 'occupied';
};

export const useSetSlotsContext = () => {
  const setSlotsContext = useContext(SetSlotsContext);
  if (!setSlotsContext) throw new Error('No SetSlotsContext value provided.');
  return setSlotsContext;
};

export const useEditAvailabilityContext = () => {
  const editAvailabilityContext = useContext(EditAvailabilityContext);
  if (!editAvailabilityContext) throw new Error('No EditAvailabilityContext value provided.');
  return editAvailabilityContext;
};
