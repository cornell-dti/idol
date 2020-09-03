import React, { useState, useEffect } from 'react';
import styles from './EmailNotFoundErrorModal.module.css';
import { Modal, Button } from 'semantic-ui-react';
import { Emitters } from '../../EventEmitter/constant-emitters';

const EmailNotFoundErrorModal: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  useEffect(() => {
    let cb = () => setOpen(true);
    Emitters.emailNotFoundError.subscribe(cb);
    return () => {
      Emitters.emailNotFoundError.unsubscribe(cb);
    }
  });
  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      header="Couldn't find member with that email!"
      content='See a lead if you believe this is an error'
      actions={[{ key: 'close', content: 'Close', negative: true }]}
    />
  )
};

export default EmailNotFoundErrorModal;
