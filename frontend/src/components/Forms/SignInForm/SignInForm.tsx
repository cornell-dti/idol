import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Form, InputOnChangeData, Message } from 'semantic-ui-react';
import SignInFormAPI from '../../../API/SignInFormAPI';
import styles from './SignInForm.module.css';

const SIGNIN_CODE_PLACEHOLDERS = ['devsesh-2493', 'dtiah-5-21', '14M3L337', '867-5309'];

const CodeForm: React.FC<{
  defaultValue?: string;
  onClick?: () => unknown;
  disabled?: boolean;
  info?: { header: string; content: string };
  error?: { header: string; content: string };
  success?: { header: string; content: string };
}> = ({ defaultValue, onClick, disabled, info, error, success }) => {
  const [inputVal, setInputVal] = useState(defaultValue || '');
  const handleCodeChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void = (e, { name, value }) => {
    setInputVal(value);
  };
  const signInButton = (
    <Button disabled={disabled || inputVal === ''} onClick={onClick} type="submit">
      Sign In
    </Button>
  );
  return (
    <div className={styles.content}>
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
          label="Sign-In Code"
          placeholder={
            SIGNIN_CODE_PLACEHOLDERS[Math.floor(Math.random() * SIGNIN_CODE_PLACEHOLDERS.length)]
          }
        />
        {disabled || inputVal === '' ? (
          signInButton
        ) : (
          <Link href={`/forms/signin/${inputVal}`}>{signInButton}</Link>
        )}
      </Form>
    </div>
  );
};

const SignInForm: React.FC = () => {
  const location = useRouter();

  if (location.pathname === '/forms/signin' || location.pathname === '/forms/signin/') {
    return (
      <div className={styles.content}>
        <CodeForm />
      </div>
    );
  }

  if (!location.pathname.toLowerCase().startsWith('/forms/signin/'))
    throw new Error('This should be unreachable.');
  const afterPath = location.pathname.slice(14, location.pathname.length);

  return <SignInWithFormID id={afterPath} />;
};

const SignInWithFormID: React.FC<{ id: string }> = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [foundForm, setFoundForm] = useState(false);
  const [formExpired, setFormExpired] = useState(false);
  const [signInAttempted, setSignInAttempted] = useState(false);

  const onResultsScreenResubmit = () => {
    setLoading(true);
    setFoundForm(false);
    setFormExpired(false);
    setSignInAttempted(false);
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
    if (foundForm) {
      SignInFormAPI.checkIfFormExpired(id).then((resp) => {
        setFormExpired(resp);
      })
    }
  }, [id, foundForm]);

  useEffect(() => {
    if (!formExpired) {
      SignInFormAPI.submitSignIn(id).then((resp) => {
        setSignInAttempted(true);
      });
    }
  }, [id, formExpired])

  if (loading) {
    return (
      <div className={styles.content}>
        <CodeForm
          disabled
          defaultValue={id}
          info={{
            header: 'Checking if form exists...',
            content: 'Please stand by!'
          }}
        />
      </div>
    );
  }

  const ifSigningIn = signInAttempted ? (
    <div className={styles.content}>
      <CodeForm
        defaultValue={id}
        onClick={onResultsScreenResubmit}
        success={{
          header: 'Sign-In Successful!',
          content: 'Your attendance has been counted!'
        }}
      />
    </div>
  ) : (
    <div className={styles.content}>
      <CodeForm disabled info={{ header: 'Signing you in...', content: 'Please stand by!' }} />
    </div>
  );

  const ifFormExpired = formExpired ? (
    <div className={styles.content}>
      <CodeForm
        defaultValue={id}
        onClick={onResultsScreenResubmit}
        error={{
          header: `Form with id: ${id} is closed!`,
          content: 'Contact a lead if you believe this is an error.'
        }}
      />
    </div>
  ) : ifSigningIn;

  const rendered = foundForm ? (
    ifFormExpired
  ) : (
    <div className={styles.content}>
      <CodeForm
        defaultValue={id}
        onClick={onResultsScreenResubmit}
        error={{
          header: `No form found with id: ${id}!`,
          content: 'Contact a lead if you believe this is an error.'
        }}
      />
    </div>
  );
  return rendered;
};

export default SignInForm;
