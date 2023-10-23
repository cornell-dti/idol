import { Button } from '../../components/ui/button';
import Navbar from '../../components/navbar';

const Home = (): JSX.Element => (
  <div>
    <Navbar />
    <div className="">
      <Button>This is a ShadCN Button.</Button>
      <img
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.rd.com%2Fwp-content%2Fuploads%2F2020%2F04%2FGettyImages-1153369684.jpg&f=1&nofb=1&ipt=ba5abf1adc619994565e92a9dba42a634a7abe644a1e89890eb66475380ff327&ipo=images"
        alt="A cute cat."
        className="w-screen"
      />
      <img
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.REa9Uiv1NBhD5mdU-N6d_QHaE8%26pid%3DApi&f=1&ipt=b6bc513da1feb8e6824ea09f2a19c86068012f3466447546143e0cea792b70b7&ipo=images"
        alt="A cute cat."
        className="w-screen"
      />
    </div>
  </div>
);

export default Home;
