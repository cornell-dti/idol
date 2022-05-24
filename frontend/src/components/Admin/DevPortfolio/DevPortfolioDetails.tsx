import { useState, useEffect } from 'react';
import DevPortfolioAPI from '../../../API/DevPortfolioAPI';

type Props = {
  uuid: string;
};

const DevPortfolioDetails: React.FC<Props> = ({ uuid }) => {
  const [portfolio, setPortfolio] = useState<DevPortfolio | null>(null);

  useEffect(() => {
    DevPortfolioAPI.getDevPortfolio(uuid).then((portfolio) => setPortfolio(portfolio));
  }, [uuid]);
  return;
};

export default DevPortfolioDetails;
