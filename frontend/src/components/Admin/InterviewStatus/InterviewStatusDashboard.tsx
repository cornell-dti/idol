import React, { useState, useEffect } from 'react';
import {
  Table,
  Header,
  Loader,
  Button,
  Dropdown,
  DropdownProps,
  Checkbox
} from 'semantic-ui-react';
import styles from './InterviewStatusDashboard.module.css';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import AddInterviewStatusForm from './AddInterviewStatusForm';
import { Emitters } from '../../../utils';

interface InterviewStatus {
  uuid?: string;
  name: string;
  netid: string;
  role: string;
  round: string;
  status: 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided';
}

const InterviewStatusDashboard: React.FC = () => {
  const [applicants, setApplicants] = useState<InterviewStatus[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<InterviewStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<string | null>('All Rounds');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());

  const fetchApplicants = async () => {
    try {
      const data = await InterviewStatusAPI.getAllInterviewStatuses();
      setApplicants(data || []);
      setFilteredApplicants(data || []);
    } catch (error) {
      console.error('Error fetching interview statuses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleSelect = (applicantUuid: string) => {
    setSelectedApplicants((prev: Set<string>) => {
      const updatedSet = new Set(prev);
      if (updatedSet.has(applicantUuid)) {
        updatedSet.delete(applicantUuid);
      } else {
        updatedSet.add(applicantUuid);
      }
      return updatedSet;
    });
  };

  const handleRoundChange = (_: unknown, data: DropdownProps) => {
    const { value } = data;
    if (typeof value === 'string') {
      setSelectedRound(value);
      applyFilters(value, selectedFilters);
    }
  };

  const handleFilterChange = (_: unknown, data: DropdownProps) => {
    const { value } = data;
    if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
      setSelectedFilters(value as string[]);
      applyFilters(selectedRound, value as string[]);
    }
  };

  const applyFilters = (roundFilter: string | null, applicantFilters: string[]) => {
    let filtered = applicants;

    if (roundFilter && roundFilter !== 'All Rounds') {
      filtered = filtered.filter((applicant) => applicant.round === roundFilter);
    }

    if (applicantFilters.length > 0) {
      filtered = filtered.filter((applicant) =>
        applicantFilters.every((filter) => applicant.status === filter || applicant.role === filter)
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleCopyEmails = () => {
    let emailList = '';
    if (selectedApplicants.size > 0) {
      emailList = Array.from(selectedApplicants)
        .map((uuid: string) => {
          const applicant = applicants.find((a) => a.uuid === uuid);
          return `${applicant?.netid}@cornell.edu`;
        })
        .join(', ');
    } else {
      emailList = filteredApplicants
        .map((applicant) => `${applicant.netid}@cornell.edu`)
        .join(', ');
    }
    navigator.clipboard.writeText(emailList).then(() => {
      Emitters.generalSuccess.emit({
        headerMsg: 'Success!',
        contentMsg: `Emails copied to clipboard.`
      });
    });
  };

  const handleDeleteStatus = async () => {
    if (selectedApplicants.size === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No applicants are selected!',
        contentMsg: `Please select at least one status to proceed.`
      });
    } else {
      try {
        const deletePromises = Array.from(selectedApplicants).map((uuid) =>
          InterviewStatusAPI.deleteInterviewStatus(uuid).catch(() => {
            Emitters.generalError.emit({
              headerMsg: 'Error deleting applicant status.',
              contentMsg: `Could not delete status for ${uuid}.`
            });
          })
        );
        await Promise.all(deletePromises);
        setSelectedApplicants(new Set());
        await fetchApplicants();
        Emitters.generalSuccess.emit({
          headerMsg: 'Sucess!',
          contentMsg: `Selected interview statuses are now deleted.`
        });
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  };

  const handleProceed = async () => {
    if (selectedApplicants.size === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No applicants are selected!',
        contentMsg: `Please select at least one status to proceed.`
      });
      return;
    }

    const promotedNames: string[] = [];
    const errors: string[] = [];
    const updatePromises: Promise<void>[] = [];

    Array.from(selectedApplicants).forEach((uuid) => {
      const applicant = applicants.find((app) => app.uuid === uuid);

      if (!applicant) {
        errors.push(`Applicant with ID ${uuid} not found.`);
        return;
      }

      const { name, round, status, role } = applicant;

      if (status !== 'Accepted') {
        errors.push(`${name} has not been accepted and cannot proceed.`);
      } else if (round === 'Technical') {
        errors.push(`${role} ${name} is already at the final round.`);
      } else {
        const newRound = round === 'Behavioral' ? 'Technical' : 'Behavioral';
        const updatedStatus = { ...applicant, uuid: uuid!, round: newRound };

        const promise = InterviewStatusAPI.updateInterviewStatus(updatedStatus)
          .then(() => {
            promotedNames.push(name);
          })
          .catch(() => {
            errors.push(`API error: Could not update round for ${name}.`);
          });

        updatePromises.push(promise);
      }
    });

    try {
      await Promise.all(updatePromises);
      setSelectedApplicants(new Set());
      await fetchApplicants();

      if (promotedNames.length > 0) {
        const msg = `Promoted ${promotedNames.join(', ')} to next round`;
        Emitters.generalSuccess.emit({
          headerMsg: 'Success!',
          contentMsg: msg
        });
      }

      if (errors.length > 0) {
        Emitters.generalError.emit({
          headerMsg: 'Some applicants were not promoted.',
          contentMsg: errors.join(' ')
        });
      }
    } catch (error) {
      console.log('Unexpected error during round promotion: ', error);
    }
  };

  const updateStatus = async (newStatus: 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided') => {
    if (selectedApplicants.size === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No applicants are selected!',
        contentMsg: `Please select at least one status to proceed.`
      });
      return;
    }
    try {
      const updatePromises = Array.from(selectedApplicants).map(async (uuid) => {
        const applicant = applicants.find((applicant) => applicant.uuid === uuid);
        if (!applicant) return;

        const updatedStatus = { ...applicant, uuid: applicant.uuid!, status: newStatus };
        InterviewStatusAPI.updateInterviewStatus(updatedStatus).catch(() => {
          Emitters.generalError.emit({
            headerMsg: 'Error',
            contentMsg: `Could not update status for ${uuid}.`
          });
        });
      });
      await Promise.all(updatePromises);
      setSelectedApplicants(new Set());
      await fetchApplicants();
      Emitters.generalSuccess.emit({
        headerMsg: 'Success!',
        contentMsg: `${newStatus} selected applicants.`
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  if (isLoading) return <Loader active>Loading applicant data...</Loader>;

  const filterOptions = [
    { key: 'accepted', text: 'Accepted', value: 'Accepted' },
    { key: 'rejected', text: 'Rejected', value: 'Rejected' },
    { key: 'waitlisted', text: 'Waitlisted', value: 'Waitlisted' },
    { key: 'undecided', text: 'Undecided', value: 'Undecided' },
    { key: 'developer', text: 'Developer', value: 'Developer' },
    { key: 'business', text: 'Business', value: 'Business' },
    { key: 'design', text: 'Design', value: 'Design' },
    { key: 'product_manager', text: 'Product Manager', value: 'Product Manager' }
  ];

  const roundOptions = [
    { key: 'all_rounds', text: 'All Rounds', value: 'All Rounds' },
    { key: 'behavioral', text: 'Behavioral', value: 'Behavioral' },
    { key: 'technical', text: 'Technical', value: 'Technical' },
    { key: 'resume', text: 'Resume', value: 'Resume' }
  ];

  const colors = {
    Accepted: 'var(--accent-yes)',
    Undecided: 'var(--accent-maybe)',
    Rejected: 'var(--accent-no)',
    Waitlisted: 'inherit'
  };

  const getColor = (status: InterviewStatus): string => colors[status.status] || 'inherit';

  return (
    <div className={styles.dashboardContainer}>
      <Header as="h1">Interview Status Dashboard</Header>
      <div className={styles.dropdownContainer}>
        <h3>Recruitment Round</h3>
        <Dropdown
          placeholder="Select Recruitment Round"
          fluid
          selection
          search
          options={roundOptions}
          onChange={handleRoundChange}
        />
      </div>
      <div className={styles.dropdownContainer}>
        <h3>Filter Applicants</h3>
        <Dropdown
          placeholder="Select Filters"
          fluid
          multiple
          selection
          search
          options={filterOptions}
          onChange={handleFilterChange}
        />
      </div>
      <div className={styles.csvButton}>
        <Button onClick={handleCopyEmails}>Copy Emails</Button>
        <Button onClick={handleDeleteStatus}>Delete Status</Button>
        <Button onClick={handleProceed}>Proceed to Next Round</Button>
        <Button className={styles.acceptButton} onClick={() => updateStatus('Accepted')}>
          Accept
        </Button>
        <Button className={styles.rejectButton} onClick={() => updateStatus('Rejected')}>
          Reject
        </Button>
        <Button onClick={() => updateStatus('Waitlisted')}>Waitlist</Button>
        <Button className={styles.undecideButton} onClick={() => updateStatus('Undecided')}>
          Undecide
        </Button>
      </div>
      <Table celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Roles</Table.HeaderCell>
            <Table.HeaderCell>Round</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Select</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredApplicants.map((applicant) => (
            <Table.Row key={applicant.uuid}>
              <Table.Cell>{applicant.name}</Table.Cell>
              <Table.Cell>{`${applicant.netid}@cornell.edu`}</Table.Cell>
              <Table.Cell>{applicant.role}</Table.Cell>
              <Table.Cell>{applicant.round}</Table.Cell>
              <Table.Cell
                style={{
                  color: getColor(applicant)
                }}
              >
                {applicant.status}
              </Table.Cell>
              <Table.Cell>
                {
                  <Checkbox
                    checked={selectedApplicants.has(applicant.uuid!)}
                    onChange={() => handleSelect(applicant.uuid!)}
                  />
                }
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className={styles.addForm}>
        <AddInterviewStatusForm onSuccess={fetchApplicants} />
      </div>
    </div>
  );
};

export default InterviewStatusDashboard;
