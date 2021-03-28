import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import EventEmitter from '../../EventEmitter/event-emitter';

type SuccessProps = {
  headerMsg: string;
  contentMsg: string;
  child?: React.ReactElement;
};

type SuccessModalProps = {
  onEmitter: EventEmitter<SuccessProps>;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ onEmitter }) => {
  const [isOpen, setOpen] = useState(false);
  const [successProps, setSuccessProps] = useState<SuccessProps>({
    headerMsg: '',
    contentMsg: ''
  });
  useEffect(() => {
    const cb = (successProps: SuccessProps) => {
      setSuccessProps(successProps);
      setOpen(true);
    };
    onEmitter.subscribe(cb);
    return () => {
      onEmitter.unsubscribe(cb);
    };
  });
  return (
    <Modal open={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header>{`${successProps.headerMsg} :)`}</Modal.Header>
      <Modal.Content>{successProps.contentMsg}</Modal.Content>
      {successProps.child ?? successProps.child}
      <Modal.Actions>
        <Button
          content="Done"
          labelPosition="right"
          icon="checkmark"
          onClick={() => setOpen(false)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default SuccessModal;
