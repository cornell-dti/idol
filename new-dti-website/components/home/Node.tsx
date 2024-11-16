import Image from 'next/image';

// * Icons
import design from '../../public/icons/home/design.png';
import designdim from '../../public/icons/home/designDim.png';
import development from '../../public/icons/home/development.png';
import developmentdim from '../../public/icons/home/developmentDim.png';
import innovation from '../../public/icons/home/innovation.png';
import innovationdim from '/public/icons/home/innovationDim.png';

// *Images
import image1 from '/public/images/home/image1.png';
import image2 from '/public/images/home/image2.png';
import image3 from '/public/images/home/image3.png';

export default function Node() {
  return (
    <>
      <div className="relative max-w-4xl border-2 border-green-300">
        {/* Main Component */}
        <div className="inline-flex items-center space-x-5 tracking-normal lg:tracking-widest relative h-auto w-full text-white ">
          <Image className="h-auto w-16 sm:w-20 md:w-24 lg:w-32" src={design} alt="Design Icon" />
          <div className="flex flex-col lg:flex-row lg:space-x-5">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-semibold tracking-widest">
              DESIGN
            </div>
            <p className="text-xs sm:text-sm md:text-md lg:text-2xl lg:mt-2">
              Harnessing human-centered <br></br>design to solve problems with<br></br> empathy and
              creativity.
            </p>
          </div>
        </div>
        {/* Image 1 */}
        <div className="absolute w-44 h-auto">
          <Image src={image1} alt="image1" width={800} height={800} />
        </div>

        {/* Image 2 */}
        <div className="absolute w-60 h-auto right-0">
          <Image src={image2} alt="image2" width={800} height={800} />
        </div>
      </div>
    </>
  );
}
