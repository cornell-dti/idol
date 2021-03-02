import React from 'react';
import { useState } from 'react';
import { Card, Image, Button, Modal } from 'semantic-ui-react';
import AramHeadshot from '../../../static/images/aram-headshot.jpg';
import ProfileImageEditor from './ProfileImageEditor/ProfileImageEditor';

const UserProfileImage: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  // grab image from AWS bucket. set profilePhoto to initial photo
  const [profilePhoto, setProfilePhoto] = useState<string>(AramHeadshot);
  const [editor, setEditor] = useState<null | any>(null);
  const setEditorRef = (editor: any) => setEditor(editor);

  const cropAndSubmitImage = () => {
    if (editor !== null) {
      const canvas = editor.getImage().toDataURL();
      let imageURL: string;
      fetch(canvas)
        .then(res => res.blob())
        .then(blob => {
          imageURL = window.URL.createObjectURL(blob);
          setProfilePhoto(imageURL);
        });
    }
    setOpen(false);
  };

  return (
    <div
      data-testid="UserProfileImage"
      style={{ width: '100%', marginTop: '5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
    >
      <Card.Group>
        <Card>
          <Card.Content>
            <Card.Header style={{ marginBottom: '1rem' }}>Profile Image</Card.Header>
            <Image
              size='medium'
              src={profilePhoto}
            />
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
  )
}

export default UserProfileImage;