import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'semantic-ui-react';
import { usePreview } from '../../redesign/preview';
import {
  Modal as NewModal,
  Button as NewButton,
  DesignSystemScope
} from '../../design-system-2026/components';
import { EventEmitter } from '../../utils';

type SuccessProps = {
  headerMsg: string;
  contentMsg: string;
  child?: React.ReactElement;
};

type SuccessModalProps = {
  onEmitter: EventEmitter<SuccessProps>;
};

const SuccessModal: React.FC<SuccessModalProps> = ({ onEmitter }) => {
  const preview = usePreview();
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
  }, [onEmitter]);
  if (preview) {
    return (
      <DesignSystemScope>
        <NewModal
          id="success-notification"
          open={isOpen}
          onOpenChange={setOpen}
          title={successProps.headerMsg}
          description={successProps.contentMsg}
          footer={<NewButton onClick={() => setOpen(false)}>Done</NewButton>}
        >
          {successProps.child}
        </NewModal>
      </DesignSystemScope>
    );
  }
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
