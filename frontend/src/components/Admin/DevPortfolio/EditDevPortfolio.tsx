import React, { useState } from 'react';
import { Modal, Icon } from 'semantic-ui-react';
import AdminDevPortfolioForm from './AdminDevPortfolioForm';
import styles from './EditDevPortfolio.module.css';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import { Emitters } from '../../../utils';

const EditDevPortfolio = (props: {
  devPortfolio: DevPortfolio;
  setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
}): JSX.Element => {
  const { devPortfolio, setDevPortfolios } = props;
  const [open, setOpen] = useState(false);

  const editDevPortfolio = (portfolio: DevPortfolio) => {
    DevPortfolioAPI.updateDevPortfolio(portfolio).then((val) => {
      Emitters.generalSuccess.emit({
        headerMsg: 'Dev Portfolio Edited!',
        contentMsg: 'The dev portfolio was successfully edited!'
      });
      Emitters.devPortfolioUpdated.emit();
    });
  };

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Icon className={styles.MdOutlineModeEditOutline} name="edit" color="grey" />}
    >
      <Modal.Header>Edit Dev Portfolio</Modal.Header>
      <Modal.Content>
        <AdminDevPortfolioForm
          formType={'edit'}
          devPortfolio={devPortfolio}
          editDevPortfolio={editDevPortfolio}
          setOpen={setOpen}
          setDevPortfolios={setDevPortfolios}
        />
      </Modal.Content>
    </Modal>
  );
};
export default EditDevPortfolio;
