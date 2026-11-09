import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { LEAD_ROLES, ADVISOR_ROLES } from 'common-types/constants';
import { Button, Card, Input, IconButton } from '../../../design-system-2026/components';
import { Combobox } from '../../../design-system-2026/components/Combobox/Combobox';
import { PlusIcon, TrashIcon } from '../../../design-system-2026/icons';
import {
  calculateCredits,
  Emitters,
  getNetIDFromEmail,
  getRequiredKindCredits,
  getTECPeriod,
  withKindCreditDefaults
} from '../../../utils';
import { useSelf } from '../../../components/Common/FirestoreDataProvider';
import { TeamEventsAPI } from '../../../API/TeamEventsAPI';
import TeamEventCreditDashboard from './TeamEventsCreditDashboard';
import styles from './TeamEventCredits.module.css';
import ImagesAPI from '../../../API/ImagesAPI';

import TecConfigAPI from '../../../API/TecConfigAPI';

const TeamEventCreditForm: React.FC = () => {
  // When the user is logged in, `useSelf` always return non-null data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userInfo = useSelf()!;
  const [teamEvent, setTeamEvent] = useState<TeamEventInfo | undefined>(undefined);
  const [hours, setHours] = useState('');
  const [teamEventInfoList, setTeamEventInfoList] = useState<TeamEventInfo[]>([]);
  const [approvedAttendance, setApprovedAttendance] = useState<TeamEventAttendance[]>([]);
  const [pendingAttendance, setPendingAttendance] = useState<TeamEventAttendance[]>([]);
  const [rejectedAttendance, setRejectedAttendance] = useState<TeamEventAttendance[]>([]);
  const [isAttendanceLoading, setIsAttendanceLoading] = useState<boolean>(true);
  const [images, setImages] = useState<string[]>(['']);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [tecConfig, setTecConfig] = useState<TECConfig | null>(null);

  useEffect(() => {
    TeamEventsAPI.getAllTeamEventInfo()
      .then((teamEvents) => setTeamEventInfoList(teamEvents))
      .catch(() => setLoadError(true));
    TeamEventsAPI.getTeamEventAttendanceByUser()
      .then((attendance) => {
        setApprovedAttendance(attendance.filter((attendee) => attendee.status === 'approved'));
        setPendingAttendance(attendance.filter((attendee) => attendee.status === 'pending'));
        setRejectedAttendance(attendance.filter((attendee) => attendee.status === 'rejected'));
        setIsAttendanceLoading(false);
      })
      .catch(() => setLoadError(true));
    TecConfigAPI.getTecConfig()
      .then((config) => setTecConfig(withKindCreditDefaults(config)))
      .catch(() => setLoadError(true));
  }, []);
  if (!tecConfig || loadError)
    return (
      <div className={styles.page} role="status">
        <h1 className="idol-heading-1">Team Event Credits</h1>
        <Card>
          <p>{loadError ? 'Could not load team event credits.' : 'Loading team event credits…'}</p>
          {loadError && (
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Try again
            </Button>
          )}
        </Card>
      </div>
    );

  const tecDeadlines = tecConfig.periodEndDates.map((d) => new Date(d));
  const { requiredMemberTecCredits, requiredLeadTecCredits } = tecConfig;

  const approvedTECDates = approvedAttendance
    .map((attendance) => {
      const matchingEvent = teamEventInfoList.find((event) => event.uuid === attendance.eventUuid);
      return matchingEvent
        ? {
            date: new Date(matchingEvent.date),
            credits:
              parseFloat(matchingEvent.numCredits) *
              (matchingEvent.hasHours ? attendance.hoursAttended ?? 1 : 1)
          }
        : null;
    })
    .filter((entry): entry is { date: Date; credits: number } => entry !== null);

  const tecCounts: number[] = Array.from({ length: tecDeadlines.length }, () => 0);
  approvedTECDates.forEach(({ date, credits }) => {
    const period = getTECPeriod(date, tecDeadlines);
    if (period < tecCounts.length) tecCounts[period] += credits;
  });

  const internalCounts: number[] = Array.from({ length: tecDeadlines.length }, () => 0);
  const externalCounts: number[] = Array.from({ length: tecDeadlines.length }, () => 0);
  approvedAttendance.forEach((attendance) => {
    const matchingEvent = teamEventInfoList.find((event) => event.uuid === attendance.eventUuid);
    if (!matchingEvent?.kind) return;
    const credits =
      matchingEvent.hasHours && attendance.hoursAttended
        ? Number(matchingEvent.numCredits) * attendance.hoursAttended
        : Number(matchingEvent.numCredits);
    const period = getTECPeriod(new Date(matchingEvent.date), tecDeadlines);
    if (period >= tecDeadlines.length) return;
    if (matchingEvent.kind === 'internal') internalCounts[period] += credits;
    if (matchingEvent.kind === 'external') externalCounts[period] += credits;
  });

  let requiredCredits = requiredMemberTecCredits;
  if (ADVISOR_ROLES.includes(userInfo.role)) {
    requiredCredits = 0;
  } else if (LEAD_ROLES.includes(userInfo.role)) {
    requiredCredits = requiredLeadTecCredits;
  }

  const getCurrentCreditsNeeded = () => {
    const currentPeriod = getTECPeriod(new Date(), tecDeadlines);
    const currentCredits = tecCounts[currentPeriod] || 0;

    return calculateCredits(currentCredits, requiredCredits);
  };

  const remainingCredits = getCurrentCreditsNeeded();
  const requiredKindCredits = getRequiredKindCredits(userInfo.role, tecConfig);
  const currentPeriodIndex = getTECPeriod(new Date(), tecDeadlines);
  const remainingInternalCredits = calculateCredits(
    internalCounts[currentPeriodIndex] || 0,
    requiredKindCredits.internal
  );
  const remainingExternalCredits = calculateCredits(
    externalCounts[currentPeriodIndex] || 0,
    requiredKindCredits.external
  );

  const handleAddIconClick = () => {
    setImages((images) => [...images, '']);
  };

  const handleNewImage = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    if (!e.target.files?.[0]) return;
    if (!['image/png', 'image/jpeg'].includes(e.target.files[0].type)) {
      Emitters.generalError.emit({
        headerMsg: 'Unsupported file',
        contentMsg: 'Choose a PNG or JPEG image.'
      });
      return;
    }
    if (images[index]) URL.revokeObjectURL(images[index]);
    const newImage = URL.createObjectURL(e.target.files[0]);
    const newImages = images.map((currentImage, i) => {
      if (i === index) {
        return newImage;
      }
      return currentImage;
    });
    setImages(newImages);
  };

  const requestTeamEventCredit = async (
    eventCreditRequest: TeamEventAttendance,
    uploadedImage: string
  ) => {
    const blob = await fetch(uploadedImage).then((res) => res.blob());
    await ImagesAPI.uploadImage(blob, `${eventCreditRequest.image}`);
    return TeamEventsAPI.requestTeamEventCredit(eventCreditRequest);
  };

  const getCreditsWithHours = (teamEvent: TeamEventInfo | undefined, hours: number) =>
    teamEvent?.hasHours
      ? Number(teamEvent?.numCredits || 0) * hours
      : Number(teamEvent?.numCredits || 0);

  const submitTeamEventCredit = async () => {
    const getCredits: (attendance: TeamEventAttendance[]) => number = (attendance) => {
      const filteredAttendance = attendance.filter((event) => event.eventUuid === teamEvent?.uuid);
      const sum = filteredAttendance.reduce(
        (acc, attendance) => acc + getCreditsWithHours(teamEvent, attendance.hoursAttended || 0),
        0
      );

      return sum;
    };

    const submittedCredits = getCredits(approvedAttendance) + getCredits(pendingAttendance);
    const creditsToSubmit = images.length * getCreditsWithHours(teamEvent, Number(hours));

    if (!teamEvent) {
      Emitters.generalError.emit({
        headerMsg: 'No Team Event Selected',
        contentMsg: 'Please select a team event!'
      });
    } else if (images.some((image) => image === '')) {
      Emitters.generalError.emit({
        headerMsg: 'Unsuccessful Image Upload',
        contentMsg: 'Please upload all images from top to bottom!'
      });
    } else if (teamEvent.hasHours && (hours === '' || isNaN(Number(hours)))) {
      Emitters.generalError.emit({
        headerMsg: 'No Hours Entered',
        contentMsg: 'Please enter your hours!'
      });
    } else if (teamEvent.hasHours && Number(hours) < 0.5) {
      Emitters.generalError.emit({
        headerMsg: 'Minimum Hours Violated',
        contentMsg: 'Team events must be logged for at least 0.5 hours!'
      });
    } else if (submittedCredits + creditsToSubmit > Number(teamEvent.maxCredits)) {
      Emitters.generalError.emit({
        headerMsg: 'Maximum Credits Violated',
        contentMsg: `You have ${submittedCredits} pending or approved credit(s) for the event! Submitting a total of ${
          submittedCredits + creditsToSubmit
        } credit(s) exceeds the event credit limit of ${teamEvent.maxCredits} credit(s).`
      });
    } else {
      await Promise.allSettled(
        images.map(async (image, i) => {
          const newTeamEventAttendance: TeamEventAttendance = {
            member: userInfo,
            hoursAttended: teamEvent.hasHours ? Number(hours) : undefined,
            image: `eventProofs/${getNetIDFromEmail(
              userInfo.email
            )}/${new Date().toISOString()}[${i}]`,
            eventUuid: teamEvent.uuid,
            status: 'pending' as Status,
            reason: '',
            uuid: ''
          };

          const createdAttendance = await requestTeamEventCredit(newTeamEventAttendance, image);

          if (createdAttendance) {
            setPendingAttendance((pending) => [...pending, createdAttendance]);
            setImages((current) => current.filter((item) => item !== image));
            URL.revokeObjectURL(image);
          }
        })
      ).then((results) => {
        if (results.some((result) => result.status === 'rejected'))
          throw new Error('Partial submission failure');
      });
      Emitters.generalSuccess.emit({
        headerMsg: 'Team Event Credit submitted!',
        contentMsg: 'Team event credit submitted.'
      });
      setTeamEvent(undefined);
      setHours('0');
      images.forEach((image) => URL.revokeObjectURL(image));
      setImages(['']);
    }
  };

  const period = getTECPeriod(new Date(), tecDeadlines);
  const eventLabel = (event: TeamEventInfo) =>
    `${event.name} · ${new Date(event.date).toLocaleDateString()} · ${event.numCredits} credit(s)${event.hasHours ? '/hour' : ''} · ${event.maxCredits} max${tecConfig.considerEventKind && event.kind ? ` · ${event.kind}` : ''}${event.isInitiativeEvent ? ' · Initiative' : ''}`;
  return (
    <div className={styles.page}>
      <Head>
        <title>Team Event Credits · IDOL</title>
      </Head>
      <h1 className="idol-heading-1">Team Event Credits</h1>
      <div className={styles.layout}>
        <div className={styles.main}>
          <Card header="Submit team event credits">
            <form
              className={styles.form}
              onSubmit={async (event) => {
                event.preventDefault();
                if (busy) return;
                setBusy(true);
                try {
                  await submitTeamEventCredit();
                } catch {
                  Emitters.generalError.emit({
                    headerMsg: 'Could not submit TEC',
                    contentMsg:
                      'Please check your connection and try again. Any successful submissions remain in your history.'
                  });
                } finally {
                  setBusy(false);
                }
              }}
            >
              <p>
                Earn team event credits for participating in DTI events! Fill out this form every
                time and attach a picture of yourself at the event to receive credit.{' '}
                {tecDeadlines[period] ? (
                  <>
                    The current TEC period ends on{' '}
                    <strong>
                      {tecDeadlines[period].toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </strong>
                    .
                  </>
                ) : (
                  'There is no upcoming period.'
                )}
              </p>
              <p>
                {tecConfig.considerEventKind
                  ? `You need: ${remainingInternalCredits} internal, ${remainingExternalCredits} external credits.`
                  : `You need: ${remainingCredits} more credits this period.`}
              </p>
              <Combobox
                id="tec-event"
                label="Select a team event"
                required
                options={teamEventInfoList
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(eventLabel)}
                value={teamEvent ? eventLabel(teamEvent) : ''}
                onValueChange={(label) => {
                  if (!busy)
                    setTeamEvent(teamEventInfoList.find((event) => eventLabel(event) === label));
                }}
                placeholder="Search events..."
              />
              {teamEvent?.hasHours && (
                <Input
                  id="tec-hours"
                  label="How many hours did you attend?"
                  required
                  type="number"
                  min={0.5}
                  step="any"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  disabled={busy}
                />
              )}
              <div className={styles.proofs}>
                <p className={styles.label}>Upload your event picture *</p>
                <p>
                  Please include a picture of yourself (and others) and/or an email chain only if
                  the former is not possible. Add another submission to the same event if its credit
                  limit allows it.
                </p>
                {images.map((image, index) => (
                  <div key={index} className={styles.proof}>
                    <label className={styles.fileButton}>
                      Choose file
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        aria-label={`Proof for submission ${index + 1}`}
                        disabled={busy}
                        onChange={(event) => handleNewImage(event, index)}
                      />
                    </label>
                    {image && (
                      <img
                        src={image}
                        width={96}
                        height={96}
                        alt={`Proof for submission ${index + 1}`}
                      />
                    )}
                    <IconButton
                      variant="tertiary"
                      aria-label={`Remove submission ${index + 1}`}
                      disabled={busy || (images.length === 1 && !image)}
                      icon={<TrashIcon size={16} />}
                      onClick={() => {
                        if (image) URL.revokeObjectURL(image);
                        setImages(
                          images.length === 1 ? [''] : images.filter((_, i) => i !== index)
                        );
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  disabled={busy}
                  icon={<PlusIcon size={16} />}
                  onClick={handleAddIconClick}
                >
                  Add submission
                </Button>
                <Button
                  type="submit"
                  disabled={busy || isAttendanceLoading}
                  icon={<PlusIcon size={16} />}
                >
                  {busy ? 'Submitting…' : 'Submit TEC'}
                </Button>
              </div>
            </form>
          </Card>
          <TeamEventCreditDashboard
            allTEC={teamEventInfoList}
            approvedAttendance={approvedAttendance}
            pendingAttendance={pendingAttendance}
            rejectedAttendance={rejectedAttendance}
            isAttendanceLoading={isAttendanceLoading}
            setPendingAttendance={setPendingAttendance}
            requiredPeriodCredits={remainingCredits}
            tecCounts={tecCounts}
            tecDeadlines={tecDeadlines}
            tecConfig={tecConfig}
            remainingInternalCredits={remainingInternalCredits}
            remainingExternalCredits={remainingExternalCredits}
            internalCounts={internalCounts}
            externalCounts={externalCounts}
          />
        </div>
        <aside className={styles.periods} aria-label="Credit periods">
          {tecDeadlines.map((deadline, index) => (
            <Card
              key={deadline.toISOString()}
              header={index === period ? 'Current' : ['Past', 'Upcoming'][Number(index > period)]}
            >
              <h2 className={styles.periodTitle}>Period {index + 1}</h2>
              <p>
                Ends:{' '}
                {deadline.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'UTC'
                })}
              </p>
              {tecConfig.considerEventKind ? (
                <dl className={styles.counts}>
                  <div>
                    <dt>Internal</dt>
                    <dd>{internalCounts[index]}</dd>
                  </div>
                  <div>
                    <dt>External</dt>
                    <dd>{externalCounts[index]}</dd>
                  </div>
                </dl>
              ) : (
                <p>Approved credits: {tecCounts[index]}</p>
              )}
            </Card>
          ))}
        </aside>
      </div>
    </div>
  );
};
export default TeamEventCreditForm;
