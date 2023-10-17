import React from 'react';
import { Button } from '../../components/ui/button';
import './assets/hero.css';

const Home = (): JSX.Element => (
    <div className="home-container">
        <div className="hero-section">
            <Button>This is a ShadCN Button.</Button>
            {}
        </div>
    </div>
);

export default Home;

