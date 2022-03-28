import React, { lazy, Suspense } from 'react';
import { Image } from 'semantic-ui-react';
import ImagesAPI from '../../API/ImagesAPI';

// const LazySignIn = lazy(() => import('./SignIn'));

const renderLoader = () => <p>Loading</p>;

const AsyncImage = (props: {name: string}): JSX.Element => (
    <Suspense fallback={renderLoader()}>
        <Image src={ImagesAPI.getEventProofImage(props.name).then((url: string) => { console.log(url); return url; })}/>
    </Suspense>
);

export default AsyncImage;
