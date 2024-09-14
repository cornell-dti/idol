const ApplyHero = () => (
  <div className="text-white min-h-[calc(100vh-136px)] flex items-center">
    <div className="flex gap-x-[60px] ml-[90px] mr-[169px]">
      <h1 className="text-[100px] leading-[120px] font-semibold">
        JOIN OUR <span className="text-[#FF4C4C]">COMMUNITY</span>
      </h1>
      <div className="flex flex-col gap-6">
        <h2 className="font-bold text-[40px] leading-[48px] text-[#877B7B]">
          Down to <span className="text-[#E4E4E4] italic">innovate?</span>
        </h2>
        <p className="text-lg">
          <span className="font-bold">We strive for inclusivity</span>, and encourage passionate
          applicants to apply regardless of experience. We'd love to work with someone like you.
        </p>
        <button
          className="rounded-xl py-3 px-[20px] bg-[#A52424] text-white 
          font-bold hover:bg-white hover:text-[#A52424] w-fit"
        >
          Apply now
        </button>
      </div>
    </div>
  </div>
);

const ApplyPage = () => (
  <>
    <ApplyHero />;
  </>
);

export default ApplyPage;
