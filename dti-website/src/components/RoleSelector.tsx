import clsx from 'clsx';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

interface Role {
  readonly name: string;
  readonly id: string;
}

export type RoleId = '' | 'business' | 'developer' | 'designer' | 'pm';

type Props = {
  readonly roleId: RoleId;
  readonly onRoleIdChange: (id: RoleId) => void;
  readonly className?: string;
  readonly centered?: boolean;
  readonly dropdownText?: string;
  readonly dark?: boolean;
  readonly density?: 'compact' | 'normal';
  readonly bold?: boolean;
  readonly showAll?: boolean;
};

const roles: readonly Role[] = [
  { id: 'designer', name: 'Design' },
  { id: 'developer', name: 'Development' },
  { id: 'business', name: 'Business' },
  { id: 'pm', name: 'Product' }
];

export default function RoleSelector({
  roleId,
  onRoleIdChange,
  className,
  centered = false,
  dropdownText = '',
  dark = false,
  density = 'compact',
  bold = false,
  showAll = true
}: Props): JSX.Element {
  const btnCSS = (
    selected: boolean,
    density: 'compact' | 'normal',
    isBold: boolean,
    isDark = false
  ) =>
    clsx(
      selected ? 'selected-filter-btn' : 'filter-btn',
      isDark ? 'fg-light' : 'fg-dark',
      density === 'compact' ? 'density-compact' : null,
      isBold ? 'bold' : null
    );

  const selectorCSS = (selected: boolean, isDark = false) =>
    clsx(selected ? ['selector', 'selected', isDark ? 'fg-light' : 'fg-dark'] : ['selector']);

  const mobileSelectorCSS = (isCentered: boolean, isDark = false) =>
    clsx(isDark ? 'fg-light' : 'fg-dark', isCentered ? 'centered' : null);

  return (
    <div className={clsx('role-selector-component', className)}>
      <Row className="filter-btn-group desktop-selector-container">
        {showAll && (
          <Col
            md={density === 'compact' ? 'auto' : undefined}
            className="col-auto my-auto text-center"
          >
            <div
              className={btnCSS(roleId === '', density, bold, dark)}
              onClick={() => onRoleIdChange('')}
            >
              All
            </div>
            <div className={selectorCSS(roleId === '', dark)} />
          </Col>
        )}
        {roles.map((role) => (
          <Col
            md={density === 'compact' ? 'auto' : undefined}
            key={role.id}
            className="col-auto my-auto text-center"
          >
            <div
              className={btnCSS(roleId === role.id, density, bold, dark)}
              onClick={() => onRoleIdChange(role.id as RoleId)}
            >
              {role.name}
            </div>
            <div className={selectorCSS(roleId === role.id, dark)} />
          </Col>
        ))}
      </Row>
      <Row className="justify-content-center mobile-selector-container text-center">
        <Col sm="12" md="auto">
          {dropdownText}
          <Form.Control
            as="select"
            className={mobileSelectorCSS(centered, dark)}
            onChange={(event) => onRoleIdChange(event.target.value as RoleId)}
            id="mobile-apply-dropdown"
            value={roleId}
          >
            {showAll && (
              <option className="fg-dark" value="">
                All
              </option>
            )}
            <option className="fg-dark" value="">
              Select One
            </option>
            {roles.map((role) => (
              <option className="fg-dark" key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>
    </div>
  );
}
