import React, { useState, useEffect } from 'react';
import { Form, Button, Header, Icon } from 'semantic-ui-react';
import TecConfigAPI from '../../../API/TecConfigAPI';
import { Emitters, withKindCreditDefaults } from '../../../utils';

type Props = {
  initialConfig: TECConfig;
  onSaved: (saved: TECConfig) => void;
};

const TecConfigEditor: React.FC<Props> = ({ initialConfig, onSaved }) => {
  const [config, setConfig] = useState<TECConfig>(withKindCreditDefaults(initialConfig));
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setConfig((prev) =>
      withKindCreditDefaults({
        ...prev,
        considerEventKind: initialConfig.considerEventKind
      })
    );
  }, [initialConfig.considerEventKind]);
  const updatePeriod = (index: number, newValue: string) => {
    const next = [...config.periodEndDates];
    next[index] = newValue;
    setConfig({ ...config, periodEndDates: next });
  };
  const addPeriod = () => {
    setConfig({ ...config, periodEndDates: [...config.periodEndDates, ''] });
  };
  const removePeriod = (index: number) => {
    setConfig({
      ...config,
      periodEndDates: config.periodEndDates.filter((_, i) => i !== index)
    });
  };
  const handleSave = async () => {
    if (config.periodEndDates.length === 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid TEC config',
        contentMsg: 'You must have at least one period.'
      });
      return;
    }
    if (config.periodEndDates.some((d) => Number.isNaN(new Date(d).getTime()))) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid TEC config',
        contentMsg: 'One or more period end dates are not valid dates.'
      });
      return;
    }
    if (
      config.requiredMemberTecCredits < 0 ||
      config.requiredLeadTecCredits < 0 ||
      config.requiredMemberInternalTecCredits < 0 ||
      config.requiredMemberExternalTecCredits < 0 ||
      config.requiredLeadInternalTecCredits < 0 ||
      config.requiredLeadExternalTecCredits < 0
    ) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid TEC config',
        contentMsg: 'Required credits must be zero or positive.'
      });
      return;
    }
    setIsSaving(true);
    try {
      const saved = await TecConfigAPI.updateTecConfig(
        withKindCreditDefaults({
          ...config,
          considerEventKind: initialConfig.considerEventKind
        })
      );
      if (saved) {
        setConfig(saved);
        onSaved(saved);
      }
      Emitters.generalSuccess.emit({
        headerMsg: 'TEC config saved',
        contentMsg: 'Period end dates and credit requirements have been updated.'
      });
    } catch (err) {
      Emitters.generalError.emit({
        headerMsg: 'Failed to save TEC config',
        contentMsg: `${err}`
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Form>
      <Header as="h1">Edit TEC Periods</Header>
      <Header as="h4">Period End Dates</Header>
      {config.periodEndDates.map((date, i) => (
        <Form.Group key={i} inline>
          <Form.Input
            type="datetime-local"
            step="1"
            value={date}
            onChange={(_, data) => updatePeriod(i, data.value)}
          />
          <Button type="button" icon basic color="black" onClick={() => removePeriod(i)}>
            <Icon name="trash" />
          </Button>
        </Form.Group>
      ))}
      <Button type="button" onClick={addPeriod} size="small">
        + Add period
      </Button>
      <Header as="h4">Required Credits</Header>
      {config.considerEventKind ? (
        <>
          <Form.Input
            label="Members — Internal"
            type="number"
            min={0}
            value={config.requiredMemberInternalTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredMemberInternalTecCredits: Number(data.value) })
            }
          />
          <Form.Input
            label="Members — External"
            type="number"
            min={0}
            value={config.requiredMemberExternalTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredMemberExternalTecCredits: Number(data.value) })
            }
          />
          <Form.Input
            label="Leads — Internal"
            type="number"
            min={0}
            value={config.requiredLeadInternalTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredLeadInternalTecCredits: Number(data.value) })
            }
          />
          <Form.Input
            label="Leads — External"
            type="number"
            min={0}
            value={config.requiredLeadExternalTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredLeadExternalTecCredits: Number(data.value) })
            }
          />
        </>
      ) : (
        <>
          <Form.Input
            label="Members"
            type="number"
            min={0}
            value={config.requiredMemberTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredMemberTecCredits: Number(data.value) })
            }
          />
          <Form.Input
            label="Leads"
            type="number"
            min={0}
            value={config.requiredLeadTecCredits}
            onChange={(_, data) =>
              setConfig({ ...config, requiredLeadTecCredits: Number(data.value) })
            }
          />
        </>
      )}
      <Button
        type="button"
        color="black"
        primary
        onClick={handleSave}
        loading={isSaving}
        disabled={isSaving}
      >
        Save
      </Button>
    </Form>
  );
};
export default TecConfigEditor;
