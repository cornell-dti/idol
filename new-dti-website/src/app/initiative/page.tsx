const InitiativeHero = () => (
  <div className="bg-black text-[#FEFEFE] min-h-[calc(100vh-136px)] h-full flex items-center">
    <div
      className="flex lg:flex-row xs:flex-col gap-x-[60px] lg:ml-[90px] lg:mr-[169px]
      xs:mx-6 md:mx-[65px]"
    >
      <h1
        className="flex items-center md:text-[100px] xs:text-[48px] md:leading-[120px] 
        xs:text-[48px] font-semibold"
      >
        <div>
          INSPIRING <span className="text-[#FF4C4C]">INNOVATION</span>
        </div>
      </h1>
      <div className="flex flex-col gap-6">
        <h2
          className="font-bold md:text-[40px] xs:text-[24px] md:leading-[48px] 
          xs:leading-[29px] text-[#877B7B]"
        >
          Invigorating <span className="text-[#E4E4E4] italic">growth</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          What sets us apart from other project teams is our desire to{' '}
          <span className="font-bold">share our discoveries</span> with other students and members
          of the greater Ithaca community.
        </p>
      </div>
    </div>
  </div>
);

const InitiativePage = () => (
  <div className="bg-white flex flex-col md:gap-[200px] xs:gap-[80px] overflow-hidden">
    <InitiativeHero />
    <div className="bg-white h-[500px]"></div>
  </div>
);

export default InitiativePage;
