import React, { useState, useEffect } from 'react';
import { Modal } from 'semantic-ui-react';
import { EventEmitter } from '../../utils';

type ErrProps = {
  headerMsg: string;
  contentMsg: string;
};

type ErrModalProps = {
  onEmitter: EventEmitter<ErrProps>;
};

const ErrorModal: React.FC<ErrModalProps> = ({ onEmitter }) => {
  const [isOpen, setOpen] = useState(false);
  const [errProps, setErrProps] = useState<ErrProps>({
    headerMsg: '',
    contentMsg: ''
  });
  useEffect(() => {
    const cb = (errProps: ErrProps) => {
      setErrProps(errProps);
      setOpen(true);
    };
    onEmitter.subscribe(cb);
    return () => {
      onEmitter.unsubscribe(cb);
    };
  });
  return (
    <Modal
      open={isOpen}
      onClose={() => setOpen(false)}
      header={errProps.headerMsg}
      content={errProps.contentMsg}
      actions={[{ key: 'close', content: 'Close', negative: true }]}
    />
  );
};

export default ErrorModal;
