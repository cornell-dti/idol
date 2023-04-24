import { DropdownProps, Label, Dropdown } from 'semantic-ui-react';
import styles from './LabeledDropdown.module.css';

interface Data {
  key: string;
  label: React.ReactNode;
  info?: React.ReactNode[];
}

export interface LabeledDropdownProps extends DropdownProps {
  data: Data[];
}

const Item = ({ label, info = [] }: Data): JSX.Element => (
  <div className={styles.itemContainer}>
    <div className={styles.flex}>{label}</div>
    {info
      .filter((infoLabel) => infoLabel !== undefined)
      .map((infoLabel, i) => (
        <Label key={i} content={infoLabel} />
      ))}
  </div>
);

const LabeledDropdown = ({
  data,
  value,
  placeholder,
  ...props
}: LabeledDropdownProps): JSX.Element => {
  const active = data.find(({ key }) => key === value);

  return (
    <Dropdown
      trigger={
        active ? (
          <Item {...active} />
        ) : (
          <div className={styles.placeholder}>
            <Item key={''} label={placeholder} />
          </div>
        )
      }
      options={data.map(({ key, label, info = [] }) => ({
        key,
        label: <Item key={key} label={label} info={info} />,
        value: key
      }))}
      value={value}
      {...props}
    />
  );
};

export default LabeledDropdown;
