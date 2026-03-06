/* TODO:
 * Make the table header grey
 * Make the delete text red
 * Make the dropdown items same height as design
 * Location not dropdown
 */
import { Button, Dropdown, DropdownProps, Icon, Input, Table } from 'semantic-ui-react';
import styles from './EditAlumni.module.css';
import React, { useMemo, useState } from 'react';
import { Plus, EllipsisIcon } from 'lucide-react';
import {AlumniModal, Alumni, AlumniFormState} from '../../Modals/AlumniAddEditModal';

export default function EditAlumni(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | undefined>(undefined);

    // TODO: replace with real data
    const rows: Alumni[] = useMemo(
        () => [
            {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@example.com',
            company: 'Example Inc.',
            companyRole: 'Software Engineer'
            }
        ],
        []
    );
    function openAdd(): void {
        setModalMode('add');
        setSelectedAlumni(undefined);
        setModalOpen(true);
    }
    
    function openEdit(alumni: Alumni): void {
        setModalMode('edit');
        setSelectedAlumni(alumni);
        setModalOpen(true);
    }
    async function saveAlumni(data: AlumniFormState): Promise<void> {
        if (modalMode === 'add') {
          // TODO: call API create
          console.log('create', data);
        } else {
          // TODO: call API update using selectedAlumni?.id
          console.log('update', selectedAlumni?.id, data);
        }
      }
  function handleRowAction(_: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void {
    const value = data.value as string | undefined;
    if (value === 'edit') {
      // TODO: open edit modal
      openEdit(rows[0]);
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
        <Button color="black" style={{ height: '48px', width: '127px', padding: '16px' }} onClick = {openAdd}>
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
      <AlumniModal
        open={modalOpen}
        mode={modalMode}
        initialAlumni={selectedAlumni}
        onClose={() => setModalOpen(false)}
        onSave={saveAlumni}
      />
    </div>
  );
}