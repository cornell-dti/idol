import { Button } from '../../components/ui/button';
import Navbar from '../../components/navbar';
import Bottom from '../../components/bottom';

const Home = (): JSX.Element => (
  <div>
    <Navbar />
    <Button>This is a ShadCN Button.</Button>
    <Bottom />
  </div>
);

export default Home;
