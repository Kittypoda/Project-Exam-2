import { useEffect, useState } from "react";
import banner from "../assets/banner.png";
import VenueCard from "../components/VenueCard";

export default function Home() {
  const [venues, setVenues] = useState([]);

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch("https://api.noroff.dev/api/v1/holidaze/venues");
        const data = await response.json();
        setVenues(data); 
      } catch (error) {
        console.error("Error fetching venues:", error);
      }
    }

    fetchVenues();
  }, []);

  return (
    <>
      {/* Banner */}
      <section className="relative h-[60vh] md:h-[80vh] overflow-hidden">
        <div className="relative h-full max-w-7xl mx-auto px-6 overflow-hidden rounded-40px rounded-tr-none">
          <div className="absolute inset-0 w-[120%] -translate-x-1/2 animate-float-x">
            <img
              src={banner}
              alt="Beautiful destination"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-overlaygreen/40"></div>
          <div className="relative z-10 flex flex-col justify-center h-full px-[10%] md:px-[15%]">
            <div className="text-xl text-white md:text-h1 font-alexandria font-semibold text-center md:text-left">
              A bed for every adventure
            </div>
            <div className="mt-2">
              <div className="text-3xl text-white font-alexandria font-extralight">
                Explore
              </div>
              <a
                href="#venue-section"
                className="mt-2 block text-white hover:scale-125 transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Grid */}
      <section id="venue-section" className="max-w-7xl mx-auto mt-12">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.isArray(venues) &&
            venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
        </div>
      </section>
    </>
  );
}
