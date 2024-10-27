'use client';
import Image from 'next/image';

// * Image imports
import cureviews1 from '../../public/images/products/cureviews/CuReviews1.png';
import cureviews2 from '../../public/images/products/cureviews/CuReviews2.png';
import courseplan1 from '../../public/images/products/courseplan/courseplan1.png';
import courseplan2 from '../../public/images/products/courseplan/courseplan2.png';
import courseplan3 from '../../public/images/products/courseplan/courseplan3.png';
import qmi1 from '../../public/images/products/qmi/qmi1.png';
import qmi2 from '../../public/images/products/qmi/qmi2.png';
import qmi3 from '../../public/images/products/qmi/qmi3.png';
import dcc1 from '../../public/images/products/dcc/dcc1.png';
import dcc2 from '../../public/images/products/dcc/dcc2.png';
import dcc3 from '../../public/images/products/dcc/dcc3.png';
import dcc4 from '../../public/images/products/dcc/dcc4.png';
import zing1 from '../../public/images/products/zing/zing1.png';
import zing2 from '../../public/images/products/zing/zing2.png';
import zing3 from '../../public/images/products/zing/zing3.png';
import cuapts1 from '../../public/images/products/cuapts/cuapts1.png';
import cuapts2 from '../../public/images/products/cuapts/cuapts2.png';

// * Global CSS styles
const GlobalStyles = () => (
  <style jsx global>{`
    @keyframes floatUp {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-8px);
      }
    }

    @keyframes floatDown {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(8px);
      }
    }

    @keyframes floatRight {
      0%,
      100% {
        transform: translateX(0);
      }
      50% {
        transform: translateX(8px);
      }
    }

    .floating-up {
      will-change: transform;
      animation: floatUp 3s ease-in-out infinite;
    }

    .floating-down {
      will-change: transform;
      animation: floatDown 3s ease-in-out infinite;
    }

    .floating-right {
      will-change: transform;
      animation: floatRight 3s ease-in-out infinite;
    }

    .floating-delay {
      animation-delay: 0.75s;
    }
  `}</style>
);

// * This is the CuReviews Component
export function CuReviews() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-4xl">
        <div className="relative w-full">
          <Image src={cureviews1} alt="CuReviews1" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[-5%] right-[15%] w-[60%] floating-down">
          <Image src={cureviews2} alt="CuReviews2" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

// * This is the CoursePlan Component
export function CoursePlan() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-4xl">
        <div className="relative w-full">
          <Image src={courseplan1} alt="courseplan1" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[-11%] left-[9%] w-[55%] floating-down">
          <Image src={courseplan2} alt="CuReviews2" className="w-full h-auto" />
        </div>

        <div className="absolute top-[3%] right-[8%] w-[30%] floating-up floating-delay">
          <Image src={courseplan3} alt="CuReviews2" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

export function QMI() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-3xl">
        <div className="relative w-full">
          <Image src={qmi1} alt="qmi1" className="w-full h-auto" />
        </div>

        <div className="absolute top-[-3%] right-[-12%] w-[30%] floating-up floating-delay">
          <Image src={qmi2} alt="qmi2" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[3%] right-[-13%] w-[105%] floating-down">
          <Image src={qmi3} alt="qmi3" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

export function DCC() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-4xl">
        <div className="relative w-full">
          <Image src={dcc1} alt="qmi1" className="w-full h-auto" />
        </div>

        <div className="absolute top-[50%] left-[-7%] w-[47%] floating-down">
          <Image src={dcc2} alt="qmi2" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[11%] right-[-10%] w-[62%] floating-down floating-delay">
          <Image src={dcc3} alt="qmi3" className="w-full h-auto" />
        </div>

        <div className="absolute top-[9%] right-[-18%] w-[45%] floating-right">
          <Image src={dcc4} alt="qmi3" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

export function Zing() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-4xl">
        <div className="relative w-full">
          <Image src={zing1} alt="qmi1" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[-3%] left-[2%] w-[64%] floating-down floating-delay">
          <Image src={zing2} alt="qmi2" className="w-full h-auto" />
        </div>

        <div className="absolute top-[-13%] right-[-19%] w-[80%] floating-up">
          <Image src={zing3} alt="qmi3" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

export function CuApts() {
  return (
    <>
      <GlobalStyles />
      <div className="relative border border-green-500 max-w-4xl">
        <div className="relative w-full">
          <Image src={cuapts1} alt="CuReviews1" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-[4%] right-[4%] w-[100%] floating-down">
          <Image src={cuapts2} alt="CuReviews2" className="w-full h-auto" />
        </div>
      </div>
    </>
  );
}

export default { CuReviews, CoursePlan, QMI, DCC, Zing, CuApts };
