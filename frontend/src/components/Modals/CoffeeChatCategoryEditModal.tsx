import React, { useState } from 'react';
import { Modal, Button, Dropdown, DropdownProps, Input } from 'semantic-ui-react';
import { useMembers } from '../Common/FirestoreDataProvider';
import CoffeeChatAPI from '../../API/CoffeeChatAPI';
import { Emitters } from '../../utils';

type Props = {
  category: CoffeeChatCategory;
  onSaved: (updated: CoffeeChatCategory) => void;
};

const CoffeeChatCategoryEditModal: React.FC<Props> = ({ category, onSaved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(category.name);
  const [members, setMembers] = useState<MemberDetails[]>(category.members);
  const [isSaving, setIsSaving] = useState(false);
  const allMembers = useMembers();

  const memberOptions = allMembers.map((m) => ({
    key: m.netid,
    value: m.netid,
    text: `${m.firstName} ${m.lastName} (${m.netid})`
  }));

  const selectedNetids = members.map((m) => m.netid);

  const handleOpen = () => {
    setName(category.name);
    setMembers(category.members);
    setIsOpen(true);
  };

  const handleDropdownChange = (_: React.SyntheticEvent, data: DropdownProps) => {
    const netids = (data.value as string[]) ?? [];
    const updated: MemberDetails[] = netids.map((netid) => {
      const existing = members.find((m) => m.netid === netid);
      if (existing) return existing;
      const idol = allMembers.find((m) => m.netid === netid);
      return idol ? { name: `${idol.firstName} ${idol.lastName}`, netid } : { name: netid, netid };
    });
    setMembers(updated);
  };

  const trimmedName = name.trim();

  const handleSave = async () => {
    if (!trimmedName) return;
    setIsSaving(true);
    try {
      const renamed =
        trimmedName === category.name
          ? category
          : await CoffeeChatAPI.renameCategory(category.index, trimmedName);
      await CoffeeChatAPI.updateCategoryMembers(category.index, members);
      onSaved({ ...renamed, members });
      setIsOpen(false);
      Emitters.generalSuccess.emit({
        headerMsg: 'Category updated',
        contentMsg:
          trimmedName === category.name
            ? `'${trimmedName}' now has ${members.length} member(s).`
            : `'${category.name}' is now '${trimmedName}' with ${members.length} member(s).`
      });
    } catch (error) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to update category',
        contentMsg:
          error instanceof Error && error.message
            ? error.message
            : `Could not save changes to '${category.name}'.`
      });
    }
    setIsSaving(false);
  };

  return (
    <Modal
      onClose={() => setIsOpen(false)}
      onOpen={handleOpen}
      open={isOpen}
      trigger={<Button size="mini">Edit</Button>}
      size="small"
    >
      <Modal.Header>Edit: {category.name}</Modal.Header>
      <Modal.Content>
        <label htmlFor={`category-name-${category.index}`}>Category name</label>
        <Input
          fluid
          value={name}
          input={{ id: `category-name-${category.index}`, maxLength: 200 }}
          onChange={(_, data) => setName(String(data.value ?? ''))}
        />
        <p style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Members</p>
        <Dropdown
          placeholder="Search members..."
          fluid
          multiple
          search
          selection
          options={memberOptions}
          value={selectedNetids}
          onChange={handleDropdownChange}
        />
        <p style={{ marginTop: '0.75rem', color: 'grey', fontSize: '0.85rem' }}>
          {members.length} member(s) selected
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setIsOpen(false)}>Cancel</Button>
        <Button
          primary
          onClick={handleSave}
          loading={isSaving}
          disabled={isSaving || trimmedName.length === 0}
        >
          Save
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default CoffeeChatCategoryEditModal;
