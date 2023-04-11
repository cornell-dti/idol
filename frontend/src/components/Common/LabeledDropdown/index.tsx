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
  <div style={{ display: 'flex', alignItems: 'center', minHeight: 26 }}>
    <div style={{ flex: 1 }}>{label}</div>
    {info
      .filter((x) => x !== undefined)
      .map((x, i) => (
        <Label key={i} content={x} />
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
