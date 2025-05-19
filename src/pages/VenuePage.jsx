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
  if (error) return <div className="text-center text-red-500 mt-12">Error: {error}</div>;
  if (!venue) return null;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bildekarusell */}
      <div>
        {venue.media?.length > 0 && (
          <div className="relative">
            <img
              src={venue.media[currentImg].url}
              alt={venue.media[currentImg].alt || `Image ${currentImg + 1}`}
              className="rounded-xl w-full h-96 object-cover"
            />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {venue.media.map((_, i) => (
                <button
                  key={i}
                  className={`w-3 h-3 rounded-full ${i === currentImg ? "bg-white" : "bg-gray-400"}`}
                  onClick={() => setCurrentImg(i)}
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

        <div className="pt-6 font-alexandria">Booking</div>
        <div className="bg-lightgray rounded-xl shadow-md p-4 space-y-4">
          <div className="flex flex-col gap-2 pt-4 font-alexandria">
            <label className="text-sm">Check in</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              excludeDates={bookedDates}
              placeholderText="Add date"
              className="bg-lightgray font-thin placeholder-black w-full"
              minDate={new Date()}
            />
            <label className="text-sm">Check out</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              excludeDates={bookedDates}
              placeholderText="Add date"
              className="bg-lightgray font-thin placeholder-black w-full"
              minDate={startDate || new Date()}
            />
            <label className="text-sm">Guests</label>
            <input
              type="number"
              min="1"
              max={venue.maxGuests}
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="bg-lightgray font-thin placeholder-black w-full"
            />
            <button className="btn btn-primary">
              Reserve
            </button>
          </div>
        </div>
      </div>

      {/* Fasiliteter + Beskrivelse */}
      <div className="col-span-2 mt-8">
        <h2 className="text-2xl font-semibold mb-2">Facilities</h2>
        <ul className="list-disc list-inside mb-6">
          {venue.meta.wifi && <li>Wifi</li>}
          {venue.meta.pets && <li>Pets allowed</li>}
          {venue.meta.parking && <li>Parking</li>}
          {venue.meta.breakfast && <li>Breakfast</li>}
        </ul>

        <h2 className="text-2xl font-semibold mb-2">About</h2>
        <p className="mb-4">{venue.description}</p>
        <p className="text-sm text-gray-500 font-semibold">
          Hosted by {venue.owner?.name || "Unknown"}
        </p>
      </div>
    </div>
  );
}

