type Props = {
  headers: string[];
  responses: string[];
};

const ResponsesPanel: React.FC<Props> = ({ headers, responses }) => {
  return (
    <div>
      {headers.map((header, i) => (
        <div>
          <h4 style={{ margin: '12px 0' }}>{header}</h4>
          <div>{responses[i]}</div>
        </div>
      ))}
    </div>
  );
};

export default ResponsesPanel;
