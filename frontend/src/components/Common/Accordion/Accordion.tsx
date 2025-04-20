import React from 'react';
import styles from './Accordion.module.css';
import { ChevronDown } from 'lucide-react';

type QuestionAccordionProps = {
  header: string;
  response: string;
  defaultOpen?: boolean;
};

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

const QuestionAccordion: React.FC<QuestionAccordionProps> = ({
  header,
  response,
  defaultOpen = false
}) => {
  const wordCount = countWords(response);
  const paragraphs = response.split(/\n{1,2}/);

  return (
    <details className={styles.accordionItem} open={defaultOpen}>
      <summary className={styles.accordionSummary}>
        <h4>{header}</h4>
        <div className={styles.right}>
          <p className={`${styles.wordCount} small`}>{wordCount} words</p>
          <ChevronDown />
        </div>
      </summary>
      <div className={styles.accordionContent}>
        {paragraphs.map((para, index) => (
          <p key={index}>{para.trim()}</p>
        ))}
      </div>
    </details>
  );
};
export default QuestionAccordion;
