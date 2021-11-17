import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Modal } from 'semantic-ui-react';
import AvatarEditor from 'react-avatar-editor';
import ProfileImageEditor from './ProfileImageEditor';
import ImagesAPI from '../../../API/ImagesAPI';

const UserProfileImage: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [editor, setEditor] = useState<null | AvatarEditor>(null);
  const setEditorRef = (editor: AvatarEditor) => setEditor(editor);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      return;
    }
    ImagesAPI.getMemberImage().then((url: string) => {
      setProfilePhoto(url);
    });
  }, []);

  const cropAndSubmitImage = () => {
    if (editor !== null) {
      const canvas = editor.getImage().toDataURL();
      let imageURL: string;
      fetch(canvas)
        .then((res) => res.blob())
        .then((blob) => {
          imageURL = window.URL.createObjectURL(blob);
          ImagesAPI.uploadMemberImage(blob);
          setProfilePhoto(imageURL);
        });
    }
    setOpen(false);
  };

  return (
    <div
      data-testid="UserProfileImage"
      style={{
        width: '100%',
        marginTop: '5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header style={{ marginBottom: '1rem' }}>Profile Image</Card.Header>
            <Image size="medium" src={profilePhoto} />
          </Card.Content>
        </Card>
      </Card.Group>

      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={<Button style={{ marginTop: '1rem' }}>Update Profile Image</Button>}
      >
        <Modal.Header>Select a Photo</Modal.Header>
        <ProfileImageEditor
          currentProfileImage={profilePhoto}
          setEditorRef={setEditorRef}
          cropAndSubmitImage={cropAndSubmitImage}
          setOpen={setOpen}
        />
      </Modal>
    </div>
  );
};

export default UserProfileImage;
