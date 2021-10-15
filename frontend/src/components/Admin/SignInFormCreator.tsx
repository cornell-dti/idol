import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  Form,
  Header,
  Icon,
  InputOnChangeData,
  List,
  Loader,
  Message,
  Popup,
  SemanticICONS
} from 'semantic-ui-react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SignInFormAPI from '../../API/SignInFormAPI';
import { Emitters } from '../../utils';
import styles from './SignInFormCreator.module.css';
import 'react-datepicker/dist/react-datepicker.css';

const SIGNIN_CODE_PLACEHOLDERS = ['devsesh-2493', 'dtiah-5-21', '14M3L337', '867-5309'];

const CODE_VALIDATION_RE = '^[a-zA-Z0-9-]+$';

const regexInput = new RegExp(CODE_VALIDATION_RE);

const CodeForm: React.FC<{
  defaultValue?: string;
  onClick?: () => unknown;
  disabled?: boolean;
  info?: { header: string; content: string };
  error?: { header: string; content: string };
  success?: { header: string; content: string };
  link?: string;
}> = ({ defaultValue, onClick, disabled, info, error, success, link }) => {
  const [inputVal, setInputVal] = useState(defaultValue || '');
  const [showCopied, setShowCopied] = useState(false);
  const [expiryDate, setExpiryDate] = useState(moment().add(2, 'hours').toDate());
  const [validInput, setValidInput] = useState(true);

  const handleCodeChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => void = (e, { _, value }) => {
    setInputVal(value.trim());
    setValidInput(regexInput.test(value.trim()));
  };

  const signInButton = (
    <Button
      disabled={disabled || !regexInput.test(inputVal)}
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
            <a href={link} style={{ marginRight: 8 }}>
              <p>{link}</p>
            </a>
            <Popup
              on="hover"
              content={showCopied ? 'Copied!' : 'Copy the sign-in link!'}
              trigger={
                <Button
                  size="tiny"
                  icon
                  onClick={() => {
                    navigator.clipboard.writeText(link).then(() => {
                      setShowCopied(true);
                    });
                  }}
                >
                  <Icon name="copy" />
                </Button>
              }
            />
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
            SIGNIN_CODE_PLACEHOLDERS[Math.floor(Math.random() * SIGNIN_CODE_PLACEHOLDERS.length)]
          }
          error={
            !validInput && {
              content: 'Code should only contain letters, numbers or hyphens (no spaces).',
              pointing: 'below'
            }
          }
        />
        {!disabled && (
          <div>
            <label className={styles.dateLabel}>Code Expiry</label>
            <DatePicker
              selected={expiryDate}
              onChange={(date: Date) => setExpiryDate(date)}
              showTimeSelect
              minDate={new Date()}
              dateFormat="MMM d, yyyy h:mm aa"
            />
          </div>
        )}
        {disabled || inputVal === '' || !validInput ? (
          signInButton
        ) : (
          <Link
            href={{
              pathname: `/admin/signin-creator/`,
              query: { id: inputVal, expireAt: expiryDate.toISOString() }
            }}
          >
            {signInButton}
          </Link>
        )}
      </Form>
    </div>
  );
};

const SignInFormCreator: React.FC = () => {
  const location = useRouter();
  const code = location.query.id as string;
  const expiryDate = new Date(location.query.expireAt as string).getTime();

  if (code === undefined || expiryDate === undefined) {
    return (
      <div className={styles.content}>
        <CodeForm />
      </div>
    );
  }

  // if (!location.pathname.toLowerCase().startsWith('/admin/signin-creator/'))
  //   throw new Error('This should be unreachable.');

  return <CreateSignInForm id={code} expiryDate={expiryDate} />;
};

const CreateSignInForm: React.FC<{ id: string; expiryDate: number }> = ({ id, expiryDate }) => {
  const [loading, setLoading] = useState(true);
  const [foundForm, setFoundForm] = useState(true);
  const [createAttempted, setCreateAttempted] = useState(false);
  const [attemptFailed, setAttemptFailed] = useState(false);

  const onResultsScreenResubmit = () => {
    setLoading(true);
    setFoundForm(true);
    setCreateAttempted(false);
    setAttemptFailed(false);
  };

  useEffect(() => {
    if (loading) {
      SignInFormAPI.checkFormExists(id).then((resp) => {
        setLoading(false);
        setFoundForm(resp);
        setAttemptFailed(resp);
      });
    }
  }, [id, loading]);

  useEffect(() => {
    if (!foundForm) {
      SignInFormAPI.createSignInForm(id, expiryDate).then((resp) => {
        if (resp.error) {
          setAttemptFailed(true);
          Emitters.signInCodeError.emit({
            headerMsg: "Couldn't create sign-in code!",
            contentMsg: resp.error
          });
        } else {
          setCreateAttempted(true);
          Emitters.signInCodeCreated.emit();
        }
      });
    }
  }, [id, foundForm, expiryDate]);

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

  const ifFormOpen = createAttempted ? (
    <CodeForm
      link={`${window.location.origin}/forms/signin?id=${id}`}
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      success={{
        header: 'Create Successful!',
        content: 'Your code/link has been created!'
      }}
    />
  ) : (
    <CodeForm disabled info={{ header: 'Creating your form...', content: 'Please stand by!' }} />
  );

  const formNotCreated = foundForm ? (
    <CodeForm
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      error={{
        header: `A form already exists with id: ${id}!`,
        content: 'Choose a different id to continue.'
      }}
    />
  ) : (
    <CodeForm
      defaultValue={id}
      onClick={onResultsScreenResubmit}
      error={{
        header: `The expiry date ${new Date(expiryDate).toLocaleTimeString()} on 
            ${new Date(expiryDate).toLocaleDateString()} is in the past!`,
        content: 'Choose a different expiry date to continue.'
      }}
    />
  );

  const rendered = !attemptFailed ? ifFormOpen : formNotCreated;
  return rendered;
};

const SignInFormCreatorBase: React.FC = () => (
  <div className={styles.content}>
    <SignInFormCreator />
    <CodeAttendanceViewer />
  </div>
);

const FormListEntry: React.FC<{
  keyVal: string | number;
  onClick?: (sif: SignInForm) => unknown;
  onDelete?: (sif: SignInForm) => unknown;
  form: SignInForm;
  icon: SemanticICONS;
}> = ({ keyVal: key, onClick, form, icon, onDelete, children }) => (
  <List.Item key={key} onClick={onClick && (() => onClick(form))}>
    <List.Icon name={icon} size="large" style={{ padding: 0 }} />
    <List.Content>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <List.Header as="a">{form.id}</List.Header>
          <List.Description as="a">
            Created at {new Date(form.createdAt).toLocaleTimeString()} on{' '}
            {new Date(form.createdAt).toLocaleDateString()}
          </List.Description>
          {form.expireAt && (
            <List.Description as="a">
              Expiry at {new Date(form.expireAt).toLocaleTimeString()} on{' '}
              {new Date(form.expireAt).toLocaleDateString()}
            </List.Description>
          )}
        </div>
        <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
          <Button
            icon="trash"
            size="tiny"
            onClick={(event) => {
              event.stopPropagation();
              onDelete && onDelete(form);
            }}
          />
          <Button
            icon="copy"
            size="tiny"
            onClick={(event) => {
              event.stopPropagation();
              navigator.clipboard.writeText(`${window.location.origin}/forms/signin?=${form.id}`);
            }}
          />
        </div>
      </div>
      {children && children}
    </List.Content>
  </List.Item>
);

const ListContainer: React.FC<{ onRefresh: () => unknown }> = ({ children, onRefresh }) => (
  <>
    <Card style={{ width: '100%' }}>
      <Card.Content>
        <div className={styles.listContainer}>{children}</div>
      </Card.Content>
    </Card>
    <Button style={{ margin: 8 }} onClick={onRefresh} icon="refresh" />
  </>
);

let prom: Promise<unknown> = Promise.resolve();

const CodeAttendanceViewer: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [isGrabbing, setGrabbing] = useState(true);
  const [forms, setForms] = useState<readonly SignInForm[]>([]);
  const [viewingForm, setViewingForm] = useState<SignInForm | null>(null);

  const fullReset = () => {
    setLoading(true);
    setGrabbing(true);
    setForms([]);
    setViewingForm(null);
  };

  const onDelete = (f: SignInForm) => {
    setLoading(true);
    prom = prom.then(() =>
      SignInFormAPI.deleteSignInForm(f.id).then(() => {
        fullReset();
      })
    );
  };

  useEffect(() => {
    const cb = () => {
      fullReset();
    };
    Emitters.signInCodeCreated.subscribe(cb);
    return () => {
      Emitters.signInCodeCreated.unsubscribe(cb);
    };
  });

  useEffect(() => {
    if (isGrabbing) {
      SignInFormAPI.getAllSignInForms().then((v) => {
        setForms(v.forms);
        setGrabbing(false);
        setLoading(false);
      });
    }
  }, [isGrabbing]);

  if (isLoading) {
    return (
      <Loader active size="large">
        Loading attendance data...
      </Loader>
    );
  }
  const onClick = (e: SignInForm) => {
    setViewingForm(e);
  };
  if (viewingForm === null) {
    const listElts = forms.map((e, ind) => (
      <FormListEntry
        key={ind}
        keyVal={ind}
        onClick={onClick}
        form={e}
        icon="angle right"
        onDelete={() => onDelete(e)}
      />
    ));
    return (
      <ListContainer onRefresh={fullReset}>
        <List relaxed key={-97}>
          {listElts}
          {listElts.length === 0 && <Header size="medium">No sign-in codes yet!</Header>}
        </List>
      </ListContainer>
    );
  }

  const onReturn = () => {
    setViewingForm(null);
  };

  const signIns = [...viewingForm.users]
    .sort((a, b) => (a.signedInAt <= b.signedInAt ? -1 : 1))
    .map(({ signedInAt, user }, ind) => (
      <List.Item key={ind} onClick={onReturn} style={{ marginTop: 8 }}>
        <List.Icon name="hand paper outline" size="small" />
        <List.Content>
          <List.Header as="a">{`${user.firstName} ${user.lastName} (${user.netid})`}</List.Header>
          <List.Description as="a">
            Signed in at {new Date(signedInAt).toLocaleTimeString()} on{' '}
            {new Date(signedInAt).toLocaleDateString()}
          </List.Description>
        </List.Content>
      </List.Item>
    ));

  return (
    <ListContainer onRefresh={fullReset}>
      <List relaxed key={-98} style={{ padding: 0 }}>
        <FormListEntry
          keyVal={-100}
          onClick={onReturn}
          form={viewingForm}
          icon="angle left"
          onDelete={() => onDelete(viewingForm)}
        >
          <List.List
            key={-99}
            style={{
              padding: 0,
              marginTop: viewingForm.users.length > 0 ? 16 : 0
            }}
          >
            {signIns}
          </List.List>
        </FormListEntry>
      </List>
    </ListContainer>
  );
};

export default SignInFormCreatorBase;
