import { Button, Icon, Sidebar } from 'semantic-ui-react';
import { useMemo } from 'react';
import { Emitters } from '../../utils';
import styles from './UnassignedApplicantsSidebar.module.css';

interface UnassignedApplicantsSidebarProps {
  visible: boolean;
  onClose: () => void;
  scheduler: InterviewScheduler;
  slots: InterviewSlot[];
}

const UnassignedApplicantsSidebar: React.FC<UnassignedApplicantsSidebarProps> = ({
  visible,
  onClose,
  scheduler,
  slots
}) => {
  // finding unassigned applicants
  const unassignedApplicants = useMemo(() => {
    const assignedEmails = new Set(slots.flatMap((slot) => slot.applicant?.email ?? []));
    return scheduler.applicants.filter((applicant) => !assignedEmails.has(applicant.email));
  }, [scheduler.applicants, slots]);

  const handleCopyAllEmails = () => {
    const emails = unassignedApplicants.map((app) => app.email).join(', ');
    navigator.clipboard
      .writeText(emails)
      .then(() => {
        Emitters.generalSuccess.emit({
          headerMsg: 'Emails Copied',
          contentMsg: `Copied ${unassignedApplicants.length} email${unassignedApplicants.length !== 1 ? 's' : ''} to clipboard.`
        });
      })
      .catch(() => {
        Emitters.generalError.emit({
          headerMsg: 'Unable to Copy',
          contentMsg: 'Failed to copy emails to clipboard!'
        });
      });
  };

  return (
    <Sidebar
      as="div"
      animation="overlay"
      direction="right"
      visible={visible}
      onHide={onClose}
      width="wide"
      className={styles.sidebar}
    >
      <div className={styles.sidebarContent}>
        <div className={styles.header}>
          <h3>Unassigned Applicants</h3>
          <Icon name="close" onClick={onClose} className={styles.closeIcon} />
        </div>
        <div className={styles.buttonContainer}>
          <Button basic onClick={handleCopyAllEmails}>
            Copy all emails
          </Button>
        </div>
        <div className={styles.applicantsList}>
          {unassignedApplicants.length === 0 ? (
            <p>All applicants have been assigned to slots.</p>
          ) : (
            <ul>
              {unassignedApplicants.map((applicant) => (
                <li key={applicant.email} className={styles.applicantItem}>
                  <div>
                    {' '}
                    <strong>
                      {applicant.firstName} {applicant.lastName}{' '}
                    </strong>
                  </div>
                  <div>{applicant.email}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Sidebar>
  );
};

export default UnassignedApplicantsSidebar;
