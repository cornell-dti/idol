/* TODO:
 * Make the table header grey
 * Make the delete text red
 * Make the dropdown items same height as design
 * Location not dropdown
 * Standardize alumni type across editalumni, alumni.tsx and alumniaddeditmodal
 * contact info? 
 * add loading screen after saving changes in modal
 */
import { Button, Dropdown, DropdownProps, Icon, Input, Table } from 'semantic-ui-react';
import styles from './EditAlumni.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, EllipsisIcon, Delete } from 'lucide-react';
import {AlumniModal, AlumniFormState} from '../../Modals/AlumniAddEditModal';
import DeleteAlumniConfirmationModal from '../../Modals/DeleteAlumniConfirmationModal';
import AlumniAPI from '../../../API/AlumniAPI';
import { Emitters } from '../../../utils';
import Alumni from '../../Alumni/Alumni';


export default function EditAlumni(): JSX.Element {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | undefined>(undefined);
  const [alumni, setAlumni] = useState<readonly Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [alumniToDelete, setAlumniToDelete] = useState<Alumni | undefined>(undefined);
  const [nameInputOpen, setNameInputOpen] = useState<boolean>(false);
  const [emailInputOpen, setEmailInputOpen] = useState<boolean>(false);
  const [linkedinInputOpen, setLinkedinInputOpen] = useState<boolean>(false);

  async function loadAlumni(): Promise<void> {
    setIsLoading(true);
  
    try {
      const alumniData = await AlumniAPI.getAllAlumni();
      setAlumni(alumniData);
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: "Couldn't load alumni data!",
        contentMsg: `Error was: ${error}`
      });
    }
  
    setIsLoading(false);
  }
  
  useEffect(() => {
    loadAlumni();
  }, []);

  const filteredAlumni = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
  
    if (!query) return alumni;
  
    return alumni.filter((alum) => {
      const searchableValues = [
        alum.firstName + ' ' + alum.lastName,
        alum.email,
        alum.company,
        alum.location,
        alum.jobCategory,
        alum.jobRole,
        alum.gradYear,
        alum.dtiRoles?.join(', '),
        alum.subteams?.join(', ')
      ];
  
      return searchableValues.some((value) =>
        String(value ?? '').toLowerCase().includes(query)
      );
    });
  }, [alumni, searchQuery]);

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
    
    async function saveAlumni(data: Alumni): Promise<void> {
        if (modalMode === 'add') {
          await AlumniAPI.createAlumni(data)
          console.log('create', data);
        } else {
          await AlumniAPI.updateAlumni(data)
          console.log('update', selectedAlumni?.uuid, data);
        }

        await loadAlumni();
    }
  function handleRowAction(alum: Alumni, _: React.SyntheticEvent<HTMLElement>, data: DropdownProps): void {
    const value = data.value as string | undefined;
    if (value === 'edit') {
      // TODO: open edit modal
      openEdit(alum);
    } else if (value === 'delete') {
      // TODO: confirm and delete
      openDelete(alum);
    }
  }

  function openDelete(alum: Alumni): void {
    setAlumniToDelete(alum);
    setDeleteModalOpen(true);
  }
  
  async function deleteAlumni(alum: Alumni): Promise<void> {
    await AlumniAPI.deleteAlumni(alum.uuid);
    await loadAlumni();
  }

  return (
    <div className={styles.content}>
      <h1>Alumni Database</h1>
      <div className={styles.toolbar}>
        <Input
          icon="search"
          placeholder="Search alumni..."
          style={{ width: '40%', height: '48px' }}
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(String(data.value ?? ''))}
        />
        <Button color="black" style={{ height: '48px', width: '127px', padding: '16px' }} onClick = {openAdd}>
          <Plus color="white" size="1rem" style={{ verticalAlign: 'bottom' }} /> Add Alumni
        </Button>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Company</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>DTI Role</Table.HeaderCell>
            <Table.HeaderCell>Job Category</Table.HeaderCell>
            <Table.HeaderCell>Company Role</Table.HeaderCell>
            <Table.HeaderCell>Grad Year</Table.HeaderCell>
            <Table.HeaderCell>Subteam</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {isLoading ? (
            <Table.Row>
              <Table.Cell colSpan="11" textAlign="center">
                Loading alumni...
              </Table.Cell>
            </Table.Row>
          ) : filteredAlumni.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan="11" textAlign="center">
                No alumni found.
              </Table.Cell>
            </Table.Row>
          ) : (
            filteredAlumni.map((alum) => (
              <Table.Row key={alum.firstName + ' ' + alum.lastName}>
                <Table.Cell>{alum.firstName + ' ' + alum.lastName || '—'}</Table.Cell>
                <Table.Cell>{alum.email || '—'}</Table.Cell>
                <Table.Cell>{alum.company || '—'}</Table.Cell>
                <Table.Cell>{alum.location || '—'}</Table.Cell>
                <Table.Cell>
                  {alum.dtiRoles && alum.dtiRoles.length > 0 ? alum.dtiRoles.join(', ') : '—'}
                </Table.Cell>
                <Table.Cell>{alum.jobCategory || '—'}</Table.Cell>
                <Table.Cell>{alum.jobRole || '—'}</Table.Cell>
                <Table.Cell>{alum.gradYear || '—'}</Table.Cell>
                <Table.Cell>
                  {alum.subteams && alum.subteams.length > 0 ? alum.subteams.join(', ') : '—'}
                </Table.Cell>
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
                        onClick={(e, data) =>
                          handleRowAction(alum, e, { value: data.value } as DropdownProps)
                        }
                      >
                        <Icon name="pencil" color="black" /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item
                        value="delete"
                        onClick={(e, data) =>
                          handleRowAction(alum, e, { value: data.value } as DropdownProps)
                        }
                      >
                        <Icon name="trash" color="red" /> Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      <AlumniModal
        open={modalOpen}
        mode={modalMode}
        initialAlumni={selectedAlumni}
        onClose={() => 
          {setModalOpen(false)
          setNameInputOpen(false)
          setEmailInputOpen(false)
          setLinkedinInputOpen(false)
          }
        }
        onSave={saveAlumni}
        nameInputOpen={nameInputOpen}
        setNameInputOpen={setNameInputOpen}
        emailInputOpen={emailInputOpen}
        setEmailInputOpen={setEmailInputOpen}
        linkedinInputOpen={linkedinInputOpen}
        setLinkedinInputOpen={setLinkedinInputOpen}
      />
      <DeleteAlumniConfirmationModal
        open={deleteModalOpen}
        alumni={alumniToDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setAlumniToDelete(undefined);
        }}
        onConfirm={deleteAlumni}
      />
    </div>
  );
}