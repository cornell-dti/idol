import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Form, Icon, InputOnChangeData, Loader, Message, Popup } from 'semantic-ui-react';
import SignInFormAPI from '../../API/SignInFormAPI';
import Emitters from '../../EventEmitter/constant-emitters';
import styles from './SignInFormCreator.module.css';

const SIGNIN_CODE_PLACEHOLDERS = [
  'devsesh-2493',
  'dtiah-5-21',
  '14M3L337',
  '867-5309'
];

const CodeForm: React.FC<{
  defaultValue?: string;
  onClick?: () => unknown;
  disabled?: boolean;
  info?: { header: string; content: string };
  error?: { header: string; content: string };
  success?: { header: string; content: string };
  link?: string
}> = ({ defaultValue, onClick, disabled, info, error, success, link }) => {
  const [inputVal, setInputVal] = useState(defaultValue || '');
  const [showCopied, setShowCopied] = useState(false);
  const handleCodeChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void = (e, { name, value }) => {
    setInputVal(value);
  };
  const signInButton = (
    <Button
      disabled={disabled || inputVal === ''}
      onClick={() => {
        setShowCopied(false);
        onClick && onClick();
      }}
      type="submit"
    >
      Create Code/Link
    </Button>
  );
  return (
    <div className={styles.content}>
      {link && (
        <Message info>
          <Message.Header>Your link has been created!</Message.Header>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <a href={link} style={{ marginRight: 8 }}><p>{link}</p></a>
            <Popup on='hover' content={showCopied ? 'Copied!' : 'Copy the sign-in link!'} trigger={
              <Button size="tiny" icon onClick={() => {
                navigator.clipboard.writeText(link).then(() => {
                  setShowCopied(true);
                });
              }}>
                <Icon name='copy' />
              </Button>
            } />
          </div>
        </Message>
      )}
      <Form
        error={error !== undefined}
        success={success !== undefined}
        warning={info !== undefined}
      >
        {error && <Message error {...error} />}
        {success && <Message success {...success} />}
        {info && <Message warning {...info} />}
        <Form.Input
          value={disabled && inputVal}
          disabled={disabled}
          content={defaultValue}
          onChange={handleCodeChange}
          label="New Sign-In Code"
          placeholder={
            SIGNIN_CODE_PLACEHOLDERS[
              Math.floor(Math.random() * SIGNIN_CODE_PLACEHOLDERS.length)
            ]
          }
        />
        {(disabled || inputVal === '') ? (
          signInButton
        )
        : (
          <Link to={`/admin/signin-creator/${inputVal}`}>
            {signInButton}
          </Link>
        )}
      </Form>
    </div>
  );
};

const SignInFormCreator: React.FC = () => {
  const location = useLocation();

  if (
    location.pathname === '/admin/signin-creator' ||
    location.pathname === '/admin/signin-creator/'
  ) {
    return (
      <div className={styles.content}>
        <CodeForm />
      </div>
    );
  }

  if (!location.pathname.toLowerCase().startsWith('/admin/signin-creator/'))
    throw new Error('This should be unreachable.');
  const afterPath = location.pathname.slice(22, location.pathname.length);

  return <SignInWithFormID id={afterPath} />;
};

const SignInWithFormID: React.FC<{ id: string }> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [foundForm, setFoundForm] = useState(true);
  const [createAttempted, setCreateAttempted] = useState(false);
  const [createdCode, setCreatedCode] = useState(false);
  const [createError, setCreateError] = useState<Record<string, unknown> | undefined>(undefined);

  const onResultsScreenResubmit = () => {
    setLoading(true);
    setFoundForm(true);
    setCreateAttempted(false);
    setCreatedCode(false);
    setCreateError(undefined);
  };

  useEffect(() => {
    if (loading) {
      SignInFormAPI.checkFormExists(id).then((resp) => {
        setLoading(false);
        setFoundForm(resp);
      });
    }
  }, [id, loading]);

  useEffect(() => {
    if (!foundForm) {
      SignInFormAPI.createSignInForm(id).then((resp) => {
        setCreateAttempted(true);
        setCreatedCode(resp.success);
        if (resp.error) {
          Emitters.generalError.emit({
          headerMsg: 'Couldn\'t create sign-in form!',
          contentMsg: (resp.error as any).reason
        })
          setCreateError(resp.error);
        }
      });
    }
  }, [id, foundForm]);

  if (loading) {
    return (
      <CodeForm
        disabled
        defaultValue={id}
        info={{
          header: 'Checking if form exists...',
          content: 'Please stand by!'
        }}
      />
    );
  }

  const signInResult = createdCode ? (
    <CodeForm
      link={`${window.location.origin}/forms/signin/${id}`}
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      success={{
        header: 'Create Successful!',
        content: 'Your code/link has been created!'
      }}
    />
  ) : (
    <CodeForm
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      error={{
        header: 'Create Failed!',
        content: `Contact a lead if you believe this is an error. ERR: ${createError}`
      }}
    />
  );

  const ifFormOpen = createAttempted ? (
    signInResult
  ) : (
    <CodeForm
      disabled
      info={{ header: 'Creating your form...', content: 'Please stand by!' }}
    />
  );

  const rendered = !foundForm ? (
    ifFormOpen
  ) : (
    <CodeForm
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      error={{
        header: `A form already exists with id: ${id}!`,
        content: 'Choose a different id to continue.'
      }}
    />
  );
  return rendered;
};

const SignInFormCreatorBase: React.FC = () => (
  <div className={styles.content}>
    <SignInFormCreator/>
    <CodeAttendanceViewer/>
  </div>
);

const CodeAttendanceViewer: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [searchingNotViewing, setSearchingNotViewing] = useState(true);

  if(isLoading){
    return (
      <Loader active size="large">Loading attendance data...</Loader>
    )
  }
  return (
    <></>
  );
};

export default SignInFormCreatorBase;
