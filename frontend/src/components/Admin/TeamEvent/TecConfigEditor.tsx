import React, { useEffect, useState } from 'react';
import { Form, Button, Loader, Header, Icon } from 'semantic-ui-react';
import TecConfigAPI from '../../../API/TecConfigAPI';
import { Emitters } from '../../../utils';

const TecConfigEditor: React.FC = () => {
  const [config, setConfig] = useState<TECConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    TecConfigAPI.getTecConfig().then(setConfig);
  }, []);
  if (!config)
    return (
      <Loader active inline>
        Loading TEC config…
      </Loader>
    );
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
    if (config.requiredMemberTecCredits < 0 || config.requiredLeadTecCredits < 0) {
      Emitters.generalError.emit({
        headerMsg: 'Invalid TEC config',
        contentMsg: 'Required credits must be zero or positive.'
      });
      return;
    }
    setIsSaving(true);
    try {
      const saved = await TecConfigAPI.updateTecConfig(config);
      if (saved) setConfig(saved);
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
        onChange={(_, data) => setConfig({ ...config, requiredLeadTecCredits: Number(data.value) })}
      />
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
