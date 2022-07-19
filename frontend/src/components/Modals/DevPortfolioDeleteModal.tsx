import React, { useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import DevPortfolioAPI from '../../API/DevPortfolioAPI';
import styles from './DevPortfolioDeleteModal.module.css';

type Props = {
  uuid: string;
  name: string;
  setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
};

const DevPortfolioDeleteModal: React.FC<Props> = ({ uuid, name, setDevPortfolios }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Modal
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      open={isOpen}
      trigger={<Icon className={styles.trashIcon} name="trash" color="red" />}
    >
      <Modal.Header>Are you sure you want to delete {name}?</Modal.Header>
      <Modal.Description>Deleting this assignment will delete all submissions.</Modal.Description>
      <Modal.Actions>
        <Button positive onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button
          negative
          onClick={() => {
            DevPortfolioAPI.deleteDevPortfolio(uuid).then(() =>
              setDevPortfolios((portfolios) => portfolios.filter((it) => it.uuid !== uuid))
            );
            setIsOpen(false);
          }}
        >
          Delete
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DevPortfolioDeleteModal;
