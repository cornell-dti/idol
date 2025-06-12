import Layout from '../components/Layout';
import Image from 'next/image';
import Button from '../components/Button';

const users = [
  {
    name: 'Chris',
    imageUrl: '/404/chris.png'
  },
  {
    name: 'Juju',
    imageUrl: '/404/juju.png'
  },
  {
    name: 'Clément',
    imageUrl: '/404/clément.png'
  },
  {
    name: 'Adrienne',
    imageUrl: '/404/adrienne.png'
  }
];

const Card = ({ name, imageUrl }) => (
  <article className="rounded-lg px-16 py-8 flex flex-col gap-8 bg-gradient-to-b from-background-2 to-background-1 relative border-border-1 border-1 transition-all hover:transform hover:scale-102 top-0 hover:-top-2 items-center group">
    {imageUrl && <Image src={imageUrl} alt={`${name}'s drawing`} width={120} height={191} className="transition-all group-hover:transform group-hover:rotate-[-5deg] group-hover:scale-102"/>}

    <Button label={name} variant="secondary" onClick={null} />
  </article>
);

export default function NotFound() {
  return (
    <Layout>
      <section className="flex items-center justify-center !border-none flex-col gap-8 py-32">
        <div className="flex flex-col gap-4">
          <h1>404 Page not found</h1>
          <p className="text-foreground-3 text-center">
            Looks like a DTI developer on <abbr title="Internal DTI Organization Logic">IDOL</abbr>{' '}
            messed up :/
          </p>
        </div>

        <h2 className="h4 text-accent-red">Pick who to replace</h2>

        <div className="flex gap-8">
          {users.map((user, idx) => (
            <Card
              key={idx}
              name={user.name}
              imageUrl={user.imageUrl}
            />
          ))}
        </div>

        <div className="flex rounded-l border-1 border-border-1 w-128">
          <div className="flex flex-col items-center justify-center gap-4 border-r-1 border-border-1 p-8 flex-1">
            <h3 className="h6 text-foreground-3">Wanna help fix this?</h3>
            <Button href="/apply" label="Apply now" />
          </div>

          <div className="flex flex-col items-center justify-center gap-4 p-8 flex-1">
            <h3 className="h6 text-foreground-3">Feeling forgiving?</h3>
            <Button href="/" label="Back to Home" variant="secondary" />
          </div>
        </div>
      </section>
    </Layout>
  );
}
