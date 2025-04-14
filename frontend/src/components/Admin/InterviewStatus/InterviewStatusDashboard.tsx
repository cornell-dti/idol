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

  useEffect(() => {
    Array.from(selectedApplicants).forEach((applicant) => {
      console.log(`selected applicant: ${applicant}`);
    });
  }, [selectedApplicants]);

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
      setSelectedFilters(value);
      applyFilters(selectedRound, value);
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
      console.log('emails copied to clipboard:', emailList);
    });
  };

  const handleDeleteStatus = async () => {
    if (selectedApplicants.size === 0) {
      alert('No applicants are selected.');
    } else {
      try {
        const deletePromises = Array.from(selectedApplicants).map((uuid) =>
          InterviewStatusAPI.deleteInterviewStatus(uuid)
            .then(() => console.log(`Successfully deleted status for ${uuid}`))
            .catch((error) => {
              alert(`Could not delete status for ${uuid}.`);
            })
        );
        await Promise.all(deletePromises);
        setSelectedApplicants(new Set());
        fetchApplicants();
      } catch (error) {
        console.log('Error: ', error);
      }
    }
  };

  const handleProceed = async () => {
    if (selectedApplicants.size === 0) {
      alert('No applicants are selected.');
      return;
    }
    const names: string[] = [];
    try {
      const updatePromises = Array.from(selectedApplicants).map(async (uuid) => {
        const applicant = applicants.find((applicant) => applicant.uuid === uuid);
        if (!applicant) return;

        const { name, round, status, role } = applicant;

        if (status !== 'Accepted') {
          alert(`${name} has not been accepted so they may not move onto the next round.`);
          return;
        }

        if (round === 'Technical') {
          alert(`${role} ${name} is already at the final round.`);
          return;
        }

        const newRound = round === 'Behavioral' ? 'Technical' : 'Behavioral';

        const updatedStatus = { ...applicant, uuid: applicant.uuid!, round: newRound };
        InterviewStatusAPI.updateInterviewStatus(updatedStatus)
          .then(() => {
            names.push(name);
            console.log(`Successfully updated round for ${uuid}`);
          })

          .catch((error) => {
            alert(`Could not update round for ${uuid}.`);
          });
      });
      await Promise.all(updatePromises);
      setSelectedApplicants(new Set());
      fetchApplicants();
      if (names.length !== 0) {
        alert(`Promoted ${names.join(', ')} to next round`);
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const updateStatus = async (newStatus: 'Accepted' | 'Rejected' | 'Waitlisted' | 'Undecided') => {
    if (selectedApplicants.size === 0) {
      alert('No applicants are selected.');
      return;
    }
    const names: string[] = [];
    try {
      const updatePromises = Array.from(selectedApplicants).map(async (uuid) => {
        const applicant = applicants.find((applicant) => applicant.uuid === uuid);
        if (!applicant) return;

        const { name } = applicant;

        const updatedStatus = { ...applicant, uuid: applicant.uuid!, status: newStatus };
        InterviewStatusAPI.updateInterviewStatus(updatedStatus)
          .then(() => {
            names.push(name);
            console.log(`Successfully updated status for ${uuid}`);
          })

          .catch((error) => {
            alert(`Could not update status for ${uuid}.`);
          });
      });
      await Promise.all(updatePromises);
      setSelectedApplicants(new Set());
      fetchApplicants();
      if (names.length !== 0) {
        alert(`${newStatus} ${names.join(', ')}!`);
      }
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
    { key: 'designer', text: 'Designer', value: 'Designer' },
    { key: 'product_manager', text: 'Product Manager', value: 'Product Manager' }
  ];

  const roundOptions = [
    { key: 'all_rounds', text: 'All Rounds', value: 'All Rounds' },
    { key: 'behavioral', text: 'Behavioral', value: 'Behavioral' },
    { key: 'technical', text: 'Technical', value: 'Technical' },
    { key: 'resume', text: 'Resume', value: 'Resume' }
  ];

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
        <Button
          style={{
            color: 'green'
          }}
          onClick={() => updateStatus('Accepted')}
        >
          Accept
        </Button>
        <Button
          style={{
            color: 'red'
          }}
          onClick={() => updateStatus('Rejected')}
        >
          Reject
        </Button>
        <Button
          style={{
            color: 'white'
          }}
          onClick={() => updateStatus('Waitlisted')}
        >
          Waitlist
        </Button>
        <Button
          style={{
            color: 'orange'
          }}
          onClick={() => updateStatus('Undecided')}
        >
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
                  color:
                    applicant.status === 'Accepted'
                      ? 'green'
                      : applicant.status === 'Undecided'
                        ? 'orange'
                        : applicant.status === 'Rejected'
                          ? 'red'
                          : 'inherit'
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
      <div style={{ marginBottom: '2rem' }}>
        <AddInterviewStatusForm onSuccess={fetchApplicants} />
      </div>
    </div>
  );
};

export default InterviewStatusDashboard;
