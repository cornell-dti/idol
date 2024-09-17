import DatePicker from 'react-datepicker';
import React, { useState } from 'react';
import { Form, Header, Label, Divider, Message } from 'semantic-ui-react';
import 'react-datepicker/dist/react-datepicker.css';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';
import styles from './AdminDevPortfolio.module.css';

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

type AdminDevPortfolioFormProps = {
  formType: 'create' | 'edit';
  readonly setDevPortfolios: React.Dispatch<React.SetStateAction<DevPortfolio[]>>;
  devPortfolio?: DevPortfolio;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  editDevPortfolio?: (portfolio: DevPortfolio) => void;
};

const AdminDevPortfolioForm: React.FC<AdminDevPortfolioFormProps> = ({
  setDevPortfolios,
  formType,
  setOpen,
  editDevPortfolio,
  devPortfolio
}) => {
  const [name, setName] = useState(devPortfolio?.name || '');
  const [nameError, setNameError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [dateErrorMsg, setDateErrorMsg] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  let deadlineDate = new Date();
  let earliestValidDate = new Date();
  let lateDeadlineDate = null;
  if (devPortfolio) {
    deadlineDate = new Date(devPortfolio.deadline as number);
    earliestValidDate = new Date(devPortfolio.earliestValidDate as number);
    if (devPortfolio.lateDeadline) {
      lateDeadlineDate = new Date(devPortfolio.lateDeadline as number);
    }
  }
  const [deadline, setDeadline] = useState<Date>(deadlineDate);
  const [earliestDate, setEarliestDate] = useState<Date>(earliestValidDate);
  const [lateDeadline, setLateDeadline] = useState(lateDeadlineDate);
  const [lastCreatedPortfolio, setLastCreatedPortfolio] = useState<DevPortfolio>();

  const handleSubmit = () => {
    if (name === '') {
      setNameError(true);
      return;
    }
    setNameError(false);
    if (deadline < earliestDate) {
      setDateError(true);
      setDateErrorMsg('Deadline must be after earliest possible date.');
      return;
    }
    if (deadline < new Date() && !isSameDay(deadline, new Date())) {
      setDateError(true);
      setDateErrorMsg('Deadline cannot be before today.');
      return;
    }
    if (lateDeadline && deadline > lateDeadline && !isSameDay(deadline, lateDeadline)) {
      setDateError(true);
      setDateErrorMsg('Late deadline cannot be before the regular deadline');
      return;
    }

    if (formType === 'edit' && devPortfolio && editDevPortfolio && setOpen) {
      const editedDevPortfolio: DevPortfolio = {
        ...devPortfolio,
        // eslint-disable-next-line object-shorthand
        name: name,
        deadline: deadline.getTime(),
        earliestValidDate: earliestDate.getTime(),
        lateDeadline: lateDeadline ? lateDeadline.getTime() : null,
        submissions: devPortfolio.submissions
      };
      editDevPortfolio(editedDevPortfolio);
      setSuccess(true);
      setOpen(false);
    } else {
      const newPortfolio = {
        name,
        deadline: deadline.getTime(),
        earliestValidDate: earliestDate.getTime(),
        lateDeadline: lateDeadline ? lateDeadline.getTime() : null,
        submissions: [],
        uuid: ''
      };
      DevPortfolioAPI.createDevPortfolio(newPortfolio).then((portfolio) => {
        setDevPortfolios((portfolios) => [...portfolios, portfolio]);
        setLastCreatedPortfolio(portfolio);
        setSuccess(true);
      });
    }
    setNameError(false);
    setDateErrorMsg('');
  };

  return (
    <Form success={success}>
      <Header as="h3">Name</Header>
      <Form.Input error={nameError} value={name} onChange={(e) => setName(e.target.value)} />
      <Header as="h3">Earliest Date</Header>
      <DatePicker
        selected={earliestDate}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setEarliestDate(date)}
      />
      <Header as="h3">Deadline</Header>
      <DatePicker
        selected={deadline}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setDeadline(date)}
      />
      <Header as="h3">Late Deadline (optional)</Header>
      <DatePicker
        selected={lateDeadline}
        dateFormat="MMMM do yyyy"
        onChange={(date: Date) => setLateDeadline(date)}
      />
      {dateError ? (
        <Label pointing>
          {`The dates for the deadline and earliest date are invalid: ${dateErrorMsg}`}
        </Label>
      ) : undefined}
      <Divider />

      {formType === 'create' && (
        <>
          <Form.Button id={styles.submitButton} onClick={() => handleSubmit()}>
            Create Assignment
          </Form.Button>
          {lastCreatedPortfolio && (
            <Message
              success
              header="Dev Portfolio Created"
              content={`${lastCreatedPortfolio.name} was successfully created and will be due on ${new Date(lastCreatedPortfolio.deadline).toDateString()}`}
            />
          )}
        </>
      )}

      {formType === 'edit' && setOpen && (
        <div className={styles.buttonsWrapper}>
          <Form.Button onClick={() => setOpen(false)}>Cancel</Form.Button>
          <Form.Button
            content="Save"
            labelPosition="right"
            icon="checkmark"
            onClick={() => {
              handleSubmit();
            }}
            positive
          />
        </div>
      )}
    </Form>
  );
};

export default AdminDevPortfolioForm;
