import React, { useMemo, useState } from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import ReimbursementAPI from '../../../API/ReimbursementAPI';
import { useSelf } from '../../Common/FirestoreDataProvider';
import { Emitters } from '../../../utils';
import styles from './SubmitRequestModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  teams: ReimbursementTeam[];
};

type Step = 'basic' | 'receipt' | 'review';

const STEPS: { key: Step; label: string; icon: 'user circle' | 'upload' | 'paper plane' }[] = [
  { key: 'basic', label: 'Basic information', icon: 'user circle' },
  { key: 'receipt', label: 'Receipt & purchase', icon: 'upload' },
  { key: 'review', label: 'Review and submit', icon: 'paper plane' }
];

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

const toDateInputValue = (timestamp: number): string => {
  const d = new Date(timestamp);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const fromDateInputValue = (value: string): number => {
  const [yyyy, mm, dd] = value.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd).getTime();
};

const SubmitRequestModal: React.FC<Props> = ({ open, onClose, onSubmitted, teams }) => {
  const user = useSelf()!;
  const [step, setStep] = useState<Step>('basic');
  const [submitting, setSubmitting] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [attendees, setAttendees] = useState('');

  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [dateOfPurchase, setDateOfPurchase] = useState(toDateInputValue(Date.now()));
  const [receiptUrl, setReceiptUrl] = useState('');

  const teamId = teams.length === 1 ? teams[0].teamId : selectedTeamId;
  const selectedTeam = teams.find((t) => t.teamId === teamId);

  const reset = () => {
    setStep('basic');
    setSelectedTeamId('');
    setPhone('');
    setAddress('');
    setAttendees('');
    setAmount('');
    setReason('');
    setDateOfPurchase(toDateInputValue(Date.now()));
    setReceiptUrl('');
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const basicValid = useMemo(
    () => Boolean(teamId) && phone.trim().length > 0 && address.trim().length > 0,
    [teamId, phone, address]
  );

  const receiptValid = useMemo(() => {
    const amt = Number(amount);
    return (
      Number.isFinite(amt) &&
      amt > 0 &&
      reason.trim().length > 0 &&
      dateOfPurchase.length > 0 &&
      isValidUrl(receiptUrl.trim())
    );
  }, [amount, reason, dateOfPurchase, receiptUrl]);

  const goNext = () => {
    if (step === 'basic' && basicValid) setStep('receipt');
    else if (step === 'receipt' && receiptValid) setStep('review');
  };

  const goBack = () => {
    if (step === 'review') setStep('receipt');
    else if (step === 'receipt') setStep('basic');
  };

  const handleSubmit = async () => {
    if (!basicValid || !receiptValid) return;
    setSubmitting(true);
    try {
      await ReimbursementAPI.createRequest({
        teamId,
        amount: Number(amount),
        reason: reason.trim(),
        attendees: attendees
          .split(/[,\n]/)
          .map((a) => a.trim())
          .filter(Boolean),
        dateOfPurchase: fromDateInputValue(dateOfPurchase),
        receiptUrl: receiptUrl.trim(),
        requesterPhoneNumber: phone.trim(),
        requesterAddress: address.trim()
      });
      Emitters.generalSuccess.emit({
        headerMsg: 'Request submitted',
        contentMsg: 'Your reimbursement request has been submitted.'
      });
      reset();
      onSubmitted();
    } catch (err) {
      Emitters.generalError.emit({
        headerMsg: "Couldn't submit reimbursement request",
        contentMsg: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderTeamField = () => {
    if (teams.length === 0) {
      return (
        <input
          className={styles.input}
          value="You are not assigned to any reimbursement team."
          disabled
        />
      );
    }
    if (teams.length === 1) {
      return <input className={styles.input} value={teams[0].teamName} disabled />;
    }
    return (
      <select
        className={styles.input}
        value={teamId}
        onChange={(e) => setSelectedTeamId(e.target.value)}
        required
      >
        <option value="">Select a team...</option>
        {teams.map((t) => (
          <option key={t.teamId} value={t.teamId}>
            {t.teamName}
          </option>
        ))}
      </select>
    );
  };

  return (
    <Modal open={open} onClose={handleClose} size="large" className={styles.modal}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Submit new request</h2>
          <nav className={styles.stepsNav}>
            {STEPS.map((s) => (
              <div
                key={s.key}
                className={`${styles.stepItem} ${step === s.key ? styles.stepActive : ''}`}
              >
                <Icon name={s.icon} />
                <span>{s.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <button type="button" className={styles.closeButton} onClick={handleClose}>
            <Icon name="close" />
          </button>

          {step === 'basic' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Basic information</h3>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    className={styles.input}
                    value={`${user.firstName} ${user.lastName}`}
                    disabled
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>NetID</span>
                  <input className={styles.input} value={user.netid} disabled />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Phone Number *</span>
                  <input
                    className={styles.input}
                    placeholder="1234567891"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Address *</span>
                  <input
                    className={styles.input}
                    placeholder="1234 Doe Ave"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </label>
                <label className={`${styles.field} ${styles.fieldFull}`}>
                  <span className={styles.label}>Team *</span>
                  {renderTeamField()}
                </label>
              </div>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>
                  If this reimbursement is for a social, who were the attendees? (comma-separated)
                </span>
                <textarea
                  className={styles.textarea}
                  placeholder="Alice, Bob, Charlie"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </label>
            </div>
          )}

          {step === 'receipt' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Receipt & purchase details</h3>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span className={styles.label}>Amount (USD) *</span>
                  <input
                    className={`${styles.input} ${styles.noSpinner}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="50.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Date of purchase *</span>
                  <input
                    className={styles.input}
                    type="date"
                    value={dateOfPurchase}
                    onChange={(e) => setDateOfPurchase(e.target.value)}
                    required
                  />
                </label>
              </div>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Reason *</span>
                <input
                  className={styles.input}
                  placeholder="Team social snacks"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </label>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>Receipt link *</span>
                <input
                  className={styles.input}
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={receiptUrl}
                  onChange={(e) => setReceiptUrl(e.target.value)}
                  required
                />
                <span className={styles.dropzoneHint}>
                  Paste a shareable link (Google Drive, Dropbox, etc.) to your receipt.
                </span>
              </label>
            </div>
          )}

          {step === 'review' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Review and submit</h3>
              <div className={styles.reviewSection}>
                <div className={styles.reviewSectionTitle}>Basic information</div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Name</span>
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>NetID</span>
                  <span>{user.netid}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Team</span>
                  <span>{selectedTeam?.teamName ?? '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Phone</span>
                  <span>{phone}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Address</span>
                  <span>{address}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Attendees</span>
                  <span>{attendees || '—'}</span>
                </div>
              </div>
              <div className={styles.reviewSection}>
                <div className={styles.reviewSectionTitle}>Purchase</div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Amount</span>
                  <span>${Number(amount).toFixed(2)}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Date of purchase</span>
                  <span>{dateOfPurchase}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Reason</span>
                  <span>{reason}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Receipt</span>
                  <a href={receiptUrl} target="_blank" rel="noreferrer">
                    View receipt
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className={styles.footer}>
            {step !== 'basic' && (
              <Button basic onClick={goBack} disabled={submitting}>
                Back
              </Button>
            )}
            <div className={styles.footerSpacer} />
            {step !== 'review' ? (
              <Button
                primary
                onClick={goNext}
                disabled={step === 'basic' ? !basicValid : !receiptValid}
              >
                Next
              </Button>
            ) : (
              <Button
                primary
                onClick={handleSubmit}
                loading={submitting}
                disabled={submitting || !basicValid || !receiptValid}
              >
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubmitRequestModal;
