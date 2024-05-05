import React from 'react';

const CoffeeChat: React.FC = () => {
  return (
    <div
      className="flex flex-col items-center justify-center font-inter"
      style={{
        backgroundImage: "url('/images/apply_coffee_chat_bg.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '436px'
      }}
    >
      <div className="w-full max-w-3xl px-4">
        <h1 className="text-3xl font-bold text-white mb-3">Have more questions?</h1>
        <p className="text-md text-white mb-6">
          Feel free to chat with any of us over email, coffee, lunch—we’re happy to help!
        </p>
        <div className="flex gap-3 mb-8">
          <button className="text-white font-semibold px-5 py-3 rounded bg-[#A52424]">
            Grab a coffee with us
          </button>
          <button
            className="font-semibold px-5 py-3 rounded"
            style={{ backgroundColor: 'rgba(255, 220, 220, 1)', color: 'black' }}
          >
            Don't know who to chat with?
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeChat;
