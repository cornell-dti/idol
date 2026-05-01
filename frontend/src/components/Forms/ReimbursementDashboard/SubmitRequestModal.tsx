import React, { useState } from 'react';
import { Modal, Button, Icon } from 'semantic-ui-react';
import styles from './SubmitRequestModal.module.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

type Step = 'basic' | 'receipt' | 'review';

const STEPS: { key: Step; label: string; icon: 'user circle' | 'upload' | 'paper plane' }[] = [
  { key: 'basic', label: 'Basic information', icon: 'user circle' },
  { key: 'receipt', label: 'Receipt upload', icon: 'upload' },
  { key: 'review', label: 'Review and submit', icon: 'paper plane' }
];

const SubmitRequestModal: React.FC<Props> = ({ open, onClose }) => {
  const [step, setStep] = useState<Step>('basic');

  // Basic info fields (visualization only — never submitted anywhere).
  const [name, setName] = useState('');
  const [netID, setNetID] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [attendees, setAttendees] = useState('');

  // Receipt upload (visualization only — files exist in local state, never uploaded).
  const [vendors, setVendors] = useState<string[]>(['Uncategorized']);
  const [activeVendor, setActiveVendor] = useState<string>('Uncategorized');
  const [newVendorInput, setNewVendorInput] = useState('');
  const [showNewVendorField, setShowNewVendorField] = useState(false);
  const [receipts, setReceipts] = useState<{ vendor: string; fileName: string }[]>([]);

  const reset = () => {
    setStep('basic');
    setName('');
    setNetID('');
    setPhone('');
    setAddress('');
    setAttendees('');
    setVendors(['Uncategorized']);
    setActiveVendor('Uncategorized');
    setNewVendorInput('');
    setShowNewVendorField(false);
    setReceipts([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const goNext = () => {
    if (step === 'basic') setStep('receipt');
    else if (step === 'receipt') setStep('review');
  };

  const goBack = () => {
    if (step === 'review') setStep('receipt');
    else if (step === 'receipt') setStep('basic');
  };

  const addVendor = () => {
    const trimmed = newVendorInput.trim();
    if (trimmed && !vendors.includes(trimmed)) {
      setVendors([...vendors, trimmed]);
      setActiveVendor(trimmed);
    }
    setNewVendorInput('');
    setShowNewVendorField(false);
  };

  const removeVendor = (vendor: string) => {
    if (vendor === 'Uncategorized') return;
    setVendors(vendors.filter((v) => v !== vendor));
    setReceipts(receipts.filter((r) => r.vendor !== vendor));
    if (activeVendor === vendor) setActiveVendor('Uncategorized');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReceipts([...receipts, { vendor: activeVendor, fileName: file.name }]);
    e.target.value = '';
  };

  const removeReceipt = (index: number) => {
    setReceipts(receipts.filter((_, i) => i !== index));
  };

  const receiptsByVendor = vendors
    .map((v) => ({
      vendor: v,
      files: receipts.filter((r) => r.vendor === v)
    }))
    .filter((g) => g.files.length > 0);

  return (
    <Modal open={open} onClose={handleClose} size="large" className={styles.modal}>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>Submit new request</h2>
          <nav className={styles.stepsNav}>
            {STEPS.map((s) => (
              <div
                key={s.key}
                className={`${styles.stepItem} ${step === s.key ? styles.stepActive : ''}`}
              >
                <Icon name={s.icon} />
                <span>{s.label}</span>
              </div>
            ))}
          </nav>
        </aside>

        <div className={styles.content}>
          <button type="button" className={styles.closeButton} onClick={handleClose}>
            <Icon name="close" />
          </button>

          {step === 'basic' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Basic information</h3>
              <div className={styles.formGrid}>
                <label className={styles.field}>
                  <span className={styles.label}>Name</span>
                  <input
                    className={styles.input}
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>NetID</span>
                  <input
                    className={styles.input}
                    placeholder="jd227"
                    value={netID}
                    onChange={(e) => setNetID(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Phone Number</span>
                  <input
                    className={styles.input}
                    placeholder="1234567891"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  <span className={styles.label}>Address</span>
                  <input
                    className={styles.input}
                    placeholder="1234 Doe Ave"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </label>
              </div>
              <label className={`${styles.field} ${styles.fieldFull}`}>
                <span className={styles.label}>
                  If this reimbursement is for a social, who were the attendees?
                </span>
                <textarea
                  className={styles.textarea}
                  placeholder="List them out here..."
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                />
              </label>
            </div>
          )}

          {step === 'receipt' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Receipt upload</h3>
              <div className={styles.assignLabel}>ASSIGN TO VENDOR</div>
              <div className={styles.vendorRow}>
                {vendors.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`${styles.vendorChip} ${
                      activeVendor === v ? styles.vendorChipActive : ''
                    }`}
                    onClick={() => setActiveVendor(v)}
                  >
                    <span>{v}</span>
                    {v !== 'Uncategorized' && (
                      <Icon
                        name="close"
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          removeVendor(v);
                        }}
                      />
                    )}
                  </button>
                ))}
                {showNewVendorField ? (
                  <div className={styles.newVendorInputWrap}>
                    <input
                      className={styles.newVendorInput}
                      autoFocus
                      placeholder="Vendor name"
                      value={newVendorInput}
                      onChange={(e) => setNewVendorInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addVendor();
                        if (e.key === 'Escape') {
                          setShowNewVendorField(false);
                          setNewVendorInput('');
                        }
                      }}
                      onBlur={addVendor}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className={styles.addVendorButton}
                    onClick={() => setShowNewVendorField(true)}
                  >
                    + New vendor
                  </button>
                )}
              </div>

              <label className={styles.dropzone}>
                <Icon name="upload" />
                <span>Upload receipt(s)</span>
                <input
                  type="file"
                  accept="application/pdf"
                  className={styles.fileInput}
                  onChange={handleFileSelect}
                />
              </label>
              <div className={styles.dropzoneHint}>Files must be in pdf format.</div>

              {receiptsByVendor.length > 0 && (
                <div className={styles.uploadedList}>
                  {receiptsByVendor.map((g) => (
                    <div key={g.vendor} className={styles.uploadedGroup}>
                      <div className={styles.uploadedVendorLabel}>{g.vendor}</div>
                      {g.files.map((file) => {
                        const idx = receipts.findIndex(
                          (r) => r.vendor === file.vendor && r.fileName === file.fileName
                        );
                        return (
                          <div key={`${file.vendor}-${file.fileName}`} className={styles.fileRow}>
                            <Icon name="file outline" />
                            <span className={styles.fileName}>{file.fileName}</span>
                            <button
                              type="button"
                              className={styles.trashButton}
                              onClick={() => removeReceipt(idx)}
                            >
                              <Icon name="trash" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'review' && (
            <div className={styles.stepBody}>
              <h3 className={styles.stepTitle}>Review and submit</h3>
              <div className={styles.reviewSection}>
                <div className={styles.reviewSectionTitle}>Basic information</div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Name</span>
                  <span>{name || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>NetID</span>
                  <span>{netID || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Phone</span>
                  <span>{phone || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Address</span>
                  <span>{address || '—'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewKey}>Attendees</span>
                  <span>{attendees || '—'}</span>
                </div>
              </div>
              <div className={styles.reviewSection}>
                <div className={styles.reviewSectionTitle}>Receipts</div>
                {receipts.length === 0 ? (
                  <div className={styles.reviewEmpty}>No receipts uploaded.</div>
                ) : (
                  receipts.map((r, i) => (
                    <div key={`${r.vendor}-${r.fileName}-${i}`} className={styles.reviewRow}>
                      <span className={styles.reviewKey}>{r.vendor}</span>
                      <span>{r.fileName}</span>
                    </div>
                  ))
                )}
              </div>
              <div className={styles.demoNote}>
                This is a visualization only — submitting will not save anything.
              </div>
            </div>
          )}

          <div className={styles.footer}>
            {step !== 'basic' && (
              <Button basic onClick={goBack}>
                Back
              </Button>
            )}
            <div className={styles.footerSpacer} />
            {step !== 'review' ? (
              <Button primary onClick={goNext}>
                Next
              </Button>
            ) : (
              <Button primary onClick={handleClose}>
                Submit
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default SubmitRequestModal;
