import { Dropdown } from 'semantic-ui-react';

type Props = {
  instance: CandidateDeciderInstance;
  setCurrentCandidate: (value: number) => void;
  currentCandidate: number;
  seeApplicantName: boolean;
};

const SearchBar: React.FC<Props> = ({
  instance,
  setCurrentCandidate,
  currentCandidate,
  seeApplicantName
}: Props) => {
  const getHeaderIndex = (_header: string) =>
    instance.headers.findIndex((header, i) => header === _header);
  const netIDIndex = getHeaderIndex('NetID');
  const lastNameIndex = getHeaderIndex('Last name');
  const firstNameIndex = getHeaderIndex('First name');
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
          text: seeApplicantName
            ? `${candidate.id + 1} - ${
                // offset by 1 to account for 0-indexed array
                candidate.responses[firstNameIndex] !== '#N/A' &&
                candidate.responses[lastNameIndex] !== '#N/A'
                  ? `${candidate.responses[firstNameIndex]} ${candidate.responses[lastNameIndex]} (${candidate.responses[netIDIndex]})`
                  : candidate.responses[netIDIndex]
              }`
            : `Candidate ${candidate.id + 1}`
        }))}
        onChange={(_, data) => setCurrentCandidate(data.value as number)}
        value={currentCandidate}
      />
    </div>
  );
};

export default SearchBar;
