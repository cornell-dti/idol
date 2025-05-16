import { useState, useEffect } from 'react';
import { Card } from 'semantic-ui-react';
import { InterviewStatusAPI } from '../../../API/InterviewStatusAPI';
import InterviewStatusDashboard from './InterviewStatusDashboard';
import styles from './InterviewStatusBase.module.css';
import Button from '../../Common/Button/Button';
import InterviewStatusNewInstanceModal from '../../Modals/InterviewStatusNewInstanceModal';
import InterviewStatusDeleteInstanceModal from '../../Modals/InterviewStatusDeleteInstanceModal';

const InterviewStatusBase: React.FC = () => {
  const [groups, setGroups] = useState<StatusInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<StatusInstance | null>(null);
  const [showNewInstanceModal, setShowNewInstanceModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [instanceToDelete, setInstanceToDelete] = useState<string>('');

  useEffect(() => {
    loadGroups();
  }, [selected]);

  const refresh = async () => {
    setIsLoading(true);
    const all = await InterviewStatusAPI.getAllInterviewStatuses();
    const map = all.reduce<Record<string, InterviewStatus[]>>((acc, st) => {
      (acc[st.instance] ||= []).push(st);
      return acc;
    }, {});
    const grouped: StatusInstance[] = Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([instanceName, statuses]) => ({
        instanceName,
        statuses
      }));
    setGroups(grouped);
    if (selected) {
      const fresh = all.filter((st) => st.instance === selected.instanceName);
      setSelected({ instanceName: selected.instanceName, statuses: fresh });
    }
    setIsLoading(false);
  };

  const loadGroups = async () => {
    setIsLoading(true);
    const all = await InterviewStatusAPI.getAllInterviewStatuses();
    const map = all.reduce<Record<string, InterviewStatus[]>>((acc, st) => {
      (acc[st.instance] ||= []).push(st);
      return acc;
    }, {});
    const grouped: StatusInstance[] = Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([instanceName, statuses]) => ({
        instanceName,
        statuses
      }));
    setGroups(grouped);
    setIsLoading(false);
  };

  const openDeleteModal = (name: string) => {
    setInstanceToDelete(name);
    setDeleteModalOpen(true);
  };

  const handleDeleted = (name: string) => {
    setIsLoading(true);
    setGroups((prev) => prev.filter((g) => g.instanceName !== name));
    setSelected(null);
    setIsLoading(false);
  };

  const handleCreateInstance = (name: string) => {
    setIsLoading(true);
    setSelected({ instanceName: name, statuses: [] });
    setIsLoading(false);
    setShowNewInstanceModal(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  if (selected) {
    return (
      <div className={styles.container}>
        <div className={styles.buttonRow}>
          <Button label="Back to Instances" onClick={() => setSelected(null)} />
          <Button
            label="Delete Instance"
            onClick={() => openDeleteModal(selected.instanceName)}
            variant="negative"
          />
        </div>
        <InterviewStatusDashboard
          instanceName={selected.instanceName}
          statuses={selected.statuses}
          refresh={refresh}
        />
        <InterviewStatusDeleteInstanceModal
          open={deleteModalOpen}
          instanceName={instanceToDelete}
          onClose={() => setDeleteModalOpen(false)}
          onDeleted={handleDeleted}
        />
      </div>
    );
  }

  const existingNames = groups.map((g) => g.instanceName);

  return (
    <div className={styles.container}>
      <Card.Group>
        {groups.map((group) => (
          <Card
            onClick={() => setSelected(group)}
            key={group.instanceName}
            className={styles.card}
            as="button"
            type="button"
          >
            <Card.Content>
              <Card.Header>{group.instanceName}</Card.Header>
            </Card.Content>
          </Card>
        ))}
        <Card
          key="new-instance"
          onClick={() => setShowNewInstanceModal(true)}
          className={`${styles.card} ${styles.newInstanceCard}`}
          as="button"
          type="button"
        >
          <Card.Content>
            <Card.Header>{'+ New Empty Instance'}</Card.Header>
          </Card.Content>
        </Card>
      </Card.Group>

      <InterviewStatusNewInstanceModal
        open={showNewInstanceModal}
        onClose={() => setShowNewInstanceModal(false)}
        onCreate={handleCreateInstance}
        existingNames={existingNames}
      />
    </div>
  );
};

export default InterviewStatusBase;
