/* TODO:
 * Make the table header grey
 * Make the delete text red
 * Make the dropdown items same height as design
 */
import { Button, Dropdown, DropdownProps, Icon, Input, Table } from 'semantic-ui-react';
import styles from './EditAlumni.module.css';
import React from 'react';
import { Plus, EllipsisIcon } from 'lucide-react';

export default function EditAlumni(): JSX.Element {
  function handleRowAction(_: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void {
    const value = data.value as string | undefined;
    if (value === 'edit') {
      // TODO: open edit modal
    } else if (value === 'delete') {
      // TODO: confirm and delete
    }
  }

  return (
    <div className={styles.content}>
      <h1>Alumni Database</h1>
      <div className={styles.toolbar}>
        <Input
          icon="search"
          placeholder="Search alumni..."
          style={{ width: '40%', height: '48px' }}
        />
        <Button color="black" style={{ height: '48px', width: '127px', padding: '16px' }}>
          <Plus color="white" size="1rem" style={{ verticalAlign: 'bottom' }} /> Add Alumni
        </Button>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>DTI Role</Table.HeaderCell>
            <Table.HeaderCell>Job Category</Table.HeaderCell>
            <Table.HeaderCell>Company Role</Table.HeaderCell>
            <Table.HeaderCell>Grad Year</Table.HeaderCell>
            <Table.HeaderCell>Contact Info</Table.HeaderCell>
            <Table.HeaderCell>Subteam</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>john.doe@example.com</Table.Cell>
            <Table.Cell>Example Inc.</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>Software Engineer</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell>—</Table.Cell>
            <Table.Cell className={styles.rowActionsCell}>
              <Dropdown
                trigger={
                  <button type="button" className={styles.iconButton}>
                    <EllipsisIcon />
                  </button>
                }
                icon={null}
                direction="left"
                className={styles.rowActionsDropdown}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    value="edit"
                    onClick={(e, data) => handleRowAction(e, { value: data.value } as DropdownProps)}
                  >
                    <Icon name="pencil" color = "black"/> Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    value="delete"
                    onClick={(e, data) => handleRowAction(e, { value: data.value } as DropdownProps)}
                  >
                    <Icon name="trash" color = "red"/> Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
}