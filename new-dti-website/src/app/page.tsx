import { Button } from '../../components/ui/button';

import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

const Home = (): JSX.Element => (
  <div>
    <Navbar />
    <Button>This is a ShadCN Button.</Button>
    <Footer />
  </div>
);

export default Home;
