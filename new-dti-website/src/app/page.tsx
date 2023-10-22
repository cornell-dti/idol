import { Button } from '../../components/ui/button';
import Navbar from '../../components/navbar';

const Home = (): JSX.Element => (
  <div className="bg-black">
    <Navbar selectedPage="" />
    <Button>This is a ShadCN Button.</Button>
  </div>
);

export default Home;
