import { SetStateAction } from 'react';
import { Dropdown } from 'semantic-ui-react';

type Props = {
  instance: CandidateDeciderInstance;
  setCurrentCandidate: (value: SetStateAction<number>) => void;
};

const SearchBar = ({ instance, setCurrentCandidate }: Props) => {
  const getHeaderIndex = (_header: string) =>
    instance.headers.findIndex((header, i) => header === _header);
  const netIDIndex = getHeaderIndex('NetID');
  const lastNameIndex = getHeaderIndex('Last Name');
  const firstNameIndex = getHeaderIndex('First Name');
  return (
    <div>
      <Dropdown
        placeholder="Candidate Search"
        fluid
        search
        selection
        options={instance.candidates.map((candidate) => ({
          value: candidate.id,
          key: candidate.id,
          text: `${candidate.id} - ${
            candidate.responses[firstNameIndex] !== '#N/A' &&
            candidate.responses[lastNameIndex] !== '#N/A'
              ? `${candidate.responses[firstNameIndex]} ${candidate.responses[lastNameIndex]} (${candidate.responses[netIDIndex]})`
              : candidate.responses[netIDIndex]
          }`
        }))}
        onChange={(_, data) => setCurrentCandidate(data.value as number)}
      />
    </div>
  );
};

export default SearchBar;
