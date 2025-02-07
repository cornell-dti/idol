import { useEffect } from 'react';

const useTitle = (title?: string) => {
  useEffect(() => {
    document.title = `${title ? `${title} | ` : ''} Cornell DTI`;
  }, []);
};

export default useTitle;
