import React, { useState, useEffect } from 'react';
// import styles from './EmailNotFoundErrorModal.module.css';
import { Modal } from 'semantic-ui-react';
import Emitters from '../../EventEmitter/constant-emitters';

const EmailNotFoundErrorModal: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    const cb = () => setOpen(true);
    Emitters.emailNotFoundError.subscribe(cb);
    return () => {
      Emitters.emailNotFoundError.unsubscribe(cb);
    };
  });
  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      header="Couldn't find a DTI member with that email!"
      content="Contact a lead if you believe that this is an error."
      actions={[{ key: 'close', content: 'Close', negative: true }]}
    />
  );
};

export default EmailNotFoundErrorModal;
