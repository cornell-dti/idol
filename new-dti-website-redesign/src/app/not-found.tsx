import Layout from '../components/Layout';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <Layout>
      <div className="bg-[url('/404-background.png')] bg-cover bg-center bg-no-repeat absolute inset-0 w-full h-full z-[-4]"></div>

      <section className="flex items-center justify-center !border-transparent flex-col gap-8 py-32 h-[90vh] relative">
        <div className="rounded-2xl flex flex-col gap-8 bg-gradient-to-b from-background-2 to-background-1 p-8 max-[900px]:w-full w-200 items-center justify-center relative before:content-[''] before:absolute before:-top-px before:-left-px before:w-[calc(100%+2px)] before:h-[calc(100%+2px)] before:z-[-2] before:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.2),rgba(255,255,255,0.05))] before:rounded-2xl">
          <div className="flex flex-col gap-2">
            <h1 className="!text-[96px] text-center"> 404</h1>

            <h2 className="h3 text-center">Oops, page not found :/</h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 items-center">
              <p className="h5">Wanna help fix this?</p>

              <p className="text-foreground-3 text-center">
                Page not found, but maybe a new teammate is.
              </p>
            </div>

            <div className="flex flex-col align sm:flex-row gap-4">
              <Button href="/apply" label="Apply to DTI" className="w-full" />

              <Button href="/" label="Back to homepage" variant="secondary" className="w-full" />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
