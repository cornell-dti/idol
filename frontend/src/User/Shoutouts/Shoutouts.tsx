import React from 'react';
import ShoutoutForm from './ShoutoutForm/ShoutoutForm';

const Shoutouts: React.FC = () => (
  <div
    style={{
      width: '50%',
      alignSelf: 'center',
      margin: 'auto',
      paddingTop: '10vh',
      height: 'calc(100vh - 80px - 10vh)'
    }}
  >
    <ShoutoutForm></ShoutoutForm>
  </div>
);

export default Shoutouts;
