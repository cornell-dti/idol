import React from 'react';
import styles from './Accordion.module.css';

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
  defaultOpen = true
}) => {
  const wordCount = countWords(response);
  const paragraphs = response.split(/\n{1,2}/);

  return (
    <details className={styles.accordionItem} open={defaultOpen}>
      <summary className={styles.accordionSummary}>
        <h4>{header}</h4>
        <div className={styles.right}>
          <p className={`${styles.wordCount} small`}>{wordCount} words</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-chevron-down-icon lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
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
