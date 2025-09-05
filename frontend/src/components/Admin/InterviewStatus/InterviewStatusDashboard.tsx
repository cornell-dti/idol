import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Dropdown, DropdownProps, Checkbox } from 'semantic-ui-react';
import styles from './InterviewStatusDashboard.module.css';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import AddInterviewStatusForm from './AddInterviewStatusForm';
import { Emitters } from '../../../utils';
import { ROLE_OPTIONS, ROUND_OPTIONS, STATUS_OPTIONS, DISPLAY_TO_ROLE_MAP } from '../../../consts';
import CSVUploadInterviewStatus from './CSVUploadInterviewStatus';
import Button from '../../Common/Button/Button';

interface InterviewStatusDashboardProps {
  instanceName: string;
  statuses: InterviewStatus[];
  refresh: () => void;
}

const InterviewStatusDashboard: React.FC<InterviewStatusDashboardProps> = ({
  instanceName,
  statuses,
  refresh
}) => {
  const [applicants, setApplicants] = useState<InterviewStatus[]>([]);
  const [filteredApplicants, setFilteredApplicants] = useState<InterviewStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<RoundFilter>('All Rounds');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedApplicants, setSelectedApplicants] = useState<Set<string>>(new Set());

  useEffect(() => {
    setApplicants(statuses);
    setFilteredApplicants(statuses);
    setIsLoading(false);
  }, [statuses]);

  const handleAddApplicant = (newApplicant: InterviewStatus) => {
    setApplicants((prev) => [...prev, newApplicant]);
    setFilteredApplicants((prev) => [...prev, newApplicant]);
  };

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
    setSelectedRound(value as RoundFilter);
    applyFilters(value as RoundFilter, selectedFilters);
  };

  const handleFilterChange = (_: unknown, data: DropdownProps) => {
    const { value } = data;
    setSelectedFilters(value as string[]);
    applyFilters(selectedRound, value as string[]);
  };

  const applyFilters = (roundFilter: string | null, applicantFilters: string[]) => {
    let filtered = applicants;

    if (roundFilter && roundFilter !== 'All Rounds') {
      filtered = filtered.filter((applicant) => applicant.round === roundFilter);
    }

    if (applicantFilters.length > 0) {
      filtered = filtered.filter((applicant) =>
        applicantFilters.some(
          (filter) => applicant.status === filter || applicant.role === DISPLAY_TO_ROLE_MAP[filter]
        )
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
      const deletePromises = Array.from(selectedApplicants).map((uuid) =>
        InterviewStatusAPI.deleteInterviewStatus(uuid)
      );
      await Promise.all(deletePromises);
      setApplicants((prev) => prev.filter((applicant) => !selectedApplicants.has(applicant.uuid!)));
      setFilteredApplicants((prev) =>
        prev.filter((applicant) => !selectedApplicants.has(applicant.uuid!))
      );
      setSelectedApplicants(new Set());
      Emitters.generalSuccess.emit({
        headerMsg: 'Deleted!',
        contentMsg: `Selected interview statuses removed.`
      });
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
    const uuidsToPromote: string[] = [];

    const updatePromises = Array.from(selectedApplicants).map((uuid) => {
      const applicant = applicants.find((app) => app.uuid === uuid);

      if (!applicant) {
        errors.push(`Applicant with ID ${uuid} not found.`);
        return Promise.resolve();
      }

      const { name, round, status, role } = applicant;

      if (status !== 'Accepted') {
        errors.push(`${name} has not been accepted and cannot proceed.`);
        return Promise.resolve();
      }

      if (round === 'Technical') {
        errors.push(`${role} ${name} is already at the final round.`);
        return Promise.resolve();
      }

      const newRound = round === 'Behavioral' ? 'Technical' : 'Behavioral';
      const updatedStatus = {
        ...applicant,
        uuid,
        round: newRound as Round,
        status: 'Undecided' as IntStatus
      };

      uuidsToPromote.push(uuid);
      return InterviewStatusAPI.updateInterviewStatus(updatedStatus).then(() => {
        promotedNames.push(name);
      });
    });

    await Promise.all(updatePromises);

    setApplicants((prev) =>
      prev.map((applicant) =>
        uuidsToPromote.includes(applicant.uuid!)
          ? {
              ...applicant,
              round: applicant.round === 'Behavioral' ? 'Technical' : 'Behavioral',
              status: 'Undecided'
            }
          : applicant
      )
    );
    setFilteredApplicants((prev) =>
      prev.map((applicant) =>
        uuidsToPromote.includes(applicant.uuid!)
          ? {
              ...applicant,
              round: applicant.round === 'Behavioral' ? 'Technical' : 'Behavioral',
              status: 'Undecided'
            }
          : applicant
      )
    );
    setSelectedApplicants(new Set());

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
  };

  const updateStatus = async (newStatus: IntStatus) => {
    if (selectedApplicants.size === 0) {
      Emitters.generalError.emit({
        headerMsg: 'No applicants are selected!',
        contentMsg: `Please select at least one status to proceed.`
      });
      return;
    }
    const updatePromises = Array.from(selectedApplicants).map(async (uuid) => {
      const applicant = applicants.find((applicant) => applicant.uuid === uuid);
      if (!applicant) return;

      const updatedStatus = { ...applicant, uuid: applicant.uuid!, status: newStatus };
      InterviewStatusAPI.updateInterviewStatus(updatedStatus);
    });
    await Promise.all(updatePromises);
    setApplicants((prev) =>
      prev.map((applicant) =>
        selectedApplicants.has(applicant.uuid!) ? { ...applicant, status: newStatus } : applicant
      )
    );
    setFilteredApplicants((prev) =>
      prev.map((applicant) =>
        selectedApplicants.has(applicant.uuid!) ? { ...applicant, status: newStatus } : applicant
      )
    );
    setSelectedApplicants(new Set());
    Emitters.generalSuccess.emit({
      headerMsg: 'Success!',
      contentMsg: `${newStatus} selected applicants.`
    });
  };

  if (isLoading) return <Loader active>Loading applicant data...</Loader>;

  const filterOptions = [...STATUS_OPTIONS, ...ROLE_OPTIONS];

  const roundOptions = [
    { key: 'all_rounds', text: 'All Rounds', value: 'All Rounds' },
    ...ROUND_OPTIONS
  ];

  const roleDisplayMap: Record<GeneralRole, string> = {
    developer: 'Developer',
    designer: 'Designer',
    pm: 'Product Manager',
    business: 'Business',
    lead: 'Lead'
  };

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
      <h2>Instance: {instanceName}</h2>
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
        <Button variant="primary" label="Copy Emails" onClick={handleCopyEmails} />
        <Button variant="negative" label="Delete Status" onClick={handleDeleteStatus} />
        <Button label="Proceed to Next Round" onClick={handleProceed} />
        <Button label="Accept" onClick={() => updateStatus('Accepted')} />
        <Button label="Reject" onClick={() => updateStatus('Rejected')} />
        <Button label="Waitlist" onClick={() => updateStatus('Waitlisted')} />
        <Button label="Undecide" onClick={() => updateStatus('Undecided')} />
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
              <Table.Cell>{roleDisplayMap[applicant.role as GeneralRole]}</Table.Cell>
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
        <CSVUploadInterviewStatus instanceName={instanceName} onDone={refresh} />
        <h3>Add applicants one at a time</h3>
        <AddInterviewStatusForm onAddApplicant={handleAddApplicant} instanceName={instanceName} />
      </div>
    </div>
  );
};

export default InterviewStatusDashboard;
