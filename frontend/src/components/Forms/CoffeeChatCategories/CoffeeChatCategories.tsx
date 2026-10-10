import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Loader } from 'semantic-ui-react';
import CoffeeChatAPI from '../../../API/CoffeeChatAPI';
import { Emitters } from '../../../utils';
import styles from './CoffeeChatCategories.module.css';

const CoffeeChatCategories: React.FC = () => (
  <div className={styles.page}>
    <h1 className={styles.title}>Coffee Chat Categories</h1>
    <MemberView />
  </div>
);

const MemberView: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [board, submitted] = await Promise.all([
          CoffeeChatAPI.getCoffeeChatBingoBoard(),
          CoffeeChatAPI.getCoffeeChatCategoriesByUser()
        ]);
        const names = board.flat().filter((name) => name.trim() !== '');
        const submittedSet = new Set(submitted);
        setCategories(names);
        setChecked(Object.fromEntries(names.map((name) => [name, submittedSet.has(name)])));
      } catch (err) {
        Emitters.generalError.emit({
          headerMsg: "Couldn't load categories",
          contentMsg:
            err instanceof Error ? err.message : 'Could not load your coffee chat categories.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const submitCategories = async () => {
    setIsSubmitting(true);
    try {
      const selected = categories.filter((name) => checked[name]);
      await CoffeeChatAPI.submitCoffeeChatCategories(selected);
      Emitters.generalSuccess.emit({
        headerMsg: 'Categories submitted',
        contentMsg: 'Your coffee chat categories have been submitted.'
      });
    } catch (err) {
      Emitters.generalError.emit({
        headerMsg: "Couldn't submit categories",
        contentMsg:
          err instanceof Error ? err.message : 'Could not submit your coffee chat categories.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader active inline="centered" content="Loading categories..." />;

  return (
    <div className={styles.categoryList}>
      <p className={styles.listTitle}>Select the categories you fit</p>
      {categories.map((name) => (
        <div key={name} className={styles.categoryRow}>
          <span>{name}</span>
          <Checkbox
            className={styles.checkbox}
            aria-label={name}
            checked={checked[name] ?? false}
            onChange={(_, data) =>
              setChecked((prev) => ({ ...prev, [name]: Boolean(data.checked) }))
            }
          />
        </div>
      ))}
      <Button
        primary
        className={styles.submitButton}
        loading={isSubmitting}
        disabled={isSubmitting}
        onClick={submitCategories}
      >
        Submit
      </Button>
    </div>
  );
};

export default CoffeeChatCategories;
