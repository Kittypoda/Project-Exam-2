import banner from '../assets/banner.png';

export default function Home() {
  return (
    <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
    {/* Responsiv container som matcher headeren */}
    <div className="relative h-full max-w-7xl mx-auto px-6 overflow-hidden rounded-40px rounded-tr-none">
      
      {/* Bildet som beveger seg inni containeren */}
      <div className="absolute inset-0 w-[120%]  -translate-x-1/2 animate-float-x">
        <img
          src={banner}
          alt="Beautiful destination"
          className="w-full h-full object-cover"
        />
      </div>
  
      {/* Overlegg */}
      <div className="absolute inset-0 bg-overlaygreen/40"></div>
  
      {/* Tekst */}
<div className="relative z-10 flex flex-col justify-center h-full px-[10%] md:px-[15%]">
  <div className="text-xl text-white md:text-h1 font-alexandria font-semibold text-center md:text-left">
    A bed for every adventure
  </div>

  {/* Explore + pil */}
  <div className="mt-2">
    <div className="text-3xl text-white font-alexandria font-extralight">
      Explore
    </div>
  </div>
</div>
    </div>
  </section>
  );
}
