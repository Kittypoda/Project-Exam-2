import { useEffect, useState } from "react";
import banner from "../assets/banner.png";
import VenueCard from "../components/VenueCard";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limit = 12; 

  useEffect(() => {
    async function fetchVenues() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues?limit=${limit}&page=${page}&sort=created&sortOrder=desc`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }
        const data = await response.json();
        console.log("Fetched page:", page, data);

        setVenues(data.data || []);
        setPageCount(data.meta?.pageCount || 1);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setError("Could not load venues. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, [page]);

  return (
    <>
      {/* Hero / Banner */}
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

      {/* Venue grid */}
      <section id="venue-section" className="max-w-7xl mx-auto mt-12 px-6">
        {loading && (
          <div className="text-center font-alexandria text-blackish text-lg">
            Loading venues...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 font-alexandria text-lg">
            {error}
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>

     {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12 font-alexandria text-blackish">
      {(() => {
        const windowSize = 5;
        const startPage = Math.floor((page - 1) / windowSize) * windowSize + 1;
        const endPage = Math.min(startPage + windowSize - 1, pageCount);

    return (
      <>
        {/* Tilbake-knapp */}
        {startPage > 1 && (
          <button
            onClick={() => setPage(startPage - windowSize)}
            className="px-3 py-1 rounded-md hover:bg-lightgray"
          >
            &lt;
          </button>
        )}

        {/* Sidetall */}
        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`px-3 py-1 rounded-md ${
                page === pageNumber
                  ? "bg-blackish text-white"
                  : "hover:bg-lightgray"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Neste-knapp */}
        {endPage < pageCount && (
          <button
            onClick={() => setPage(endPage + 1)}
            className="px-3 py-1 rounded-md hover:bg-lightgray"
          >
            &gt;
          </button>
        )}
      </>
    );
  })()}
</div>
          </>
        )}
      </section>
    </>
  );
}

