interface EmailChanges {
  readonly cancelledApplicantEmails: string[];
  readonly signedUpApplicantEmails: string[];
  readonly cancelledMemberEmails: string[];
  readonly signedUpMemberEmails: string[];
}

/**
 * Detects applicant and member email changes between two slot states.
 * Leads are excluded.
 */
export default function detectEmailChanges(
  oldSlot: InterviewSlot,
  newSlot: InterviewSlot
): EmailChanges {
  const cancelledApplicantEmails: string[] = [];
  const signedUpApplicantEmails: string[] = [];

  if (oldSlot.applicant?.email && oldSlot.applicant.email !== newSlot.applicant?.email) {
    cancelledApplicantEmails.push(oldSlot.applicant.email);
  }
  if (newSlot.applicant?.email && newSlot.applicant.email !== oldSlot.applicant?.email) {
    signedUpApplicantEmails.push(newSlot.applicant.email);
  }

  const oldMemberEmails = new Set(oldSlot.members.filter((m) => m?.email).map((m) => m!.email));
  const newMemberEmails = new Set(newSlot.members.filter((m) => m?.email).map((m) => m!.email));

  const cancelledMemberEmails = Array.from(oldMemberEmails).filter(
    (email) => !newMemberEmails.has(email)
  );
  const signedUpMemberEmails = Array.from(newMemberEmails).filter(
    (email) => !oldMemberEmails.has(email)
  );

  return {
    cancelledApplicantEmails,
    signedUpApplicantEmails,
    cancelledMemberEmails,
    signedUpMemberEmails
  };
}

/**
 * Groups slots by their lead's email, skipping slots without a lead.
 * Each lead's slots are sorted by start time.
 */
export function groupSlotsByLead(slots: InterviewSlot[]): Map<string, InterviewSlot[]> {
  const slotsByLead = new Map<string, InterviewSlot[]>();
  [...slots]
    .sort((a, b) => a.startTime - b.startTime)
    .forEach((slot) => {
      const email = slot.lead?.email;
      if (!email) return;
      slotsByLead.set(email, [...(slotsByLead.get(email) ?? []), slot]);
    });
  return slotsByLead;
}
