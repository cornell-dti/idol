const SponsorHero = () => (
  <div className="bg-black text-white md:my-[100px] xs:my-9 min-h-[calc(100vh-336px)]">
    <div
      className="flex lg:flex-row xs:flex-col w-10/12 gap-y-9 relative z-10
      lg:ml-[152px] md:ml-10 xs:ml-9"
    >
      <div className="mr-20">
        <h1
          className="font-semibold md:text-[100px] xs:text-[52px] md:leading-[120px] 
          xs:leading-[63px] w-[550px]"
        >
          SUPPORT <span className="text-[#FF4C4C]">OUR TEAM</span>
        </h1>
      </div>
      <div className="flex flex-col justify-center gap-6">
        <h2 className="font-bold md:text-[40px] xs:text-2xl">
          <span className="text-[#877B7B]">Let's</span> <span className="italic">collaborate</span>
        </h2>
        <p className="md:text-lg xs:text-sm">
          The generous contributions of our supporters and sponsors allow our team to continue
          building products and hosting initiatives to{' '}
          <span className="font-bold">help the Cornell and Ithaca communities.</span>
        </p>
        <button
          className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          Donate now
        </button>
      </div>
    </div>
  </div>
);

const SponsorPage = () => (
  <>
    <SponsorHero />
    <div className="bg-[#EDEDED] flex justify-center">
      <div className="max-w-5xl flex justify-center py-14 gap-20">
        <img src="/images/dti_2024.png" alt="DTI 2024" className="rounded-3xl w-[475px] h-auto" />
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-2xl">Become a sponsor!</h3>
          <p className="text-lg">
            We would love to partner with organizations that share our vision of changing the world.
            Together, we can{' '}
            <span className="font-bold">
              harness the power of technology to drive change in our communities.
            </span>
          </p>
          <button
            className="rounded-xl py-3 px-[14px] bg-[#A52424] text-white 
            font-bold hover:bg-white hover:text-[#A52424] w-fit"
          >
            Contact us
          </button>
        </div>
      </div>
    </div>
    <div className="max-w-5xl flex justify-center">

    </div>
  </>
);

export default SponsorPage;
