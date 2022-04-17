import NavigationCard, {
  NavigationCardItem
} from '../../components/Common/NavigationCard/NavigationCard';

const navCardItems: readonly NavigationCardItem[] = [
  { header: 'DTI48', description: 'Keep merging until you get Ashneel.', link: '/games/dti48' }
];

const GamesIndex = (): JSX.Element => <NavigationCard items={navCardItems} />;
export default GamesIndex;
