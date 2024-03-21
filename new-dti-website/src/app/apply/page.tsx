'use client';
import React from 'react';
import ApplyTimeline from './apply-timeline';

const Apply: React.FC = () => {
    return (
        <>
            <div
                className="flex flex-col bg-black bg-cover bg-center h-screen"
                style={{ backgroundImage: "url('/images/apply_hero_bg.png')", marginTop: '-60px' }}
            >
                <div className="flex items-center justify-center h-full">
                    <div className="flex-1 flex flex-col justify-center items-start pl-[10%]">
                        <h1 className="text-white text-8xl font-semibold uppercase" style={{ lineHeight: '1.2em', letterSpacing: '0.01em', fontFamily: 'Inter, sans-serif' }}>
                            <span style={{ display: 'block', marginBottom: '0.01em' }}>JOIN OUR</span>
                            <span style={{ color: '#FF4C4C' }}>COMMUNITY</span>
                        </h1>
                    </div>
                    <div className="w-8"></div>
                    <div className="flex-1 flex flex-col justify-center items-start pr-[10%] text-white">
                        <p className="text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'bold', marginBottom: '1rem' }}>
                            <span style={{ color: '#877B7B' }}>Down to</span> <span style={{ fontStyle: 'italic' }}>innovate?</span>
                        </p>
                        <p className="text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 'normal' }}>
                            <span style={{ fontWeight: 'bold' }}>We strive for inclusivity,</span> and encourage passionate
                            applicants to apply, regardless of experience. We’d love to
                            work with someone like you.
                        </p>
                        <button
                            style={{
                                backgroundColor: '#A52424',
                                color: 'white',
                                padding: '10px 20px',
                                fontSize: '20px',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                alignSelf: 'flex-start',
                                marginTop: '1em'
                            }}
                        >
                            Apply Now
                        </button>
                    </div>
                </div>

            </div>
            {/* <div>
                <ApplyTimeline />
            </div> */}
        </>
    );
};

export default Apply;