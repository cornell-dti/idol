import React, { useState, useEffect } from 'react';
import { Table, Header, Loader, Button, Dropdown, DropdownProps } from 'semantic-ui-react';
import styles from './InterviewStatusDashboard.module.css';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';

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

  useEffect(() => {
    // Simulate fetching applicant data
    const fetchApplicants = async () => {
      try {
        const data = await InterviewStatusAPI.getAllInterviewStatuses();
        setApplicants(data);
        setFilteredApplicants(data);
      } catch (error) {
        console.error('Error fetching interview statuses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const handleRoundChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    const { value } = data;
    if (typeof value === 'string') {
      setSelectedRound(value);
      applyFilters(value, selectedFilters);
    }
  };

  const handleFilterChange = (_: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
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
        applicantFilters.every(
          (filter) =>
            applicant.status === filter || applicant.role === filter
        )
      );
    }

    setFilteredApplicants(filtered);
  };

  const handleCopyEmails = () => {
    const emailList = filteredApplicants
      .map((applicant) => `${applicant.netid}@cornell.edu`)
      .join(', ');
    navigator.clipboard.writeText(emailList).then(() => {
      console.log('Emails copied to clipboard:', emailList);
    });
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
    { key: 'product_manager', text: 'Product Manager', value: 'Product Manager' },
  ];

  const roundOptions = [
    { key: 'all_rounds', text: 'All Rounds', value: 'All Rounds' },
    { key: 'behavioral', text: 'Behavioral', value: 'Behavioral' },
    { key: 'technical', text: 'Technical', value: 'Technical' },
    { key: 'resume', text: 'Resume', value: 'Resume' },
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
      </div>
      <Table celled selectable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Roles</Table.HeaderCell>
            <Table.HeaderCell>Round</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {filteredApplicants.map((applicant, index) => (
            <Table.Row key={index}>
              <Table.Cell>{applicant.name}</Table.Cell>
              <Table.Cell>{`${applicant.netid}@cornell.edu`}</Table.Cell>
              <Table.Cell>{applicant.role}</Table.Cell>
              <Table.Cell>{applicant.round}</Table.Cell>
              <Table.Cell>{applicant.status}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default InterviewStatusDashboard;
