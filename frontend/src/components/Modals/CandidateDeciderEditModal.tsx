import { useEffect, useState } from 'react';
import { Modal, Button, Card, Header, Form, Message } from 'semantic-ui-react';
import { ALL_ROLES, LEAD_ROLES } from 'common-types/constants';
import { ExportToCsv, Options } from 'export-to-csv';
import CandidateDeciderAPI from '../../API/CandidateDeciderAPI';
import { MemberSearch, RoleSearch } from '../Common/Search/Search';
import styles from './CandidateDeciderEditModal.module.css';
import { Emitters } from '../../utils';
import { ratingToString } from '../Candidate-Decider/ratings-utils';

const allNonleadRoles: { role: Role }[] = ALL_ROLES.filter(
  (role) => !LEAD_ROLES.includes(role)
).map((role) => ({ role }));

type Props = {
  uuid: string;
  setInstances: React.Dispatch<React.SetStateAction<CandidateDeciderInfo[]>>;
};

const CandidateDeciderEditModal: React.FC<Props> = ({ uuid, setInstances }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [instance, setInstance] = useState<CandidateDeciderInstance>();
  const [reviews, setReviews] = useState<CandidateDeciderReview[]>([]);
  const [authorizedMembers, setAuthorizedMembers] = useState<Array<IdolMember>>([]);
  const [authorizedRoles, setAuthorizedRoles] = useState<Array<Role>>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      CandidateDeciderAPI.getInstance(uuid).then((candidateDeciderInstance) => {
        setInstance(candidateDeciderInstance);
        setAuthorizedMembers(candidateDeciderInstance.authorizedMembers);
        setAuthorizedRoles(candidateDeciderInstance.authorizedRoles);
        setName(candidateDeciderInstance.name);
      });
      CandidateDeciderAPI.getReviews(uuid).then((candidateDeciderReviews) => {
        setReviews(candidateDeciderReviews);
      });
    }
  }, [isOpen, uuid]);

  const handleSubmit = () => {
    if (instance) {
      const updatedInstance: CandidateDeciderEdit = {
        ...instance,
        name,
        authorizedMembers,
        authorizedRoles,
        isOpen: true
      };
      CandidateDeciderAPI.updateInstance(updatedInstance).then((instance) =>
        setInstances((instances) =>
          instances.map((currInstance) =>
            currInstance.uuid === instance.uuid ? instance : currInstance
          )
        )
      );
      setIsOpen(false);
    }
  };

  const handleExportToCsv = () => {
    if (instance === undefined || instance.candidates.length <= 0) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to export Candidate Decider Instance to CSV',
        contentMsg: 'Please make sure there is at least 1 candidate.'
      });
      return;
    }
    const getHeaderIndex = (_header: string) =>
      instance.headers.findIndex((header, i) => header === _header);
    const netIDIndex = getHeaderIndex('NetID');
    const lastNameIndex = getHeaderIndex('Last Name');
    const firstNameIndex = getHeaderIndex('First Name');

    const csvData = instance.candidates.map((candidate) => {
      const candidateReviews = reviews.filter((review) => review.candidateId === candidate.id);
      const reviewers = new Set<IdolMember>();
      reviews.forEach((review) => reviewers.add(review.reviewer));

      const row: Record<string, string> = {
        name: `${candidate.responses[firstNameIndex]} ${candidate.responses[lastNameIndex]}`,
        netid: candidate.responses[netIDIndex],
        comments: candidateReviews.reduce(
          (acc, comment) =>
            comment.comment === ''
              ? acc
              : `${acc}${comment.reviewer.firstName} ${comment.reviewer.lastName}: ${comment.comment}\n`,
          ''
        ),
        ratings: candidateReviews.reduce(
          (acc, rating) =>
            rating.rating === 0
              ? acc
              : `${acc}${rating.reviewer.firstName} ${rating.reviewer.lastName}: ${ratingToString(
                  rating.rating
                )}\n`,
          ''
        )
      };
      reviewers.forEach((reviewer) => {
        const review = candidateReviews.find((review) => review.reviewer.email === reviewer.email);
        let formattedRating;
        if (review === undefined || review.rating === 0) {
          formattedRating = '';
        } else {
          formattedRating = String(review.rating);
        }
        row[`${reviewer.firstName} ${reviewer.lastName}`] = formattedRating;
      });

      let completedReviews = 0;
      let sumOfRatings = 0;
      candidateReviews.forEach((review) => {
        if (review.rating !== 0) {
          completedReviews += 1;
          sumOfRatings += review.rating;
        }
      });
      row['Average Rating'] = completedReviews === 0 ? '' : String(sumOfRatings / completedReviews);

      return row;
    });

    const options: Options = {
      filename: `${instance.name}_Ratings`,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title: `${instance.name} Ratings`,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };

    const csvExporter = new ExportToCsv(options);
    csvData.sort((a, b) => Number(b['Average Rating']) - Number(a['Average Rating']));
    csvExporter.generateCsv(csvData);
  };

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={() => setIsOpen(true)}
      open={isOpen}
      trigger={<Button>Edit</Button>}
    >
      <Modal.Header>{instance ? `Edit ${instance.name}` : ''}</Modal.Header>
      <Modal.Content className={styles.modalContent} scrolling>
        {instance ? (
          <Form>
            <Form.Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Message>
              All leads and IDOL admins have permission to all Candidate Decider instances
            </Message>
            <Header as="h4">Add authorized members</Header>
            <MemberSearch
              onSelect={(mem: IdolMember) => setAuthorizedMembers((mems) => [...mems, mem])}
            />
            {authorizedMembers.map((member) => (
              <Card key={member.netid}>
                <Card.Content>
                  <Card.Header centered>{`${member.firstName} ${member.lastName}`}</Card.Header>
                  <Card.Description>{member.email}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div className={`ui one buttons ${styles.fullWidth}`}>
                    <Button
                      basic
                      color="red"
                      onClick={() => {
                        setAuthorizedMembers((members) =>
                          members.filter((mem) => mem.email !== member.email)
                        );
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
            <Header as="h4">Add authorized roles</Header>
            <RoleSearch
              roles={allNonleadRoles}
              onSelect={(role) => setAuthorizedRoles((roles) => [...roles, role.role])}
            />
            {authorizedRoles.map((role, i) => (
              <Card key={i}>
                <Card.Content>
                  <Card.Header>{role}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                  <div className={`ui one buttons ${styles.fullWidth}`}>
                    <Button
                      basic
                      color="red"
                      onClick={() =>
                        setAuthorizedRoles((roles) => roles.filter((rl) => rl !== role))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </Form>
        ) : (
          <></>
        )}
      </Modal.Content>

      <Modal.Actions>
        <Button onClick={handleExportToCsv}>Export to CSV</Button>
        <Button negative onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button id={styles.submitButton} type="submit" onClick={handleSubmit} disabled={!name}>
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CandidateDeciderEditModal;
