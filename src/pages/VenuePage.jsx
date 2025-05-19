import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/datepicker.css";

export default function VenuePage() {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentImg, setCurrentImg] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true&_owner=true`);
        if (!response.ok) throw new Error("Venue not found");
        const data = await response.json();
        setVenue(data.data);
        setBookedDates(getDisabledDates(data.data.bookings));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % (venue?.media?.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [venue]);

  function getDisabledDates(bookings) {
    const dates = [];
    bookings.forEach(({ dateFrom, dateTo }) => {
      let current = new Date(dateFrom);
      const end = new Date(dateTo);
      while (current < end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }
    });
    return dates;
  }

  if (loading) return <div className="text-center mt-12">Loading...</div>;
  if (error) return <div className="text-center mt-12">Error: {error}</div>;
  if (!venue) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8">
      {/* img carousel */}
      <div>
        {venue.media?.length > 0 && (
          <div
            className="relative select-none"
            onClick={() => setCurrentImg((prev) => (prev + 1) % venue.media.length)}
            onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              const touchEndX = e.changedTouches[0].clientX;
              const diff = touchStartX - touchEndX;
              if (Math.abs(diff) > 50) {
                if (diff > 0) {
                  setCurrentImg((prev) => (prev + 1) % venue.media.length);
                } else {
                  setCurrentImg((prev) => (prev - 1 + venue.media.length) % venue.media.length);
                }
              }
            }}
          >
            <img
              src={venue.media[currentImg].url}
              alt={venue.media[currentImg].alt || `Image ${currentImg + 1}`}
              className="rounded-xl w-full h-96 md:h-[27rem] object-cover cursor-pointer"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {venue.media.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === currentImg ? "bg-white" : "bg-gray-400"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImg(i);
                  }}
                ></button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info + booking */}
      <div className="flex flex-col gap-2 pt-6">
        <h1 className="text-2xl font-medium">{venue.name}</h1>
        <h2>{venue.location.city}, {venue.location.country}</h2>
        <p className="text-lg font-medium">{venue.maxGuests} Guests</p>
        <p className="text-lg font-medium">{venue.price} NOK / night</p>

        <div className="pt-6 font-alexandria text-xl">Booking</div>
        <div className="bg-lightgray text-center rounded-2xl shadow-xl px-2 py-10 md:static fixed bottom-0 left-0 right-0 z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-3 font-alexandria">
              <div>
                <label className="block text-md mb-1">Check in</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="w-full bg-transparent text-center font-thin placeholder-black rounded-md"
                  minDate={new Date()}
                />
              </div>
              <div>
                <label className="block text-md mb-1">Check out</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  excludeDates={bookedDates}
                  placeholderText="Add date"
                  className="w-full bg-transparent text-center font-thin placeholder-black"
                  minDate={startDate || new Date()}
                />
              </div>
              <div>
                <label className="block text-md mb-1">Guests</label>
                <input
                  type="number"
                  min="1"
                  max={venue.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  placeholder="Add guests"
                  className="bg-transparent text-center font-thin placeholder-black rounded-md w-20"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button className="btn btn-primary w-40">
                Reserve
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fasiliteter + Beskrivelse */}
      <div className="md:col-span-2 mt-8">
        <h2 className="text-2xl font-semibold mb-2">Facilities</h2>
        <ul className="list-disc list-inside mb-6">
          {venue.meta.wifi && <li>Wifi</li>}
          {venue.meta.pets && <li>Pets allowed</li>}
          {venue.meta.parking && <li>Parking</li>}
          {venue.meta.breakfast && <li>Breakfast</li>}
        </ul>

        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="mb-4">{venue.description}</p>
        <p className="text-md font-normal">
          Hosted by {venue.owner?.name || "Unknown"}
        </p>
      </div>
    </div>
  );
}



